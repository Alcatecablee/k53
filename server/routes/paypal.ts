import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// PayPal API configuration
const PAYPAL_CLIENT_ID =
  process.env.VITE_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT =
  process.env.VITE_PAYPAL_ENVIRONMENT ||
  process.env.PAYPAL_ENVIRONMENT ||
  "sandbox";

const PAYPAL_BASE_URL =
  PAYPAL_ENVIRONMENT === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// Lazy Supabase client initialization
let supabase: any = null;

const getSupabaseClient = () => {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing");
    }

    supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabase;
};

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `PayPal auth error: ${data.error_description || data.error}`,
    );
  }

  return data.access_token;
}

// Create PayPal order
export const createPayPalOrder: RequestHandler = async (req, res) => {
  try {
    const { planId, amount, currency = "USD", userId } = req.body;

    if (!planId || !amount || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get plan details for validation
    const planMap: Record<string, { name: string; price_cents: number }> = {
      basic: { name: "SuperK53 Basic", price_cents: 5000 },
      pro: { name: "SuperK53 Pro", price_cents: 12000 },
    };

    const plan = planMap[planId];
    if (!plan) {
      return res.status(400).json({ error: "Invalid plan ID" });
    }

    // PayPal supports ZAR directly, no conversion needed
    const paypalAmount = parseFloat(amount).toFixed(2);
    const paypalCurrency = currency === "ZAR" ? "USD" : currency; // Use USD for broader compatibility

    // Convert ZAR to USD for PayPal (dynamic rate would be better in production)
    const finalAmount =
      currency === "ZAR"
        ? (parseFloat(amount) * 0.055).toFixed(2) // R50 ≈ $2.75, R120 ≈ $6.60
        : paypalAmount;

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // USD for better international support
            value: finalAmount,
          },
          description: `${plan.name} - Monthly Subscription`,
          custom_id: `${userId}-${planId}-${Date.now()}`,
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: "UNRESTRICTED", // Allows cards and PayPal
            brand_name: "SuperK53",
            locale: "en-ZA",
            landing_page: "GUEST_CHECKOUT", // Prioritize guest checkout
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
          },
        },
      },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `${userId}-${Date.now()}`, // Idempotency
      },
      body: JSON.stringify(orderData),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error("PayPal order creation failed:", order);
      return res
        .status(400)
        .json({ error: order.message || "Failed to create PayPal order" });
    }

    // Store pending payment in database
    await getSupabaseClient().from("payments").insert({
      user_id: userId,
      amount_cents: plan.price_cents,
      currency: "ZAR",
      status: "pending",
      payment_method: "paypal",
      paypal_order_id: order.id,
    });

    res.json({ orderID: order.id });
  } catch (error) {
    console.error("Create PayPal order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Capture PayPal payment
export const capturePayPalOrder: RequestHandler = async (req, res) => {
  try {
    const { orderID, planId, userId } = req.body;

    if (!orderID || !planId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const accessToken = await getPayPalAccessToken();

    // Capture the payment
    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const captureData = await response.json();

    if (!response.ok) {
      console.error("PayPal capture failed:", captureData);

      // Update payment status to failed
      await supabase
        .from("payments")
        .update({
          status: "failed",
          failure_reason: captureData.message || "Capture failed",
        })
        .eq("paypal_order_id", orderID);

      return res
        .status(400)
        .json({ error: captureData.message || "Payment capture failed" });
    }

    // Extract payment details
    const capture = captureData.purchase_units[0].payments.captures[0];
    const paypalPaymentId = capture.id;
    const paypalPayerId = captureData.payer?.payer_id;

    // Update payment record
    await supabase
      .from("payments")
      .update({
        status: "completed",
        paypal_payment_id: paypalPaymentId,
        paypal_payer_id: paypalPayerId,
        processed_at: new Date().toISOString(),
      })
      .eq("paypal_order_id", orderID);

    // Create or update user subscription
    const planMap: Record<
      string,
      { price_cents: number; billing_cycle: string }
    > = {
      basic: { price_cents: 5000, billing_cycle: "monthly" },
      pro: { price_cents: 12000, billing_cycle: "monthly" },
    };

    const plan = planMap[planId];
    const currentDate = new Date();
    const nextBillingDate = new Date(currentDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingSubscription) {
      // Update existing subscription
      await supabase
        .from("user_subscriptions")
        .update({
          plan_type: planId,
          status: "active",
          price_cents: plan.price_cents,
          billing_cycle: plan.billing_cycle,
          current_period_start: currentDate.toISOString(),
          current_period_end: nextBillingDate.toISOString(),
          canceled_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      // Create new subscription
      await getSupabaseClient().from("user_subscriptions").insert({
        user_id: userId,
        plan_type: planId,
        status: "active",
        price_cents: plan.price_cents,
        currency: "ZAR",
        billing_cycle: plan.billing_cycle,
        current_period_start: currentDate.toISOString(),
        current_period_end: nextBillingDate.toISOString(),
      });
    }

    // Update daily usage limits for the user
    const maxLimits =
      planId === "basic"
        ? { scenarios: -1, questions: -1 }
        : { scenarios: -1, questions: -1 };

    await supabase
      .from("daily_usage")
      .upsert({
        user_id: userId,
        date: currentDate.toISOString().split("T")[0],
        scenarios_used: 0,
        questions_used: 0,
        max_scenarios: maxLimits.scenarios,
        max_questions: maxLimits.questions,
      })
      .eq("user_id", userId);

    res.json({
      success: true,
      paymentId: paypalPaymentId,
      orderId: orderID,
      planId,
      message: "Payment successful! Your subscription is now active.",
    });
  } catch (error) {
    console.error("Capture PayPal order error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Cancel subscription
export const cancelSubscription: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    // Update subscription status
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    // Reset daily usage to free tier limits
    await supabase
      .from("daily_usage")
      .update({
        max_scenarios: 5,
        max_questions: 10,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    res.json({ success: true, message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get payment history
export const getPaymentHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID" });
    }

    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ payments });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
