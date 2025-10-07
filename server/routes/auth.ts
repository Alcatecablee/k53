import { RequestHandler } from "express";
import { db } from "../db";
import { profiles, userSubscriptions } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { randomBytes, pbkdf2Sync } from "crypto";

// Simple password hashing
function hashPassword(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
  return randomBytes(16).toString('hex');
}

// Simple session storage (in production, use Redis or database)
const sessions = new Map<string, { userId: string; email: string }>();

function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Sign up
export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user profile
    const salt = generateSalt();
    const _hashedPassword = hashPassword(password, salt);
    
    // Store password hash in profile (in a real app, you'd have a separate users table)
    const profileResult = await db
      .insert(profiles)
      .values({
        email,
        fullName: fullName || null,
        // Note: We're not storing password in the current schema
        // In production, add a passwords table or use a proper auth system
      })
      .returning();

    const profile = profileResult[0];
    if (!profile) {
      return res.status(500).json({ error: "Failed to create profile" });
    }

    // Create default subscription
    await db.insert(userSubscriptions).values({
      userId: profile.id,
      planType: 'free',
      status: 'active',
    });

    // Create session
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, { userId: profile.id.toString(), email: profile.email || '' });

    return res.json({
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
      },
      session: { token: sessionToken },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
};

// Sign in
export const signin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const userResult = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // In production, verify password hash here
    // For now, just create a session

    // Create session
    const sessionToken = generateSessionToken();
    sessions.set(sessionToken, { userId: user.id.toString(), email: user.email || '' });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      session: { token: sessionToken },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ error: "Failed to sign in" });
  }
};

// Get session
export const getSession: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !sessions.has(token)) {
      return res.json({ session: null, user: null });
    }

    const session = sessions.get(token);
    if (!session) {
      return res.json({ session: null, user: null });
    }

    // Get user details
    const userResult = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      sessions.delete(token);
      return res.json({ session: null, user: null });
    }

    return res.json({
      session: { token },
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({ error: "Failed to get session" });
  }
};

// Sign out
export const signout: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      sessions.delete(token);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({ error: "Failed to sign out" });
  }
};

// Get current user
export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !sessions.has(token)) {
      return res.json({ user: null });
    }

    const session = sessions.get(token);
    if (!session) {
      return res.json({ user: null });
    }

    const userResult = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      sessions.delete(token);
      return res.json({ user: null });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        locationCity: user.locationCity,
        locationRegion: user.locationRegion,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ error: "Failed to get current user" });
  }
};
