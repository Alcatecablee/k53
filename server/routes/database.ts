import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Database client initialization
let supabase: any = null;

const getDatabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// Health check for database connection
export const databaseHealthCheck: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ 
        status: "error", 
        message: "Database not configured" 
      });
    }

    // Simple connection test
    const { data, error } = await db
      .from("user_subscriptions")
      .select("count")
      .limit(1);

    if (error) {
      return res.status(503).json({ 
        status: "error", 
        message: "Database connection failed",
        error: error.message 
      });
    }

    res.json({ 
      status: "ok", 
      message: "Database connection successful" 
    });
  } catch (error) {
    res.status(503).json({ 
      status: "error", 
      message: "Database health check failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

// Get basic database stats
export const getDatabaseStats: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.json({
        users: 0,
        payments: 0,
        subscriptions: 0
      });
    }

    // Get basic counts
    const [usersResult, paymentsResult, subscriptionsResult] = await Promise.all([
      db.from("user_subscriptions").select("*", { count: "exact", head: true }),
      db.from("payments").select("*", { count: "exact", head: true }),
      db.from("user_subscriptions").select("*", { count: "exact", head: true }).neq("plan_type", "free")
    ]);

    res.json({
      users: usersResult.count || 0,
      payments: paymentsResult.count || 0,
      subscriptions: subscriptionsResult.count || 0
    });
  } catch (error) {
    console.error("Database stats error:", error);
    res.status(500).json({ error: "Failed to get database stats" });
  }
};

// Create/update user
export const upsertUser: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { user_id, email, plan_type = "free", status = "active" } = req.body;

    if (!user_id || !email) {
      return res.status(400).json({ error: "user_id and email are required" });
    }

    const { data, error } = await db
      .from("user_subscriptions")
      .upsert({
        user_id,
        email,
        plan_type,
        status,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Upsert user error:", error);
      return res.status(500).json({ error: "Failed to create/update user" });
    }

    res.json({ success: true, user: data });
  } catch (error) {
    console.error("Upsert user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by ID
export const getUser: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { data, error } = await db
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "User not found" });
      }
      console.error("Get user error:", error);
      return res.status(500).json({ error: "Failed to get user" });
    }

    res.json({ user: data });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Delete related data first
    await Promise.all([
      db.from("daily_usage").delete().eq("user_id", userId),
      db.from("payments").delete().eq("user_id", userId)
    ]);

    // Delete user subscription
    const { error } = await db
      .from("user_subscriptions")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ error: "Failed to delete user" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Test database tables
export const testTables: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({ error: "Database not configured" });
    }

    const tables = ["user_subscriptions", "payments", "daily_usage"];
    const results: Record<string, any> = {};

    for (const table of tables) {
      try {
        const { data, error } = await db
          .from(table)
          .select("*")
          .limit(1);
        
        results[table] = {
          status: error ? "error" : "ok",
          error: error?.message,
          hasData: data && data.length > 0
        };
      } catch (err) {
        results[table] = {
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error"
        };
      }
    }

    res.json({ tables: results });
  } catch (error) {
    console.error("Test tables error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
