import { supabase, supabaseClient } from '@/lib/supabase';
import { SUBSCRIPTION_PLANS, UserSubscription, DailyUsage, SubscriptionPlan } from '@/types/subscription';
import { isOfflineMode } from '@/services/networkService';
import { logWarning } from '@/services/notificationService';
import type { User } from '@supabase/supabase-js';

// Get user's current subscription
export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  try {
    // Check if we have a valid user session
    const response = await supabase.auth.getUser();
    const user = response.data?.user;
    
    if (response.error || !user?.id) {
      console.warn('No authenticated user found:', response.error);
      return null;
    }

    // Check if we're in offline mode
    if (isOfflineMode()) {
      console.warn('Offline mode detected, returning null subscription');
      return null;
    }

    // Check if supabaseClient is available
    if (!supabaseClient) {
      console.warn('Supabase client not available');
      return null;
    }

    // Get subscription from database
    const { data: subscription, error } = await supabaseClient
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error) {
      // No subscription found is not necessarily an error
      if (error.code === 'PGRST116') {
        console.log('No active subscription found for user');
        return null;
      }
      throw error;
    }

    return subscription as UserSubscription;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    return null;
  }
};

// Check if user has an active subscription
export const hasActiveSubscription = async (): Promise<boolean> => {
  const subscription = await getUserSubscription();
  return subscription !== null && subscription.status === 'active';
};

// Check if user can access scenarios based on their subscription
export const canAccessScenarios = async (): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription();
    
    if (!subscription) {
      // Free tier users can access scenarios with daily limits
      const usage = await getDailyUsage();
      return usage ? usage.scenarios_used < 5 : true;
    }

    // Premium users check their specific limits
    const plan = getSubscriptionPlan(subscription.plan_type);
    if (!plan) return false;

    // Check if subscription is active and not expired
    if (subscription.status !== 'active') return false;
    
    // Check expiration if current_period_end exists
    if (subscription.current_period_end) {
      const expirationDate = new Date(subscription.current_period_end);
      if (expirationDate < new Date()) return false;
    }

    // Check daily limits
    const usage = await getDailyUsage();
    if (!usage) return true;

    return plan.max_scenarios_per_day === -1 || usage.scenarios_used < plan.max_scenarios_per_day;
  } catch (error) {
    console.error('Error checking scenario access:', error);
    return false;
  }
};

// Get user's daily usage for a specific date
export const getDailyUsage = async (date?: string): Promise<DailyUsage | null> => {
  try {
    const response = await supabase.auth.getUser();
    const user = response.data?.user;
    
    if (!user?.id) return null;

    const targetDate = date || new Date().toISOString().split("T")[0];

    // Default usage object
    const defaultUsage: DailyUsage = {
      id: `usage-${user.id}-${targetDate}`,
      user_id: user.id,
      date: targetDate,
      scenarios_used: 0,
      questions_used: 0,
      max_scenarios: 5, // Free tier default
      max_questions: 10
    };

    // Check if supabaseClient is available
    if (!supabaseClient) {
      console.warn('Supabase client not available, using localStorage fallback');
      const storageKey = `daily_usage_${user.id}_${targetDate}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        try {
          return JSON.parse(stored) as DailyUsage;
        } catch (parseError) {
          console.warn("Failed to parse stored usage data:", parseError);
        }
      }
      
      localStorage.setItem(storageKey, JSON.stringify(defaultUsage));
      return defaultUsage;
    }

    // Try to get usage from database first
    try {
      const { data: dbUsage, error } = await supabaseClient
        .from("daily_usage")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", targetDate)
        .maybeSingle();

      if (dbUsage && !error) {
        return dbUsage as DailyUsage;
      }

      // If no record exists, create one
      const insertPayload = {
        user_id: user.id,
        date: targetDate,
        scenarios_used: 0,
        questions_used: 0,
        max_scenarios: 5,
        max_questions: 10
      };
      const { data: newUsage, error: insertError } = await supabaseClient
        .from("daily_usage")
        .insert(insertPayload)
        .select()
        .single();

      if (newUsage && !insertError) {
        return newUsage as DailyUsage;
      }

    } catch (dbError) {
      console.warn("Database access failed, falling back to localStorage:", dbError);
    }

    // Fallback to localStorage if database fails
    const storageKey = `daily_usage_${user.id}_${targetDate}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        return JSON.parse(stored) as DailyUsage;
      } catch (parseError) {
        console.warn("Failed to parse stored usage data:", parseError);
      }
    }

    // Save default to localStorage and return it
    localStorage.setItem(storageKey, JSON.stringify(defaultUsage));
    return defaultUsage;

  } catch (error) {
    console.error("Error getting daily usage:", error);
    return null;
  }
};

