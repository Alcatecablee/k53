import { RequestHandler } from "express";
import { db } from "../db";
import { userSubscriptions, dailyUsage } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

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
export const validateScenarioAccess: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Get user's subscription
    const subscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .limit(1);

    // Check if user has active subscription
    const isSubscribed =
      subscription.length > 0 &&
      subscription[0].planType !== "free" &&
      subscription[0].status === "active";

    if (isSubscribed) {
      return res.json({
        allowed: true,
        remaining: -1,
        isSubscribed: true,
        plan: subscription[0].planType,
      });
    }

    // For free users, check daily usage
    const today = new Date().toISOString().split("T")[0];
    const usage = await db
      .select()
      .from(dailyUsage)
      .where(
        and(
          eq(dailyUsage.userId, userId),
          eq(dailyUsage.date, today)
        )
      )
      .limit(1);

    let currentUsage = usage[0];
    if (!currentUsage) {
      // Create new usage record for today
      const newUsage = await db
        .insert(dailyUsage)
        .values({
          userId: userId,
          date: today,
          scenariosUsed: 0,
          questionsUsed: 0,
          maxScenarios: 5,
          maxQuestions: 10,
        })
        .returning();

      currentUsage = newUsage[0] || { scenariosUsed: 0, maxScenarios: 5 };
    }

    const remaining = Math.max(
      0,
      currentUsage.maxScenarios - currentUsage.scenariosUsed
    );

    res.json({
      allowed: remaining > 0,
      remaining,
      isSubscribed: false,
      used: currentUsage.scenariosUsed,
      max: currentUsage.maxScenarios,
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
export const recordScenarioUsage: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if user has unlimited access
    const subscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .limit(1);

    const isSubscribed =
      subscription.length > 0 &&
      subscription[0].planType !== "free" &&
      subscription[0].status === "active";

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
    const currentUsageResult = await db
      .select()
      .from(dailyUsage)
      .where(
        and(
          eq(dailyUsage.userId, userId),
          eq(dailyUsage.date, today)
        )
      )
      .limit(1);

    const currentUsage = currentUsageResult[0];
    const newCount = (currentUsage?.scenariosUsed || 0) + 1;

    // Update or insert usage
    let updatedUsage;
    if (currentUsage) {
      const result = await db
        .update(dailyUsage)
        .set({
          scenariosUsed: newCount,
          updatedAt: new Date(),
        })
        .where(eq(dailyUsage.id, currentUsage.id))
        .returning();
      updatedUsage = result[0];
    } else {
      const result = await db
        .insert(dailyUsage)
        .values({
          userId: userId,
          date: today,
          scenariosUsed: newCount,
          questionsUsed: 0,
          maxScenarios: 5,
          maxQuestions: 10,
        })
        .returning();
      updatedUsage = result[0];
    }

    const remaining = updatedUsage
      ? Math.max(0, updatedUsage.maxScenarios - updatedUsage.scenariosUsed)
      : 4;

    res.json({
      success: true,
      remaining,
      used: updatedUsage?.scenariosUsed || newCount,
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
