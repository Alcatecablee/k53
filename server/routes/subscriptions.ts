import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Supabase client for database operations
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware to validate user authentication
const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No authorization token provided" });
    }

    const token = authHeader.substring(7);

    // Validate JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Token validation error:", error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

// Server-side validation for scenario access
export const validateScenarioAccess: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (subError && subError.code !== "PGRST116") {
      console.error("Error fetching subscription:", subError);
      return res.status(500).json({ error: "Database error" });
    }

    // Check if user has active subscription
    const isSubscribed = subscription?.plan_type !== "free" && subscription?.status === "active";

    if (isSubscribed) {
      return res.json({ 
        allowed: true, 
        remaining: -1, 
        isSubscribed: true,
        plan: subscription.plan_type 
      });
    }

    // Check daily usage for free users
    const today = new Date().toISOString().split("T")[0];
    const { data: usage, error: usageError } = await supabase
      .from("daily_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (usageError && usageError.code !== "PGRST116") {
      console.error("Error fetching daily usage:", usageError);
      return res.status(500).json({ error: "Database error" });
    }

    let currentUsage = usage;
    if (!currentUsage) {
      // Create new usage record for today
      const { data: newUsage, error: createError } = await supabase
        .from("daily_usage")
        .insert({
          user_id: userId,
          date: today,
          scenarios_used: 0,
          questions_used: 0,
          max_scenarios: 5,
          max_questions: 10,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating usage record:", createError);
        return res.status(500).json({ error: "Database error" });
      }

      currentUsage = newUsage;
    }

    const remaining = Math.max(0, currentUsage.max_scenarios - currentUsage.scenarios_used);

    res.json({
      allowed: remaining > 0,
      remaining,
      isSubscribed: false,
      used: currentUsage.scenarios_used,
      max: currentUsage.max_scenarios,
    });

  } catch (error) {
    console.error("Validate scenario access error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Record scenario usage (server-side enforcement)
export const recordScenarioUsage: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // First validate that user can access scenarios
    const validationResponse = await new Promise<any>((resolve) => {
      const mockReq = { user: { id: userId } } as any;
      const mockRes = {
        json: resolve,
        status: () => ({ json: resolve }),
      } as any;
      validateScenarioAccess(mockReq, mockRes, () => {});
    });

    if (!validationResponse.allowed) {
      return res.status(403).json({ 
        error: "Daily scenario limit reached",
        remaining: validationResponse.remaining,
        isSubscribed: validationResponse.isSubscribed,
      });
    }

    // If user has unlimited access, no need to track usage
    if (validationResponse.isSubscribed) {
      return res.json({ 
        success: true, 
        remaining: -1, 
        message: "Unlimited access" 
      });
    }

    // Update usage count for free users
    const today = new Date().toISOString().split("T")[0];
    const { data: updatedUsage, error } = await supabase
      .from("daily_usage")
      .update({ 
        scenarios_used: supabase.sql`scenarios_used + 1`,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("date", today)
      .select()
      .single();

    if (error) {
      console.error("Error updating scenario usage:", error);
      return res.status(500).json({ error: "Database error" });
    }

    const remaining = Math.max(0, updatedUsage.max_scenarios - updatedUsage.scenarios_used);

    res.json({
      success: true,
      remaining,
      used: updatedUsage.scenarios_used,
      max: updatedUsage.max_scenarios,
    });

  } catch (error) {
    console.error("Record scenario usage error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user subscription details
export const getUserSubscriptionDetails: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching subscription:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (!subscription) {
      // Return default free subscription
      return res.json({
        plan_type: "free",
        status: "active",
        price_cents: 0,
        currency: "ZAR",
        billing_cycle: "monthly",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    res.json(subscription);

  } catch (error) {
    console.error("Get subscription details error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user usage statistics
export const getUserUsageStats: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const today = new Date().toISOString().split("T")[0];
    
    // Get today's usage
    const { data: todayUsage, error: todayError } = await supabase
      .from("daily_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (todayError && todayError.code !== "PGRST116") {
      console.error("Error fetching today's usage:", todayError);
      return res.status(500).json({ error: "Database error" });
    }

    // Get usage history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: usageHistory, error: historyError } = await supabase
      .from("daily_usage")
      .select("*")
      .eq("user_id", userId)
      .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
      .order("date", { ascending: false });

    if (historyError) {
      console.error("Error fetching usage history:", historyError);
      return res.status(500).json({ error: "Database error" });
    }

    // Calculate statistics
    const totalScenarios = usageHistory?.reduce((sum, day) => sum + day.scenarios_used, 0) || 0;
    const totalQuestions = usageHistory?.reduce((sum, day) => sum + day.questions_used, 0) || 0;
    const averageDaily = usageHistory?.length > 0 ? totalScenarios / usageHistory.length : 0;

    res.json({
      today: {
        scenarios_used: todayUsage?.scenarios_used || 0,
        questions_used: todayUsage?.questions_used || 0,
        max_scenarios: todayUsage?.max_scenarios || 5,
        max_questions: todayUsage?.max_questions || 10,
        scenarios_remaining: Math.max(0, (todayUsage?.max_scenarios || 5) - (todayUsage?.scenarios_used || 0)),
      },
      last30Days: {
        total_scenarios: totalScenarios,
        total_questions: totalQuestions,
        average_daily_scenarios: Math.round(averageDaily * 10) / 10,
        active_days: usageHistory?.length || 0,
      },
      history: usageHistory || [],
    });

  } catch (error) {
    console.error("Get usage stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Apply auth middleware to all routes that need it
export const authenticatedValidateScenarioAccess = [requireAuth, validateScenarioAccess];
export const authenticatedRecordScenarioUsage = [requireAuth, recordScenarioUsage];
export const authenticatedGetUserSubscriptionDetails = [requireAuth, getUserSubscriptionDetails];
export const authenticatedGetUserUsageStats = [requireAuth, getUserUsageStats];
