import { supabase, supabaseClient } from "@/lib/supabase";
import {
  SUBSCRIPTION_PLANS,
  type UserSubscription,
  type DailyUsage,
  type SubscriptionPlan,
} from "@/types/subscription";
import { isOfflineMode } from "@/services/networkService";
import { logWarning } from "@/services/notificationService";

// Get user's current subscription
export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  try {
    // Check if we have a valid user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return null;
    }

    // Try to get subscription from database using the client
    const client = supabaseClient;
    if (!client) {
      return null;
    }

    const { data: subscription, error } = await client
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      // Log error for debugging but don't expose to user
      console.warn("Subscription table error:", error);
      // Return null for missing table or permission issues
      return null;
    }

    if (subscription) {
      return {
        id: subscription.id,
        user_id: subscription.user_id,
        plan_type: subscription.plan_type as "free" | "basic" | "standard" | "premium",
        status: subscription.status as "active" | "canceled" | "expired" | "trial",
        price_cents: subscription.price_cents || 0,
        currency: subscription.currency || "ZAR",
        billing_cycle: subscription.billing_cycle || "monthly",
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        created_at: subscription.created_at,
        updated_at: subscription.updated_at,
      };
    }

    return null;
  } catch (error) {
    // Return null instead of mock data for production readiness
    return null;
  }
};

// Get user's daily usage
export const getDailyUsage = async (
  date?: string,
): Promise<DailyUsage | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const targetDate = date || new Date().toISOString().split("T")[0];

    // Check localStorage for daily usage (fallback when database is unavailable)
    const storageKey = `daily_usage_${user.id}_${targetDate}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      return JSON.parse(stored);
    }

    // Create new daily usage record
    const usage: DailyUsage = {
      id: `usage-${user.id}-${targetDate}`,
      user_id: user.id,
      date: targetDate,
      scenarios_used: 0,
      questions_used: 0,
      max_scenarios: 5, // Free tier default
      max_questions: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(usage));
    return usage;
  } catch (error) {
    logWarning("Error getting daily usage", { error, context: "getDailyUsage" });
    return null;
  }
};

// Update daily usage
export const updateDailyUsage = async (
  type: "scenarios" | "questions",
  increment: number = 1,
): Promise<DailyUsage | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const today = new Date().toISOString().split("T")[0];
    let usage = await getDailyUsage(today);

    if (!usage) return null;

    // Update usage count
    if (type === "scenarios") {
      usage.scenarios_used += increment;
    } else {
      usage.questions_used += increment;
    }

    usage.updated_at = new Date().toISOString();

    // Save to localStorage
    const storageKey = `daily_usage_${user.id}_${today}`;
    localStorage.setItem(storageKey, JSON.stringify(usage));

    return usage;
  } catch (error) {
    logWarning("Error updating daily usage", { error, context: "updateDailyUsage" });
    return null;
  }
};

// Check if user can access scenarios
// NOTE: Question-based assessments (Practice & Official) are ALWAYS FREE and UNLIMITED for ALL users
// Only scenario-based assessments have usage limits based on subscription tier
export const canAccessScenarios = async (): Promise<{
  canAccess: boolean;
  remaining: number;
  isSubscribed: boolean;
}> => {
  try {
    const [subscription, usage] = await Promise.all([
      getUserSubscription(),
      getDailyUsage(),
    ]);

    // Check if user has active subscription
    const isSubscribed =
      subscription?.plan_type !== "free" && subscription?.status === "active";

    if (isSubscribed) {
      return { canAccess: true, remaining: -1, isSubscribed: true }; // Unlimited
    }

    // Free user - check daily limits
    const maxScenarios = usage?.max_scenarios || 5;
    const used = usage?.scenarios_used || 0;
    const remaining = Math.max(0, maxScenarios - used);

    return {
      canAccess: remaining > 0,
      remaining,
      isSubscribed: false,
    };
  } catch (error) {
    logWarning("Error checking scenario access", { error, context: "canAccessScenarios" });
    return { canAccess: true, remaining: 5, isSubscribed: false }; // Fallback to allow access
  }
};

// Get subscription plan by ID
export const getSubscriptionPlan = (
  planId: string,
): SubscriptionPlan | null => {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) || null;
};

// Format price for display
export const formatPrice = (
  priceCents: number,
  currency: string = "ZAR",
): string => {
  const amount = priceCents / 100;
  if (currency === "ZAR") {
    return `R${amount.toFixed(0)}`;
  }
  return `${currency} ${amount.toFixed(2)}`;
};

// Check if it's a new day (reset usage)
export const isNewDay = (lastUsageDate: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return lastUsageDate !== today;
};

// Get user's purchased scenario packs
export const getUserScenarioPacks = async (): Promise<string[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // For now, return empty array since we don't have the database set up
    // In production, this would query the user_purchases table
    return [];
  } catch (error) {
    logWarning("Error getting user scenario packs", { error, context: "getUserScenarioPacks" });
    return [];
  }
};

// Check if user has premium access for advanced features
export const hasPremiumAccess = async (): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription();
    
    // Check if user has active premium subscription
    const isPremium = subscription?.plan_type === "premium" && subscription?.status === "active";
    
    return isPremium;
  } catch (error) {
    logWarning("Error checking premium access", { error, context: "hasPremiumAccess" });
    return false;
  }
};

// Check if user has any paid subscription (Basic, Standard, or Premium)
export const hasPaidSubscription = async (): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription();
    
    // Check if user has any active paid subscription
    const isPaid = subscription?.plan_type !== "free" && subscription?.status === "active";
    
    return isPaid;
  } catch (error) {
    logWarning("Error checking paid subscription", { error, context: "hasPaidSubscription" });
    return false;
  }
};
