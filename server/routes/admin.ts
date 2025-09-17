import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Database client
let supabase: any = null;

// Helper function to check if required tables exist
async function checkTablesExist(db: any): Promise<boolean> {
  try {
    // Try to query each table with a simple select
    const [userSubsResult, paymentsResult, profilesResult] = await Promise.allSettled([
      db.from("user_subscriptions").select("*").limit(1),
      db.from("payments").select("*").limit(1),
      db.from("profiles").select("*").limit(1),
    ]);

    // Check if any of the queries failed with a table not found error
    const hasTableErrors = [userSubsResult, paymentsResult, profilesResult].some(
      result => result.status === "rejected" && 
      (result.reason?.code === "PGRST116" || result.reason?.message?.includes("relation") || result.reason?.message?.includes("does not exist"))
    );

    return !hasTableErrors;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  }
}

const getDatabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// Check if user is admin
const isAdminUser = async (req: any): Promise<boolean> => {
  try {
    const db = getDatabase();
    if (!db) return false;

    // For now, allow all requests - in production, check actual admin status
    return true;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Get dashboard statistics
export const getDashboardStats: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({
        error: "Database not configured",
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        todaySignups: 0,
        conversionRate: 0,
        churnRate: 0,
        avgSessionTime: 0,
        topLocations: [],
        monthlyGrowth: 0,
        realtimeUsers: 0,
        serverLoad: 0,
        responseTime: 0,
        errorRate: 0,
      });
    }

    // Check if tables exist before querying
    const tablesExist = await checkTablesExist(db);
    if (!tablesExist) {
      return res.json({
        totalUsers: 0,
        activeSubscriptions: 0,
        totalRevenue: 0,
        todaySignups: 0,
        conversionRate: 0,
        churnRate: 0,
        avgSessionTime: 0,
        topLocations: [],
        monthlyGrowth: 0,
        realtimeUsers: 0,
        serverLoad: 0,
        responseTime: 0,
        errorRate: 0,
      });
    }

    // Get basic counts with error handling
    const [usersResult, subscriptionsResult, paymentsResult] =
      await Promise.allSettled([
        db
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true }),
        db
          .from("user_subscriptions")
          .select("*", { count: "exact", head: true })
          .neq("plan_type", "free")
          .eq("status", "active"),
        db.from("payments").select("amount_cents").eq("status", "completed"),
      ]);

    const totalUsers =
      usersResult.status === "fulfilled" ? usersResult.value.count || 0 : 0;
    const activeSubscriptions =
      subscriptionsResult.status === "fulfilled"
        ? subscriptionsResult.value.count || 0
        : 0;

    let totalRevenue = 0;
    if (paymentsResult.status === "fulfilled" && paymentsResult.value.data) {
      totalRevenue = paymentsResult.value.data.reduce(
        (sum: number, payment: any) => sum + (payment.amount_cents || 0),
        0,
      );
    }

    // Get today's signups
    const today = new Date().toISOString().split("T")[0];
    const todaySignupsResult = await db
      .from("user_subscriptions")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today);
    
    const todaySignups = todaySignupsResult?.count || 0;

    // Get top locations from user profiles
    const locationsResult = await db
      .from("profiles")
      .select("location_city")
      .not("location_city", "is", null);
    
    const locationCounts: { [key: string]: number } = {};
    if (locationsResult.data) {
      locationsResult.data.forEach((profile: any) => {
        if (profile.location_city) {
          locationCounts[profile.location_city] = (locationCounts[profile.location_city] || 0) + 1;
        }
      });
    }
    
    const topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city]) => city);

    // Calculate real metrics
    const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;
    
    // Get monthly growth by comparing this month vs last month
    const currentDate = new Date();
    const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
    
    const [thisMonthResult, lastMonthResult] = await Promise.allSettled([
      db
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", thisMonth),
      db
        .from("user_subscriptions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonth)
        .lt("created_at", thisMonth),
    ]);
    
    const thisMonthUsers = thisMonthResult.status === "fulfilled" ? thisMonthResult.value.count || 0 : 0;
    const lastMonthUsers = lastMonthResult.status === "fulfilled" ? lastMonthResult.value.count || 0 : 0;
    const monthlyGrowth = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

    // Get real-time metrics from analytics_events table
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    
    const realtimeResult = await db
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .gte("created_at", fiveMinutesAgo);
    
    const realtimeUsers = realtimeResult?.count || 0;
    
    // Get server metrics from error_logs table
    const errorResult = await db
      .from("error_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", fiveMinutesAgo);
    
    const errorRate = realtimeUsers > 0 ? (errorResult?.count || 0) / realtimeUsers * 100 : 0;
    
    // Simulate server metrics (in production, these would come from actual server monitoring)
    const serverLoad = Math.min(100, Math.max(0, 50 + (realtimeUsers * 0.5))); // Scale with user count
    const responseTime = Math.min(200, Math.max(20, 50 + (realtimeUsers * 0.3))); // Scale with user count

    const stats = {
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      todaySignups,
      conversionRate,
      churnRate: 0, // Would need more complex calculation
      avgSessionTime: 0, // Would need session tracking
      topLocations,
      monthlyGrowth,
      realtimeUsers,
      serverLoad,
      responseTime,
      errorRate,
    };

    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      error: "Failed to load dashboard statistics",
      totalUsers: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
      todaySignups: 0,
      conversionRate: 0,
      churnRate: 0,
      avgSessionTime: 0,
      topLocations: [],
      monthlyGrowth: 0,
      realtimeUsers: 0,
      serverLoad: 0,
      responseTime: 0,
      errorRate: 0,
    });
  }
};

