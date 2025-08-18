import { RequestHandler } from "express";
import { config } from "dotenv";

// Load environment variables directly in this module
config();

const PAYPAL_CLIENT_ID =
  process.env.VITE_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_ENVIRONMENT =
  process.env.VITE_PAYPAL_ENVIRONMENT ||
  process.env.PAYPAL_ENVIRONMENT ||
  "sandbox";

// Validate PayPal configuration
if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.warn("PayPal credentials not configured. Set VITE_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env");
}

// PayPal API base URL
const PAYPAL_BASE_URL = PAYPAL_ENVIRONMENT === "live" 
  ? "https://api-m.paypal.com" 
  : "https://api-m.sandbox.paypal.com";

// Get PayPal access token
async function getPayPalAccessToken() {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal auth failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    throw error;
  }
}

// Create PayPal order
export const createPayPalOrder: RequestHandler = async (req, res) => {
  try {
    const { planId, amount, currency = "ZAR", userId } = req.body;

    if (!planId || !amount || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return res.status(500).json({ error: "PayPal credentials not configured" });
    }

    const accessToken = await getPayPalAccessToken();

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
          description: `SuperK53 ${planId} subscription`,
          custom_id: userId,
        },
      ],
      application_context: {
        return_url: `${req.protocol}://${req.get('host')}/pricing?success=true`,
        cancel_url: `${req.protocol}://${req.get('host')}/pricing?cancelled=true`,
        brand_name: "SuperK53",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    };

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal order creation failed:', errorData);
      return res.status(response.status).json({ 
        error: "Failed to create PayPal order",
        details: errorData 
      });
    }

    const order = await response.json();

    res.json({
      orderID: order.id,
      status: order.status,
      message: "PayPal order created successfully",
    });
  } catch (error) {
    console.error("Create PayPal order error:", error);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

// Capture PayPal payment
export const capturePayPalOrder: RequestHandler = async (req, res) => {
  try {
    const { orderID, planId, userId } = req.body;

    if (!orderID || !planId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      return res.status(500).json({ error: "PayPal credentials not configured" });
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PayPal capture failed:', errorData);
      return res.status(response.status).json({ 
        error: "Failed to capture PayPal payment",
        details: errorData 
      });
    }

    const captureData = await response.json();

    // Extract payment details
    const paymentId = captureData.purchase_units[0]?.payments?.captures[0]?.id;
    const status = captureData.status;
    const amount = captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value;
    const currency = captureData.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code;

    res.json({
      success: true,
      paymentId: paymentId,
      orderId: orderID,
      planId,
      status,
      amount,
      currency,
      message: "Payment captured successfully! Subscription activated.",
    });
  } catch (error) {
    console.error("Capture PayPal order error:", error);
    res.status(500).json({ error: "Failed to capture PayPal payment" });
  }
};
