import { RequestHandler } from "express";
import { db } from "../db";
import { userSubscriptions, payments } from "../../shared/schema";
import { count, ne } from "drizzle-orm";

// Health check for database connection
export const databaseHealthCheck: RequestHandler = async (_req, res) => {
  try {
    // Simple connection test
    await db.select({ count: count() }).from(userSubscriptions).limit(1);

    res.json({
      status: "ok",
      message: "Database connection successful",
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Database health check failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get basic database stats
export const getDatabaseStats: RequestHandler = async (_req, res) => {
  try {
    const [usersResult, paymentsResult, subscriptionsResult] = await Promise.all([
      db.select({ count: count() }).from(userSubscriptions),
      db.select({ count: count() }).from(payments),
      db.select({ count: count() }).from(userSubscriptions).where(ne(userSubscriptions.planType, 'free')),
    ]);

    res.json({
      users: usersResult[0]?.count || 0,
      payments: paymentsResult[0]?.count || 0,
      subscriptions: subscriptionsResult[0]?.count || 0,
    });
  } catch (error) {
    console.error("Database stats error:", error);
    res.status(500).json({ error: "Failed to get database stats" });
  }
};