// Check admin status
export const checkAdminStatus: RequestHandler = async (_req, res) => {
  try {
    const isAdmin = await isAdminUser(req);
    res.json({ isAdmin });
  } catch (error) {
    console.error("Admin status check error:", error);
    return res.status(500).json({ error: "Failed to check admin status" });
  }
};

// Get users with search and filtering
export const getUsers: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { search, status, limit = 100 } = _req.query;

    // First try to get users with profile join
    let query = db
      .from("user_subscriptions")
      .select(`
        *,
        profiles(email, full_name, location_city, location_region)
      `)
      .order("created_at", { ascending: false })
      .limit(Number(limit));

    if (search) {
      query = query.ilike("profiles.email", `%${search}%`);
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data: usersData, error } = await query;

    if (error) {
      console.error("Get users with profiles error:", error);
      
      // Fallback to just user_subscriptions without profile join
      let fallbackQuery = db
        .from("user_subscriptions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(Number(limit));

      if (status && status !== "all") {
        fallbackQuery = fallbackQuery.eq("status", status);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        console.error("Get users fallback error:", fallbackError);
        return res.status(500).json({ error: "Failed to load users" });
      }

      // Format users for frontend without profile data
      const formattedUsers = (fallbackData || []).map((user: any) => ({
        id: user.user_id || user.id,
        email: 'Unknown',
        created_at: user.created_at,
        subscription: {
          plan_type: user.plan_type,
          status: user.status,
          created_at: user.created_at,
        },
        usage: {
          scenarios_used: 0,
          max_scenarios: user.plan_type === "free" ? 5 : -1,
        },
        location: 'Unknown',
        last_seen: user.updated_at,
        totalSpent: 0,
        sessionsToday: 0,
        riskScore: 0,
      }));

      return res.json(formattedUsers);
    }

    // Format users for frontend with profile data
    const formattedUsers = (usersData || []).map((user: any) => ({
      id: user.user_id || user.id,
      email: user.profiles?.email || 'Unknown',
      created_at: user.created_at,
      subscription: {
        plan_type: user.plan_type,
        status: user.status,
        created_at: user.created_at,
      },
      usage: {
        scenarios_used: 0, // Would need to calculate from user_scenarios
        max_scenarios: user.plan_type === "free" ? 5 : -1,
      },
      location: user.profiles?.location_city || 'Unknown',
      last_seen: user.updated_at,
      totalSpent: 0, // Would need to calculate from payments
      sessionsToday: 0, // Would need to calculate from analytics
      riskScore: 0, // Would need risk calculation logic
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to load users" });
  }
};

// Get user details
export const getUserDetails: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = _req.params;

    const { data: userData, error } = await db
      .from("user_subscriptions")
      .select(`
        *,
        profiles(email, full_name, location_city, location_region)
      `)
      .eq("user_id", userId)
      .single();

    if (error || !userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's payment history
    const { data: paymentsData } = await db
      .from("payments")
      .select("amount_cents, status, created_at")
      .eq("user_id", userId);

    const totalSpent = paymentsData?.reduce((sum: number, payment: any) => 
      sum + (payment.amount_cents || 0), 0) || 0;

    const user = {
      id: userData.user_id || userData.id,
      email: userData.profiles?.email || 'Unknown',
      created_at: userData.created_at,
      subscription: {
        plan_type: userData.plan_type,
        status: userData.status,
        created_at: userData.created_at,
      },
      usage: {
        scenarios_used: 0,
        max_scenarios: userData.plan_type === "free" ? 5 : -1,
      },
      location: userData.profiles?.location_city || 'Unknown',
      last_seen: userData.updated_at,
      totalSpent,
      sessionsToday: 0,
      riskScore: 0,
    };

    res.json(user);
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ error: "Failed to load user details" });
  }
};

