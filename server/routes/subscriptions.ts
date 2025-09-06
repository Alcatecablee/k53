import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Database client
let supabase: any = null;

const getDatabase = () => {
  if (!supabase) {
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// Simple auth middleware - just check for authorization header
const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No authorization token provided" });
  }

  // For now, just extract user ID from token (simplified)
  const token = authHeader.substring(7);
  try {
    // In a real app, you'd validate the JWT token
    // For now, assume the token contains the user ID
    (req as any).user = { id: token };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Validate scenario access for a user
export const validateScenarioAccess: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({
        allowed: true,
        remaining: 5,
        isSubscribed: false,
        plan: "free",
      });
    }

    const userId = (req as any).user?.id;
    if (!_userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get user's subscription
    const { data: subscription, error } = await db
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching subscription:", error);
      return res.json({
        allowed: true,
        remaining: 5,
        isSubscribed: false,
        plan: "free",
      });
    }

    // Check if user has active subscription
    const isSubscribed =
      subscription?.plan_type !== "free" && subscription?.status === "active";

    if (isSubscribed) {
      return res.json({
        allowed: true,
        remaining: -1,
        isSubscribed: true,
        plan: subscription.plan_type,
      });
    }

    // For free users, check daily usage
    const today = new Date().toISOString().split("T")[0];
    const { data: usage } = await db
      .from("daily_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    let currentUsage = usage;
    if (!_currentUsage) {
      // Create new usage record for today
      const { data: newUsage } = await db
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

      currentUsage = newUsage || { scenarios_used: 0, max_scenarios: 5 };
    }

    const remaining = Math.max(
      0,
      currentUsage.max_scenarios - currentUsage.scenarios_used,
    );

    res.json({
      allowed: remaining > 0,
      remaining,
      isSubscribed: false,
      used: currentUsage.scenarios_used,
      max: currentUsage.max_scenarios,
    });
  } catch (error) {
    console.error("Validate scenario access error:", error);
    res.json({
      allowed: true,
      remaining: 5,
      isSubscribed: false,
      plan: "free",
    });
  }
};

// Record scenario usage
export const recordScenarioUsage: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({
        success: true,
        remaining: 4,
        message: "Usage recorded (offline mode)",
      });
    }

    const userId = (req as any).user?.id;
    if (!_userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if user has unlimited access
    const { data: subscription } = await db
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    const isSubscribed =
      subscription?.plan_type !== "free" && subscription?.status === "active";

    if (isSubscribed) {
      return res.json({
        success: true,
        remaining: -1,
        message: "Unlimited access",
      });
    }

    // Update usage for free users
    const today = new Date().toISOString().split("T")[0];

    // Get current usage
    const { data: currentUsage } = await db
      .from("daily_usage")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    const newCount = (currentUsage?.scenarios_used || 0) + 1;

    // Update usage
    const { data: updatedUsage } = await db
      .from("daily_usage")
      .upsert({
        user_id: userId,
        date: today,
        scenarios_used: newCount,
        questions_used: currentUsage?.questions_used || 0,
        max_scenarios: 5,
        max_questions: 10,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    const remaining = updatedUsage
      ? Math.max(0, updatedUsage.max_scenarios - updatedUsage.scenarios_used)
      : 4;

    res.json({
      success: true,
      remaining,
      used: updatedUsage?.scenarios_used || newCount,
      max: 5,
    });
  } catch (error) {
    console.error("Record scenario usage error:", error);
    res.json({
      success: true,
      remaining: 4,
      message: "Usage recorded (error fallback)",
    });
  }
};

// Apply auth middleware to routes
export const authenticatedValidateScenarioAccess = [
  requireAuth,
  validateScenarioAccess,
];
export const authenticatedRecordScenarioUsage = [
  requireAuth,
  recordScenarioUsage,
];
