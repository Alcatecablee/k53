// Simplified Supabase wrapper with robust error handling
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Get environment configuration
const { supabaseUrl, supabaseAnonKey, isConfigured } = env;

// Create the Supabase client (only if environment is configured)
let supabaseClient: any = null;
let clientInitializationFailed = false;

if (isConfigured && supabaseUrl && supabaseAnonKey) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
    console.log("Supabase client initialized successfully");
  } catch (error) {
    console.warn("Failed to create Supabase client:", error);
    clientInitializationFailed = true;
    supabaseClient = null;
  }
} else {
  console.warn("Supabase not configured - missing environment variables");
}

// Global offline state
let isOfflineMode = !isConfigured;

// Helper to detect network errors
const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  const errorMessage = error?.message?.toLowerCase() || "";
  return (
    errorMessage.includes("failed to fetch") ||
    errorMessage.includes("network") ||
    errorMessage.includes("timeout") ||
    errorMessage.includes("aborted") ||
    error?.name === "TypeError" ||
    error?.name === "AbortError"
  );
};

// Safe wrapper for any operation
const safeOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string = "operation",
): Promise<T> => {
  // If no client available or initialization failed, return fallback immediately
  if (!supabaseClient || clientInitializationFailed) {
    if (!isOfflineMode && !clientInitializationFailed) {
      console.warn(`${operationName}: Supabase not configured, using fallback`);
    }
    return fallback;
  }

  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Operation timeout")), 5000);
    });

    const result = await Promise.race([operation(), timeoutPromise]);

    // Reset offline mode on successful operation
    if (isOfflineMode && isConfigured) {
      console.log("Connection restored");
      isOfflineMode = false;
    }

    return result;
  } catch (error) {
    if (isNetworkError(error)) {
      if (!isOfflineMode) {
        console.warn(
          `${operationName}: Network error, switching to offline mode`,
        );
        isOfflineMode = true;
      }
    } else {
      console.warn(`${operationName}: Error occurred:`, error.message);
    }
    return fallback;
  }
};

// Create the exported client with simplified interface
export const supabase = {
  auth: {
    getSession: () => {
      if (!supabaseClient || clientInitializationFailed) {
        return Promise.resolve({ data: { session: null }, error: null });
      }
      return safeOperation(
        () => supabaseClient.auth.getSession(),
        { data: { session: null }, error: null },
        "getSession",
      );
    },

    getUser: () => {
      if (!supabaseClient || clientInitializationFailed) {
        return Promise.resolve({ data: { user: null }, error: null });
      }
      return safeOperation(
        () => supabaseClient.auth.getUser(),
        { data: { user: null }, error: null },
        "getUser",
      );
    },

    signUp: (credentials: any) => {
      if (!supabaseClient || clientInitializationFailed) {
        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Authentication unavailable" },
        });
      }
      return safeOperation(
        () => supabaseClient.auth.signUp(credentials),
        {
          data: { user: null, session: null },
          error: { message: "Authentication unavailable" },
        },
        "signUp",
      );
    },

    signInWithPassword: (credentials: any) => {
      if (!supabaseClient || clientInitializationFailed) {
        return Promise.resolve({
          data: { user: null, session: null },
          error: { message: "Authentication unavailable" },
        });
      }
      return safeOperation(
        () => supabaseClient.auth.signInWithPassword(credentials),
        {
          data: { user: null, session: null },
          error: { message: "Authentication unavailable" },
        },
        "signIn",
      );
    },

    signOut: () => {
      if (!supabaseClient || clientInitializationFailed) {
        return Promise.resolve({ error: null });
      }
      return safeOperation(
        () => supabaseClient.auth.signOut(),
        { error: null },
        "signOut",
      );
    },

    updateUser: (updates: any) => {
      if (!supabaseClient || clientInitializationFailed) {
        return Promise.resolve({
          data: { user: null },
          error: { message: "Update unavailable" },
        });
      }
      return safeOperation(
        () => supabaseClient.auth.updateUser(updates),
        { data: { user: null }, error: { message: "Update unavailable" } },
        "updateUser",
      );
    },

    onAuthStateChange: (callback: any) => {
      if (!supabaseClient) {
        console.warn("Auth state change listener: Supabase not available");
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      }

      try {
        const result = supabaseClient.auth.onAuthStateChange(callback);
        return result;
      } catch (error) {
        console.warn("Auth state change listener failed:", error);
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      }
    },
  },

  // Keep the original client available for direct access when needed
  _client: supabaseClient,

  // Status helpers
  isOffline: () => isOfflineMode,
  isConfigured: () => Boolean(supabaseClient),
  isClientAvailable: () =>
    Boolean(supabaseClient && !clientInitializationFailed),
};

// Re-export types from Supabase
export type { User } from "@supabase/supabase-js";