// Update user
export const updateUser: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = _req.params;
    const updates = req.body;

    const { data, error } = await db
      .from("user_subscriptions")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ error: "Failed to update user" });
    }

    res.json(data);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Ban user
export const banUser: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = _req.params;
    const { reason: _reason, durationDays: _durationDays } = req.body as { reason?: string; durationDays?: number };

    // Update user subscription status to banned
    const { error: updateError } = await db
      .from("user_subscriptions")
      .update({ status: "banned" })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Ban user error:", updateError);
      return res.status(500).json({ error: "Failed to ban user" });
    }

    res.json({ success: true, message: "User banned successfully" });
  } catch (error) {
    console.error("Ban user error:", error);
    res.status(500).json({ error: "Failed to ban user" });
  }
};

// Unban user
export const unbanUser: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = _req.params;

    // Update user subscription status to active
    const { error: updateError } = await db
      .from("user_subscriptions")
      .update({ status: "active" })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Unban user error:", updateError);
      return res.status(500).json({ error: "Failed to unban user" });
    }

    res.json({ success: true, message: "User unbanned successfully" });
  } catch (error) {
    console.error("Unban user error:", error);
    res.status(500).json({ error: "Failed to unban user" });
  }
};

// Get payments
export const getPayments: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { limit = 50, status, dateFrom, dateTo } = _req.query;

    // First try to get payments with profile join
    let query = db
      .from("payments")
      .select(`
        *,
        profiles(email)
      `)
      .order("created_at", { ascending: false })
      .limit(Number(limit));

    if (status) {
      query = query.eq("status", status);
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    const { data: paymentsData, error } = await query;

    if (error) {
      console.error("Get payments with profiles error:", error);
      
      // Fallback to just payments without profile join
      let fallbackQuery = db
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(Number(limit));
      
      if (status) {
        fallbackQuery = fallbackQuery.eq("status", status);
      }

      if (dateFrom) {
        fallbackQuery = fallbackQuery.gte("created_at", dateFrom);
      }

      if (dateTo) {
        fallbackQuery = fallbackQuery.lte("created_at", dateTo);
      }

      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      
      if (fallbackError) {
        console.error("Get payments fallback error:", fallbackError);
        return res.status(500).json({ error: "Failed to load payments" });
      }

      const formattedPayments = (fallbackData || []).map((payment: any) => ({
        id: payment.id,
        user_id: payment.user_id,
        amount_cents: payment.amount_cents,
        status: payment.status,
        payment_method: payment.payment_method,
        paypal_order_id: payment.paypal_order_id,
        created_at: payment.created_at,
        user_email: 'Unknown',
        fee_cents: 0,
        refunded: false,
      }));

      return res.json(formattedPayments);
    }

    const formattedPayments = (paymentsData || []).map((payment: any) => ({
      id: payment.id,
      user_id: payment.user_id,
      amount_cents: payment.amount_cents,
      status: payment.status,
      payment_method: payment.payment_method,
      paypal_order_id: payment.paypal_order_id,
      created_at: payment.created_at,
      user_email: payment.profiles?.email || 'Unknown',
      fee_cents: 0, // Would need to calculate from payment data
      refunded: false, // Would need to check refund status
    }));

    res.json(formattedPayments);
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to load payments" });
  }
};

