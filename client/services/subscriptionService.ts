import { supabase } from '@/lib/supabase';
import { SUBSCRIPTION_PLANS, type UserSubscription, type DailyUsage, type SubscriptionPlan } from '@/types/subscription';
import { isOfflineMode } from '@/services/networkService';

// Get user's current subscription
export const getUserSubscription = async (): Promise<UserSubscription | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // For now, return a mock subscription since we don't have the database set up yet
    // In production, this would query the user_subscriptions table
    const mockSubscription: UserSubscription = {
      id: 'mock-sub-1',
      user_id: user.id,
      plan_type: 'free',
      status: 'active',
      price_cents: 0,
      currency: 'ZAR',
      billing_cycle: 'monthly',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: user.created_at,
      updated_at: new Date().toISOString(),
    };

    return mockSubscription;
  } catch (error) {
    console.warn('Error getting user subscription:', error);
    return null;
  }
};

// Get user's daily usage
export const getDailyUsage = async (date?: string): Promise<DailyUsage | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const targetDate = date || new Date().toISOString().split('T')[0];
    
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
    console.warn('Error getting daily usage:', error);
    return null;
  }
};

// Update daily usage
export const updateDailyUsage = async (type: 'scenarios' | 'questions', increment: number = 1): Promise<DailyUsage | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0];
    let usage = await getDailyUsage(today);
    
    if (!usage) return null;

    // Update usage count
    if (type === 'scenarios') {
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
    console.warn('Error updating daily usage:', error);
    return null;
  }
};

// Check if user can access scenarios
export const canAccessScenarios = async (): Promise<{ canAccess: boolean; remaining: number; isSubscribed: boolean }> => {
  try {
    const [subscription, usage] = await Promise.all([
      getUserSubscription(),
      getDailyUsage()
    ]);

    // Check if user has active subscription
    const isSubscribed = subscription?.plan_type !== 'free' && subscription?.status === 'active';
    
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
      isSubscribed: false
    };
  } catch (error) {
    console.warn('Error checking scenario access:', error);
    return { canAccess: true, remaining: 5, isSubscribed: false }; // Fallback to allow access
  }
};

// Get subscription plan by ID
export const getSubscriptionPlan = (planId: string): SubscriptionPlan | null => {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null;
};

// Format price for display
export const formatPrice = (priceCents: number, currency: string = 'ZAR'): string => {
  const amount = priceCents / 100;
  if (currency === 'ZAR') {
    return `R${amount.toFixed(0)}`;
  }
  return `${currency} ${amount.toFixed(2)}`;
};

// Check if it's a new day (reset usage)
export const isNewDay = (lastUsageDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return lastUsageDate !== today;
};

// Get user's purchased scenario packs
export const getUserScenarioPacks = async (): Promise<string[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // For now, return empty array since we don't have the database set up
    // In production, this would query the user_purchases table
    return [];
  } catch (error) {
    console.warn('Error getting user scenario packs:', error);
    return [];
  }
};