// Update user's daily usage
export const updateDailyUsage = async (usage: Partial<DailyUsage>): Promise<boolean> => {
  try {
    const response = await supabase.auth.getUser();
    const user = response.data?.user;
    
    if (!user?.id) return false;

    const today = new Date().toISOString().split("T")[0];
    const storageKey = `daily_usage_${user.id}_${today}`;

    // Check if supabaseClient is available
    if (!supabaseClient) {
      console.warn('Supabase client not available, using localStorage fallback');
      const currentUsage = await getDailyUsage(today);
      const updatedUsage = { ...currentUsage, ...usage };
      localStorage.setItem(storageKey, JSON.stringify(updatedUsage));
      return true;
    }

    // Try to update in database first
    try {
      const { error } = await supabaseClient
        .from("daily_usage")
        .upsert({
          user_id: user.id,
          date: today,
          ...usage,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        return true;
      }
    } catch (dbError) {
      console.warn("Database update failed, falling back to localStorage:", dbError);
    }

    // Fallback to localStorage
    const currentUsage = await getDailyUsage(today);
    const updatedUsage = { ...currentUsage, ...usage };
    localStorage.setItem(storageKey, JSON.stringify(updatedUsage));
    return true;

  } catch (error) {
    console.error("Error updating daily usage:", error);
    return false;
  }
};

// Format price for display
export const formatPrice = (priceCents: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(priceCents / 100);
};

// Get subscription plan by ID
export const getSubscriptionPlan = (planId: string): SubscriptionPlan | null => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null;
};

// Check if user has reached daily limits
export const hasReachedDailyLimit = async (type: 'scenarios' | 'questions'): Promise<boolean> => {
  try {
    const usage = await getDailyUsage();
    if (!usage) return false;

    const subscription = await getUserSubscription();
    if (!subscription) {
      // Free tier limits
      return type === 'scenarios' ? usage.scenarios_used >= 5 : usage.questions_used >= 10;
    }

    // Premium users have higher limits
    const plan = getSubscriptionPlan(subscription.plan_type);
    if (!plan) return false;
    const limit = type === 'scenarios' ? plan.max_scenarios_per_day : plan.max_questions_per_day;
    if (limit === -1) return false;
    const used = type === 'scenarios' ? usage.scenarios_used : usage.questions_used;

    return used >= limit;
  } catch (error) {
    console.error('Error checking daily limits:', error);
    return false;
  }
};

// Increment usage counter
export const incrementUsage = async (type: 'scenarios' | 'questions'): Promise<boolean> => {
  try {
    const usage = await getDailyUsage();
    if (!usage) return false;

    const updatedUsage = {
      ...usage,
      [type === 'scenarios' ? 'scenarios_used' : 'questions_used']: 
        (usage[type === 'scenarios' ? 'scenarios_used' : 'questions_used'] || 0) + 1
    };

    return await updateDailyUsage(updatedUsage);
  } catch (error) {
    console.error('Error incrementing usage:', error);
    return false;
  }
};

// Reset daily usage (for testing or admin purposes)
export const resetDailyUsage = async (): Promise<boolean> => {
  try {
    const response = await supabase.auth.getUser();
    const user = response.data?.user;
    
    if (!user?.id) return false;

    const today = new Date().toISOString().split("T")[0];
    const storageKey = `daily_usage_${user.id}_${today}`;

    // Check if supabaseClient is available
    if (!supabaseClient) {
      localStorage.removeItem(storageKey);
      return true;
    }

    // Try to reset in database
    try {
      const { error } = await supabaseClient
        .from("daily_usage")
        .delete()
        .eq("user_id", user.id)
        .eq("date", today);

      if (!error) {
        localStorage.removeItem(storageKey);
        return true;
      }
    } catch (dbError) {
      console.warn("Database reset failed, falling back to localStorage:", dbError);
    }

    // Fallback to localStorage
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Error resetting daily usage:', error);
    return false;
  }
};

// Check if user has premium access for advanced features
export const hasPremiumAccess = async (): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription();
    const isPremium = subscription?.plan_type === "premium" && subscription?.status === "active";
    return Boolean(isPremium);
  } catch (error) {
    logWarning("Error checking premium access", { error, context: "hasPremiumAccess" });
    return false;
  }
};

// Check if user has any paid subscription (Basic, Standard, or Premium)
export const hasPaidSubscription = async (): Promise<boolean> => {
  try {
    const subscription = await getUserSubscription();
    const isPaid = subscription != null && subscription.plan_type !== "free" && subscription.status === "active";
    return Boolean(isPaid);
  } catch (error) {
    logWarning("Error checking paid subscription", { error, context: "hasPaidSubscription" });
    return false;
  }
};