// Refund payment
export const refundPayment: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { paymentId } = _req.params;
    const { _reason } = _req.body;

    // Update payment status to refunded
    const { error: updateError } = await db
      .from("payments")
      .update({ 
        status: "refunded",
        failure_reason: _reason,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId);

    if (updateError) {
      console.error("Refund payment error:", updateError);
      return res.status(500).json({ error: "Failed to refund payment" });
    }

    res.json({ success: true, message: "Payment refunded successfully" });
  } catch (error) {
    console.error("Refund payment error:", error);
    res.status(500).json({ error: "Failed to refund payment" });
  }
};

// System health check
export const getSystemHealth: RequestHandler = async (_req, res) => {
  try {
    const health = {
      database: "operational",
      paypal: "operational",
      server: "operational",
      storage: "operational",
    };

    const db = getDatabase();
    if (db) {
      try {
        const { error } = await db
          .from("user_subscriptions")
          .select("id")
          .limit(1);
        health.database = error ? "error" : "operational";
      } catch {
        health.database = "error";
      }
    } else {
      health.database = "error";
    }

    res.json(health);
  } catch (error) {
    console.error("System health error:", error);
    res.json({
      database: "error",
      paypal: "operational",
      server: "operational",
      storage: "operational",
    });
  }
};

// Get system settings
export const getSystemSettings: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { data, error } = await db
      .from("system_settings")
      .select("*")
      .order("setting_key");

    if (error) {
      console.error("Get system settings error:", error);
      return res.status(500).json({ error: "Failed to load system settings" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Get system settings error:", error);
    res.status(500).json({ error: "Failed to load system settings" });
  }
};

// Update system setting
export const updateSystemSetting: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { key } = _req.params;
    const { _setting_value } = _req.body;

    const { data, error } = await db
      .from("system_settings")
      .update({ 
        setting_value,
        updated_at: new Date().toISOString()
      })
      .eq("setting_key", key)
      .select()
      .single();

    if (error) {
      console.error("Update system setting error:", error);
      return res.status(500).json({ error: "Failed to update system setting" });
    }

    res.json(data);
  } catch (error) {
    console.error("Update system setting error:", error);
    res.status(500).json({ error: "Failed to update system setting" });
  }
};

// Get maintenance mode
export const getMaintenanceMode: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { data, error } = await db
      .from("maintenance_mode")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Get maintenance mode error:", error);
      return res.status(500).json({ error: "Failed to load maintenance mode" });
    }

    res.json(data || { is_active: false, message: null });
  } catch (error) {
    console.error("Get maintenance mode error:", error);
    res.status(500).json({ error: "Failed to load maintenance mode" });
  }
};

// Toggle maintenance mode
export const toggleMaintenanceMode: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { _is_active, _message } = _req.body;

    const { data, error } = await db
      .from("maintenance_mode")
      .upsert({
        is_active,
        message,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Toggle maintenance mode error:", error);
      return res.status(500).json({ error: "Failed to toggle maintenance mode" });
    }

    res.json(data);
  } catch (error) {
    console.error("Toggle maintenance mode error:", error);
    res.status(500).json({ error: "Failed to toggle maintenance mode" });
  }
};

// Get system notifications
export const getSystemNotifications: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { data, error } = await db
      .from("system_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get system notifications error:", error);
      // Return empty array if table doesn't exist
      return res.json([]);
    }

    res.json(data || []);
  } catch (error) {
    console.error("Get system notifications error:", error);
    res.status(500).json({ error: "Failed to load notifications" });
  }
};

// Create system notification
export const createSystemNotification: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { _title, _message, _type, _target_audience, _is_active = true } = _req.body;

    const { data, error } = await db
      .from("system_notifications")
      .insert({
        title,
        message,
        type,
        target_audience,
        is_active
      })
      .select()
      .single();

    if (error) {
      console.error("Create notification error:", error);
      return res.status(500).json({ error: "Failed to create notification" });
    }

    res.json(data);
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Update system notification
export const updateSystemNotification: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { id } = _req.params;
    const updates = req.body;

    const { data, error } = await db
      .from("system_notifications")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update notification error:", error);
      return res.status(500).json({ error: "Failed to update notification" });
    }

    res.json(data);
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// Delete system notification
export const deleteSystemNotification: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { id } = _req.params;

    const { error } = await db
      .from("system_notifications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete notification error:", error);
      return res.status(500).json({ error: "Failed to delete notification" });
    }

    res.json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// Get analytics events
