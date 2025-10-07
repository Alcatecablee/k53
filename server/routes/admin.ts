import { RequestHandler } from "express";
import { db } from "../db";
import {  userSubscriptions, payments, profiles, userProgress, dailyUsage } from "../../shared/schema";
import { eq, gte, lt, and, desc, sql, count, isNotNull } from "drizzle-orm";

// Check if user is admin
const isAdminUser = async (req: any): Promise<boolean> => {
  try {
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
    // Get basic counts
    const totalUsersResult = await db.select({ count: count() }).from(userSubscriptions);
    const totalUsers = totalUsersResult[0]?.count || 0;

    const activeSubscriptionsResult = await db
      .select({ count: count() })
      .from(userSubscriptions)
      .where(
        and(
          sql`${userSubscriptions.planType} != 'free'`,
          eq(userSubscriptions.status, 'active')
        )
      );
    const activeSubscriptions = activeSubscriptionsResult[0]?.count || 0;

    // Get total revenue
    const paymentsResult = await db
      .select({ amountCents: payments.amountCents })
      .from(payments)
      .where(eq(payments.status, 'completed'));
    
    const totalRevenue = paymentsResult.reduce((sum, payment) => sum + (payment.amountCents || 0), 0);

    // Get today's signups
    const today = new Date().toISOString().split("T")[0];
    const todaySignupsResult = await db
      .select({ count: count() })
      .from(userSubscriptions)
      .where(gte(userSubscriptions.createdAt, new Date(today)));
    const todaySignups = todaySignupsResult[0]?.count || 0;

    // Get top locations
    const locationsResult = await db
      .select({ locationCity: profiles.locationCity })
      .from(profiles)
      .where(isNotNull(profiles.locationCity));
    
    const locationCounts: { [key: string]: number } = {};
    locationsResult.forEach((profile) => {
      if (profile.locationCity) {
        locationCounts[profile.locationCity] = (locationCounts[profile.locationCity] || 0) + 1;
      }
    });
    
    const topLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city]) => city);

    // Calculate conversion rate
    const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;
    
    // Get monthly growth
    const currentDate = new Date();
    const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    const thisMonthResult = await db
      .select({ count: count() })
      .from(userSubscriptions)
      .where(gte(userSubscriptions.createdAt, thisMonth));
    const thisMonthUsers = thisMonthResult[0]?.count || 0;

    const lastMonthResult = await db
      .select({ count: count() })
      .from(userSubscriptions)
      .where(
        and(
          gte(userSubscriptions.createdAt, lastMonth),
          lt(userSubscriptions.createdAt, thisMonth)
        )
      );
    const lastMonthUsers = lastMonthResult[0]?.count || 0;
    const monthlyGrowth = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0;

    const stats = {
      totalUsers,
      activeSubscriptions,
      totalRevenue,
      todaySignups,
      conversionRate,
      churnRate: 0,
      avgSessionTime: 0,
      topLocations,
      monthlyGrowth,
      realtimeUsers: 0,
      serverLoad: 50,
      responseTime: 50,
      errorRate: 0,
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
    return res.status(500).json({ error: "Failed to check admin status" });
  }
};

// Get users with search and filtering
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const { search, status, limit = '100' } = req.query;
    const limitNum = Number(limit);

    let query = db
      .select({
        id: userSubscriptions.id,
        userId: userSubscriptions.userId,
        planType: userSubscriptions.planType,
        status: userSubscriptions.status,
        createdAt: userSubscriptions.createdAt,
        updatedAt: userSubscriptions.updatedAt,
        email: profiles.email,
        fullName: profiles.fullName,
        locationCity: profiles.locationCity,
        locationRegion: profiles.locationRegion,
      })
      .from(userSubscriptions)
      .leftJoin(profiles, eq(userSubscriptions.userId, profiles.id))
      .orderBy(desc(userSubscriptions.createdAt))
      .limit(limitNum);

    const usersData = await query;

    // Format users for frontend
    const formattedUsers = usersData.map((user) => ({
      id: user.userId?.toString() || user.id?.toString(),
      email: user.email || 'Unknown',
      created_at: user.createdAt,
      subscription: {
        plan_type: user.planType,
        status: user.status,
        created_at: user.createdAt,
      },
      usage: {
        scenarios_used: 0,
        max_scenarios: user.planType === "free" ? 5 : -1,
      },
      location: user.locationCity || 'Unknown',
      last_seen: user.updatedAt,
      totalSpent: 0,
      sessionsToday: 0,
      riskScore: 0,
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to load users" });
  }
};

// Get single user details
export const getUserDetails: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const userResult = await db
      .select({
        id: userSubscriptions.id,
        userId: userSubscriptions.userId,
        planType: userSubscriptions.planType,
        status: userSubscriptions.status,
        createdAt: userSubscriptions.createdAt,
        email: profiles.email,
        fullName: profiles.fullName,
        locationCity: profiles.locationCity,
      })
      .from(userSubscriptions)
      .leftJoin(profiles, eq(userSubscriptions.userId, profiles.id))
      .where(eq(userSubscriptions.userId, userId))
      .limit(1);

    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult[0];

    res.json({
      id: user.userId,
      email: user.email || 'Unknown',
      created_at: user.createdAt,
      subscription: {
        plan_type: user.planType,
        status: user.status,
      },
      location: user.locationCity,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ error: "Failed to load user details" });
  }
};

// Update user subscription
export const updateUserSubscription: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan_type, status } = req.body;

    await db
      .update(userSubscriptions)
      .set({
        planType: plan_type,
        status,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId));

    res.json({ success: true });
  } catch (error) {
    console.error("Update subscription error:", error);
    res.status(500).json({ error: "Failed to update subscription" });
  }
};

// Get payments
export const getPayments: RequestHandler = async (req, res) => {
  try {
    const paymentsData = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(100);

    res.json({ payments: paymentsData });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ error: "Failed to load payments" });
  }
};
