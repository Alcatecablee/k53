// Supabase wrapper with comprehensive error handling and offline detection
import { createClient, AuthError } from "@supabase/supabase-js";
import { env } from "./env";

// Get environment configuration (may be null in demo mode)
const { supabaseUrl, supabaseAnonKey, isConfigured } = env;

// Create the original client (only if environment is configured)
const originalSupabase =
  isConfigured && supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : null;

// Global offline state
let isOfflineMode = false;
let lastError: Error | null = null;

// Helper to detect network errors
const isNetworkError = (error: any): boolean => {
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

// Helper to create AuthError-like objects
const createAuthError = (message: string): AuthError => {
  const error = new Error(message) as AuthError;
  error.code = "offline_mode";
  error.status = 0;
  error.__isAuthError = true;
  return error;
};

// Wrapper function for any Supabase operation
const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string = "Supabase operation",
): Promise<T> => {
  // If no original client, return fallback immediately
  if (!originalSupabase) {
    console.warn(`${operationName} called without Supabase client (demo mode)`);
    return fallbackValue;
  }

  try {
    // Quick timeout for all operations
    const result = await Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Operation timeout")), 3000),
      ),
    ]);

    // If successful, we're back online
    if (isOfflineMode) {
      console.log("Supabase connection restored");
      isOfflineMode = false;
    }

    return result;
  } catch (error) {
    // Check if it's a network-related error
    if (isNetworkError(error)) {
      if (!isOfflineMode) {
        console.warn(
          `${operationName} failed due to connectivity, entering offline mode:`,
          error.message,
        );
        isOfflineMode = true;
        lastError = error;
      }
      return fallbackValue;
    }

    // For non-network errors, log and return fallback
    console.warn(`${operationName} failed:`, error);
    return fallbackValue;
  }
};

// Create a wrapped Supabase client
export const supabase = {
  auth: {
    getSession: () =>
      withErrorHandling(
        () => originalSupabase!.auth.getSession(),
        { data: { session: null }, error: null },
        "getSession",
      ),

    getUser: () =>
      withErrorHandling(
        () => originalSupabase!.auth.getUser(),
        { data: { user: null }, error: null },
        "getUser",
      ),

    signUp: (credentials: any) =>
      withErrorHandling(
        () => originalSupabase!.auth.signUp(credentials),
        {
          data: { user: null, session: null },
          error: createAuthError("Offline mode"),
        },
        "signUp",
      ),

    signInWithPassword: (credentials: any) =>
      withErrorHandling(
        () => originalSupabase!.auth.signInWithPassword(credentials),
        {
          data: { user: null, session: null },
          error: createAuthError("Offline mode"),
        },
        "signIn",
      ),

    signOut: () =>
      withErrorHandling(
        () => originalSupabase!.auth.signOut(),
        { error: null },
        "signOut",
      ),

    updateUser: (updates: any) =>
      withErrorHandling(
        () => originalSupabase!.auth.updateUser(updates),
        { data: { user: null }, error: createAuthError("Offline mode") },
        "updateUser",
      ),

    onAuthStateChange: (callback: any) => {
      if (!originalSupabase) {
        console.warn("Auth state listener called without Supabase client (demo mode)");
        // Return a mock subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => console.log("Mock unsubscribe"),
            },
          },
        };
      }

      try {
        return originalSupabase.auth.onAuthStateChange(callback);
      } catch (error) {
        console.warn("Auth state listener failed:", error);
        // Return a mock subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => console.log("Mock unsubscribe"),
            },
          },
        };
      }
    },
  },

  from: (table: string) => ({
    select: (columns: string = "*", options?: any) => {
      const builder = {
        eq: (column: string, value: any) => ({
          ...builder,
          single: () =>
            withErrorHandling(
              () =>
                originalSupabase!
                  .from(table)
                  .select(columns, options)
                  .eq(column, value)
                  .single(),
              { data: null, error: new Error("Offline mode") },
              `select from ${table}`,
            ),
          in: (values: any[]) => ({
            ...builder,
            limit: (count: number) =>
              withErrorHandling(
                () =>
                  originalSupabase!
                    .from(table)
                    .select(columns, options)
                    .eq(column, value)
                    .in(column, values)
                    .limit(count),
                { data: [], count: 0, error: new Error("Offline mode") },
                `select from ${table}`,
              ),
          }),
          order: (orderColumn: string, orderOptions?: any) => ({
            limit: (count: number) =>
              withErrorHandling(
                () =>
                  originalSupabase!
                    .from(table)
                    .select(columns, options)
                    .eq(column, value)
                    .order(orderColumn, orderOptions)
                    .limit(count),
                { data: [], error: new Error("Offline mode") },
                `select ordered from ${table}`,
              ),
          }),
        }),
        in: (column: string, values: any[]) => ({
          ...builder,
          limit: (count: number) =>
            withErrorHandling(
              () =>
                originalSupabase!
                  .from(table)
                  .select(columns, options)
                  .in(column, values)
                  .limit(count),
              { data: [], count: 0, error: new Error("Offline mode") },
              `select from ${table}`,
            ),
        }),
        not: (column: string, operator: string, value: any) => ({
          ...builder,
          limit: (count: number) =>
            withErrorHandling(
              () =>
                originalSupabase!
                  .from(table)
                  .select(columns, options)
                  .not(column, operator, value)
                  .limit(count),
              { data: [], error: new Error("Offline mode") },
              `select from ${table}`,
            ),
        }),
        gte: (column: string, value: any) => ({
          ...builder,
          limit: (count: number) =>
            withErrorHandling(
              () =>
                originalSupabase!
                  .from(table)
                  .select(columns, options)
                  .gte(column, value)
                  .limit(count),
              { data: [], count: 0, error: new Error("Offline mode") },
              `select from ${table}`,
            ),
        }),
        order: (column: string, orderOptions?: any) => ({
          limit: (count: number) =>
            withErrorHandling(
              () =>
                originalSupabase!
                  .from(table)
                  .select(columns, options)
                  .order(column, orderOptions)
                  .limit(count),
              { data: [], error: new Error("Offline mode") },
              `select ordered from ${table}`,
            ),
        }),
        limit: (count: number) =>
          withErrorHandling(
            () =>
              originalSupabase!
                .from(table)
                .select(columns, options)
                .limit(count),
            { data: [], count: 0, error: new Error("Offline mode") },
            `select from ${table}`,
          ),
      };
      return builder;
    },

    insert: (data: any) => ({
      select: () => ({
        single: () =>
          withErrorHandling(
            () => originalSupabase!.from(table).insert(data).select().single(),
            { data: null, error: new Error("Offline mode") },
            `insert into ${table}`,
          ),
      }),
    }),

    update: (data: any) => ({
      eq: (column: string, value: any) =>
        withErrorHandling(
          () => originalSupabase!.from(table).update(data).eq(column, value),
          { data: null, error: new Error("Offline mode") },
          `update ${table}`,
        ),
    }),
  }),

  // Expose offline status
  isOffline: () => isOfflineMode,
  getLastError: () => lastError,

  // Original client access for advanced use cases
  _original: originalSupabase,
};

// Export types from original Supabase
export type { User } from "@supabase/supabase-js";