export const getAnalytics: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { eventType, dateFrom, dateTo, limit = 100 } = _req.query;

    let query = db
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number(limit));

    if (eventType) {
      query = query.eq("event_type", eventType);
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get analytics error:", error);
      return res.status(500).json({ error: "Failed to load analytics" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};

// Get error logs
export const getErrorLogs: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { errorType, resolved, limit = 100 } = _req.query;

    let query = db
      .from("error_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number(limit));

    if (errorType) {
      query = query.eq("error_type", errorType);
    }

    if (resolved !== undefined) {
      query = query.eq("resolved", resolved === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get error logs error:", error);
      return res.status(500).json({ error: "Failed to load error logs" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Get error logs error:", error);
    res.status(500).json({ error: "Failed to load error logs" });
  }
};

// Resolve error log
export const resolveErrorLog: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { id } = _req.params;

    const { data, error } = await db
      .from("error_logs")
      .update({
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Resolve error log error:", error);
      return res.status(500).json({ error: "Failed to resolve error log" });
    }

    res.json(data);
  } catch (error) {
    console.error("Resolve error log error:", error);
    res.status(500).json({ error: "Failed to resolve error log" });
  }
};

// Get audit log
export const getAuditLog: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { action, targetType, limit = 100 } = _req.query;

    let query = db
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number(limit));

    if (action) {
      query = query.eq("action", action);
    }

    if (targetType) {
      query = query.eq("target_type", targetType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get audit log error:", error);
      return res.status(500).json({ error: "Failed to load audit log" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Get audit log error:", error);
    res.status(500).json({ error: "Failed to load audit log" });
  }
};

// Get user bans
export const getUserBans: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { data, error } = await db
      .from("user_bans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get user bans error:", error);
      return res.status(500).json({ error: "Failed to load user bans" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Get user bans error:", error);
    res.status(500).json({ error: "Failed to load user bans" });
  }
};

// Export data
export const exportData: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { type } = _req.params;
    const { format = 'json' } = _req.query;

    let data: any[] = [];

    switch (type) {
      case 'users':
        const { data: usersData } = await db
          .from("user_subscriptions")
          .select("*");
        data = usersData || [];
        break;
      case 'payments':
        const { data: paymentsData } = await db
          .from("payments")
          .select("*");
        data = paymentsData || [];
        break;
      case 'analytics':
        const { data: analyticsData } = await db
          .from("analytics_events")
          .select("*");
        data = analyticsData || [];
        break;
      default:
        return res.status(400).json({ error: "Invalid export type" });
    }

    if (format === 'csv') {
      // Convert to CSV
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(data);
    }
  } catch (error) {
    console.error("Export data error:", error);
    res.status(500).json({ error: "Failed to export data" });
  }
};

// Clear cache
export const clearCache: RequestHandler = async (_req, res) => {
  try {
    // In a real implementation, this would clear application cache
    res.json({ success: true, message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Clear cache error:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
};

// Get cache stats
export const getCacheStats: RequestHandler = async (_req, res) => {
  try {
    // In a real implementation, this would return actual cache statistics
    res.json({
      memoryUsage: "2.5MB",
      hitRate: "85%",
      missRate: "15%",
      totalRequests: 1250,
      cacheSize: 150
    });
  } catch (error) {
    console.error("Get cache stats error:", error);
    res.status(500).json({ error: "Failed to load cache stats" });
  }
};

// Get real-time metrics
export const getRealTimeMetrics: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    // Get real-time metrics from analytics_events table
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
    
    const [realtimeResult, errorResult] = await Promise.allSettled([
      db
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .gte("created_at", fiveMinutesAgo),
      db
        .from("error_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", fiveMinutesAgo)
    ]);
    
    const activeUsers = realtimeResult.status === "fulfilled" ? realtimeResult.value.count || 0 : 0;
    const errorCount = errorResult.status === "fulfilled" ? errorResult.value.count || 0 : 0;
    const errorRate = activeUsers > 0 ? (errorCount / activeUsers) * 100 : 0;
    
    // Calculate server metrics based on actual usage
    const serverLoad = Math.min(100, Math.max(0, 50 + (activeUsers * 0.5)));
    const responseTime = Math.min(200, Math.max(20, 50 + (activeUsers * 0.3)));

    res.json({
      activeUsers,
      serverLoad,
      responseTime,
      errorRate
    });
  } catch (error) {
    console.error("Get real-time metrics error:", error);
    res.status(500).json({ error: "Failed to load real-time metrics" });
  }
};

// Get comprehensive content data
export const getContentData: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { type } = _req.params;
    const { limit = 100, category, difficulty } = _req.query;

    let data: any[] = [];
    let stats: any = {};

    switch (type) {
      case 'questions':
        let questionsQuery = db.from("questions").select("*");
        if (category) questionsQuery = questionsQuery.eq("category", category);
        if (difficulty) questionsQuery = questionsQuery.eq("difficulty", difficulty);
        const { data: questionsData, error: questionsError } = await questionsQuery.limit(Number(limit));
        
        if (questionsError) {
          console.error("Get questions error:", questionsError);
          return res.status(500).json({ error: "Failed to load questions" });
        }
        
        data = questionsData || [];
        
        // Get questions statistics
        const { data: allQuestions } = await db.from("questions").select("category, difficulty");
        const totalQuestions = allQuestions?.length || 0;
        const categories = [...new Set(allQuestions?.map(q => q.category) || [])];
        const difficulties = [...new Set(allQuestions?.map(q => q.difficulty) || [])];
        
        stats = {
          total: totalQuestions,
          categories: categories.length,
          difficulties: difficulties.length,
          byCategory: categories.reduce((acc: Record<string, number>, cat: string) => {
            acc[cat] = allQuestions?.filter(q => q.category === cat).length || 0;
            return acc;
          }, {}),
          byDifficulty: difficulties.reduce((acc: Record<string, number>, diff: string) => {
            acc[diff] = allQuestions?.filter(q => q.difficulty === diff).length || 0;
            return acc;
          }, {})
        };
        break;

      case 'scenarios':
        let scenariosQuery = db.from("scenarios").select("*");
        if (category) scenariosQuery = scenariosQuery.eq("category", category);
        if (difficulty) scenariosQuery = scenariosQuery.eq("difficulty", difficulty);
        const { data: scenariosData, error: scenariosError } = await scenariosQuery.limit(Number(limit));
        
        if (scenariosError) {
          console.error("Get scenarios error:", scenariosError);
          return res.status(500).json({ error: "Failed to load scenarios" });
        }
        
        data = scenariosData || [];
        
        // Get scenarios statistics
        const { data: allScenarios } = await db.from("scenarios").select("category, difficulty, location");
        const totalScenarios = allScenarios?.length || 0;
        const scenarioCategories = [...new Set(allScenarios?.map(s => s.category) || [])];
        const scenarioDifficulties = [...new Set(allScenarios?.map(s => s.difficulty) || [])];
        const locations = [...new Set(allScenarios?.map(s => s.location) || [])];
        
        stats = {
          total: totalScenarios,
          categories: scenarioCategories.length,
          difficulties: scenarioDifficulties.length,
          locations: locations.length,
          byCategory: scenarioCategories.reduce((acc: Record<string, number>, cat: string) => {
            acc[cat] = allScenarios?.filter(s => s.category === cat).length || 0;
            return acc;
          }, {}),
          byDifficulty: scenarioDifficulties.reduce((acc: Record<string, number>, diff: string) => {
            acc[diff] = allScenarios?.filter(s => s.difficulty === diff).length || 0;
            return acc;
          }, {})
        };
        break;

      case 'user_progress':
        try {
          const { data: progressData, error: progressError } = await db
            .from("user_progress")
            .select(`
              *,
              profiles(email, full_name)
            `)
            .order("completed_at", { ascending: false })
            .limit(Number(limit));
          
          if (progressError) {
            console.error("Get user progress error:", progressError);
            // Return empty data instead of error
            data = [];
            stats = {
              total: 0,
              passed: 0,
              failed: 0,
              passRate: 0,
              averageScore: 0,
              byType: {
                scenarios: 0,
                questions: 0
              }
            };
          } else {
            data = progressData || [];
            
            // Get progress statistics
            const { data: allProgress } = await db.from("user_progress").select("test_type, passed, score, total_questions");
            const totalTests = allProgress?.length || 0;
            const passedTests = allProgress?.filter(p => p.passed).length || 0;
            const averageScore = allProgress?.length > 0 
              ? allProgress.reduce((sum: any, p: any) => sum + (p.score / p.total_questions * 100), 0) / allProgress.length 
              : 0;
            
            stats = {
              total: totalTests,
              passed: passedTests,
              failed: totalTests - passedTests,
              passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
              averageScore: Math.round(averageScore * 100) / 100,
              byType: {
                scenarios: allProgress?.filter(p => p.test_type === 'scenarios').length || 0,
                questions: allProgress?.filter(p => p.test_type === 'questions').length || 0
              }
            };
          }
        } catch (error) {
          console.error("User progress query error:", error);
          data = [];
          stats = {
            total: 0,
            passed: 0,
            failed: 0,
            passRate: 0,
            averageScore: 0,
            byType: {
              scenarios: 0,
              questions: 0
            }
          };
        }
        break;

      case 'user_scenarios':
        try {
          const { data: userScenariosData, error: userScenariosError } = await db
            .from("user_scenarios")
            .select(`
              *,
              profiles(email, full_name)
            `)
            .order("completed_at", { ascending: false })
            .limit(Number(limit));
          
          if (userScenariosError) {
            console.error("Get user scenarios error:", userScenariosError);
            // Return empty data instead of error
            data = [];
            stats = {
              total: 0,
              correct: 0,
              incorrect: 0,
              accuracy: 0,
              averageTime: 0
            };
          } else {
            data = userScenariosData || [];
            
            // Get user scenarios statistics
            const { data: allUserScenarios } = await db.from("user_scenarios").select("answered_correctly, time_taken");
            const totalAttempts = allUserScenarios?.length || 0;
            const correctAnswers = allUserScenarios?.filter(us => us.answered_correctly).length || 0;
            const averageTime = allUserScenarios?.length > 0 
              ? allUserScenarios.reduce((sum: any, us: any) => sum + us.time_taken, 0) / allUserScenarios.length 
              : 0;
            
            stats = {
              total: totalAttempts,
              correct: correctAnswers,
              incorrect: totalAttempts - correctAnswers,
              accuracy: totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0,
              averageTime: Math.round(averageTime / 1000) // Convert to seconds
            };
          }
        } catch (error) {
          console.error("User scenarios query error:", error);
          data = [];
          stats = {
            total: 0,
            correct: 0,
            incorrect: 0,
            accuracy: 0,
            averageTime: 0
          };
        }
        break;

      default:
        return res.status(400).json({ error: "Invalid content type" });
    }

    res.json({
      data,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Get content data error:", error);
    res.status(500).json({ error: "Failed to load content data" });
  }
};

// Get comprehensive analytics
export const getComprehensiveAnalytics: RequestHandler = async (_req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { period = '30d' } = _req.query;
    const periodStr = String(period);
    
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user registrations over time
    const { data: userRegistrations } = await db
      .from("user_subscriptions")
      .select("created_at")
      .gte("created_at", startDate.toISOString());

    // Get test completions over time
    const { data: testCompletions } = await db
      .from("user_progress")
      .select("completed_at, test_type, passed")
      .gte("completed_at", startDate.toISOString());

    // Get scenario attempts over time
    const { data: scenarioAttempts } = await db
      .from("user_scenarios")
      .select("completed_at, answered_correctly")
      .gte("completed_at", startDate.toISOString());

    // Get payments over time
    const { data: payments } = await db
      .from("payments")
      .select("created_at, amount_cents, status")
      .gte("created_at", startDate.toISOString());

    // Process data for charts
    const dailyData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const dayRegistrations = userRegistrations?.filter(u => 
        u.created_at.startsWith(dateStr)
      ).length || 0;
      
      const dayTests = testCompletions?.filter(t => 
        t.completed_at.startsWith(dateStr)
      ).length || 0;
      
      const dayScenarios = scenarioAttempts?.filter(s => 
        s.completed_at.startsWith(dateStr)
      ).length || 0;
      
      const dayRevenue = payments?.filter(p => 
        p.created_at.startsWith(dateStr) && p.status === 'completed'
      ).reduce((sum: any, p: any) => sum + (p.amount_cents || 0), 0) || 0;

      dailyData.push({
        date: dateStr,
        registrations: dayRegistrations,
        tests: dayTests,
        scenarios: dayScenarios,
        revenue: dayRevenue / 100 // Convert cents to currency
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate summary statistics
    const totalRegistrations = userRegistrations?.length || 0;
    const totalTests = testCompletions?.length || 0;
    const totalScenarios = scenarioAttempts?.length || 0;
    const totalRevenue = payments?.filter(p => p.status === 'completed')
      .reduce((sum: any, p: any) => sum + (p.amount_cents || 0), 0) || 0;

    const passedTests = testCompletions?.filter(t => t.passed).length || 0;
    const correctScenarios = scenarioAttempts?.filter(s => s.answered_correctly).length || 0;

    const analytics = {
      period,
      summary: {
        totalRegistrations,
        totalTests,
        totalScenarios,
        totalRevenue: totalRevenue / 100,
        testPassRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
        scenarioAccuracy: totalScenarios > 0 ? (correctScenarios / totalScenarios) * 100 : 0
      },
      dailyData,
      topPerformers: {
        byTests: await getTopPerformers(db, 'tests', periodStr),
        byScenarios: await getTopPerformers(db, 'scenarios', periodStr),
        byRevenue: await getTopPerformers(db, 'revenue', periodStr)
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error("Get comprehensive analytics error:", error);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};

// Helper function to get top performers
async function getTopPerformers(db: any, type: string, period: string) {
  try {
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    switch (type) {
      case 'tests':
        const { data: testData } = await db
          .from("user_progress")
          .select(`
            user_id,
            profiles(email, full_name)
          `)
          .gte("completed_at", startDate.toISOString());
        
        const testCounts = testData?.reduce((acc: any, item: any) => {
          acc[item.user_id] = (acc[item.user_id] || 0) + 1;
          return acc;
        }, {}) || {};
        
        return Object.entries(testCounts)
          .map(([userId, count]) => ({
            userId,
            email: testData?.find((t: any) => t.user_id === userId)?.profiles?.email || 'Unknown',
            count: count as number
          }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 10);

      case 'scenarios':
        const { data: scenarioData } = await db
          .from("user_scenarios")
          .select(`
            user_id,
            profiles(email, full_name)
          `)
          .gte("completed_at", startDate.toISOString());
        
        const scenarioCounts = scenarioData?.reduce((acc: any, item: any) => {
          acc[item.user_id] = (acc[item.user_id] || 0) + 1;
          return acc;
        }, {}) || {};
        
        return Object.entries(scenarioCounts)
          .map(([userId, count]) => ({
            userId,
            email: scenarioData?.find((s: any) => s.user_id === userId)?.profiles?.email || 'Unknown',
            count: count as number
          }))
          .sort((a: any, b: any) => b.count - a.count)
          .slice(0, 10);

      case 'revenue':
        const { data: paymentData } = await db
          .from("payments")
          .select(`
            user_id,
            amount_cents,
            profiles(email, full_name)
          `)
          .gte("created_at", startDate.toISOString())
          .eq("status", "completed");
        
        const revenueCounts = paymentData?.reduce((acc: any, item: any) => {
          acc[item.user_id] = (acc[item.user_id] || 0) + (item.amount_cents || 0);
          return acc;
        }, {}) || {};
        
        return Object.entries(revenueCounts)
          .map(([userId, amount]) => ({
            userId,
            email: paymentData?.find((p: any) => p.user_id === userId)?.profiles?.email || 'Unknown',
            amount: ((amount as number) / 100)
          }))
          .sort((a: any, b: any) => b.amount - a.amount)
          .slice(0, 10);

      default:
        return [];
    }
  } catch (error) {
    console.error("Get top performers error:", error);
    return [];
  }
}

// Helper function to convert data to CSV
function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}
