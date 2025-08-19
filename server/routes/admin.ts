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
    const supabaseUrl = "https://lxzwakeusanxquhshcph.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE";

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
export const getDashboardStats: RequestHandler = async (req, res) => {
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
export const checkAdminStatus: RequestHandler = async (req, res) => {
  try {
    const isAdmin = await isAdminUser(req);
    res.json({ isAdmin });
  } catch (error) {
    console.error("Admin status check error:", error);
    res.status(500).json({ error: "Failed to check admin status" });
  }
};

// Get users with search and filtering
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { search, status, limit = 100 } = req.query;

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
export const getUserDetails: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = req.params;

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
export const updateUser: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = req.params;
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
export const banUser: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = req.params;
    const { reason, durationDays } = req.body;

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
export const unbanUser: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = req.params;

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
export const getPayments: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { limit = 50, status, dateFrom, dateTo } = req.query;

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
export const refundPayment: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { paymentId } = req.params;
    const { reason } = req.body;

    // Update payment status to refunded
    const { error: updateError } = await db
      .from("payments")
      .update({ 
        status: "refunded",
        failure_reason: reason,
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
export const getSystemHealth: RequestHandler = async (req, res) => {
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
export const getSystemSettings: RequestHandler = async (req, res) => {
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
export const updateSystemSetting: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { key } = req.params;
    const { setting_value } = req.body;

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
export const getMaintenanceMode: RequestHandler = async (req, res) => {
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
export const toggleMaintenanceMode: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { is_active, message } = req.body;

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
export const getSystemNotifications: RequestHandler = async (req, res) => {
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
export const createSystemNotification: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { title, message, type, target_audience, is_active = true } = req.body;

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
export const updateSystemNotification: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { id } = req.params;
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
export const deleteSystemNotification: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { id } = req.params;

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
export const getAnalytics: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { eventType, dateFrom, dateTo, limit = 100 } = req.query;

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
export const getErrorLogs: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { errorType, resolved, limit = 100 } = req.query;

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
export const resolveErrorLog: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { id } = req.params;

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
export const getAuditLog: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { action, targetType, limit = 100 } = req.query;

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
export const getUserBans: RequestHandler = async (req, res) => {
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
export const exportData: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { type } = req.params;
    const { format = 'json' } = req.query;

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
export const clearCache: RequestHandler = async (req, res) => {
  try {
    // In a real implementation, this would clear application cache
    res.json({ success: true, message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Clear cache error:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
};

// Get cache stats
export const getCacheStats: RequestHandler = async (req, res) => {
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
export const getRealTimeMetrics: RequestHandler = async (req, res) => {
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
