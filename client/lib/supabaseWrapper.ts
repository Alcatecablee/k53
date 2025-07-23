// Supabase wrapper with comprehensive error handling and offline detection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                   import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
                   'https://lxzwakeusanxquhshcph.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                       import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE'

// Create the original client
const originalSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Global offline state
let isOfflineMode = false
let lastError: Error | null = null

// Helper to detect network errors
const isNetworkError = (error: any): boolean => {
  const errorMessage = error?.message?.toLowerCase() || ''
  return (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('aborted') ||
    error?.name === 'TypeError' ||
    error?.name === 'AbortError'
  )
}

// Wrapper function for any Supabase operation
const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T,
  operationName: string = 'Supabase operation'
): Promise<T> => {
  try {
    // Quick timeout for all operations
    const result = await Promise.race([
      operation(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timeout')), 3000)
      )
    ])
    
    // If successful, we're back online
    if (isOfflineMode) {
      console.log('Supabase connection restored')
      isOfflineMode = false
    }
    
    return result
  } catch (error) {
    // Check if it's a network-related error
    if (isNetworkError(error)) {
      if (!isOfflineMode) {
        console.warn(`${operationName} failed due to connectivity, entering offline mode:`, error.message)
        isOfflineMode = true
        lastError = error
      }
      return fallbackValue
    }
    
    // For non-network errors, log and return fallback
    console.warn(`${operationName} failed:`, error)
    return fallbackValue
  }
}

// Create a wrapped Supabase client
export const supabase = {
  auth: {
    getSession: () => withErrorHandling(
      () => originalSupabase.auth.getSession(),
      { data: { session: null }, error: null },
      'getSession'
    ),
    
    getUser: () => withErrorHandling(
      () => originalSupabase.auth.getUser(),
      { data: { user: null }, error: null },
      'getUser'
    ),
    
    signUp: (credentials: any) => withErrorHandling(
      () => originalSupabase.auth.signUp(credentials),
      { data: { user: null, session: null }, error: new Error('Offline mode') },
      'signUp'
    ),
    
    signInWithPassword: (credentials: any) => withErrorHandling(
      () => originalSupabase.auth.signInWithPassword(credentials),
      { data: { user: null, session: null }, error: new Error('Offline mode') },
      'signIn'
    ),
    
    signOut: () => withErrorHandling(
      () => originalSupabase.auth.signOut(),
      { error: null },
      'signOut'
    ),
    
    updateUser: (updates: any) => withErrorHandling(
      () => originalSupabase.auth.updateUser(updates),
      { data: { user: null }, error: new Error('Offline mode') },
      'updateUser'
    ),
    
    onAuthStateChange: (callback: any) => {
      try {
        return originalSupabase.auth.onAuthStateChange(callback)
      } catch (error) {
        console.warn('Auth state listener failed:', error)
        // Return a mock subscription
        return {
          data: {
            subscription: {
              unsubscribe: () => console.log('Mock unsubscribe')
            }
          }
        }
      }
    }
  },
  
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => withErrorHandling(
          () => originalSupabase.from(table).select(columns).eq(column, value).single(),
          { data: null, error: new Error('Offline mode') },
          `select from ${table}`
        ),
        order: (column: string, options?: any) => ({
          limit: (count: number) => withErrorHandling(
            () => originalSupabase.from(table).select(columns).eq(column, value).order(column, options).limit(count),
            { data: [], error: new Error('Offline mode') },
            `select ordered from ${table}`
          )
        })
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => withErrorHandling(
          () => originalSupabase.from(table).select(columns).order(column, options).limit(count),
          { data: [], error: new Error('Offline mode') },
          `select ordered from ${table}`
        )
      }),
      limit: (count: number) => withErrorHandling(
        () => originalSupabase.from(table).select(columns).limit(count),
        { data: [], error: new Error('Offline mode') },
        `select from ${table}`
      )
    }),
    
    insert: (data: any) => ({
      select: () => ({
        single: () => withErrorHandling(
          () => originalSupabase.from(table).insert(data).select().single(),
          { data: null, error: new Error('Offline mode') },
          `insert into ${table}`
        )
      })
    })
  }),
  
  // Expose offline status
  isOffline: () => isOfflineMode,
  getLastError: () => lastError,
  
  // Original client access for advanced use cases
  _original: originalSupabase
}

// Export types from original Supabase
export type { User } from '@supabase/supabase-js'
