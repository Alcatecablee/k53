import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with comprehensive error handling
    const initAuth = async () => {
      try {
        // Multiple fallback attempts with shorter timeouts
        const attemptAuth = async () => {
          try {
            return await Promise.race([
              supabase.auth.getSession(),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Auth timeout')), 2000)
              )
            ]);
          } catch (networkError) {
            // Check if it's a network error (Failed to fetch)
            if (networkError.message?.includes('fetch') ||
                networkError.message?.includes('network') ||
                networkError.message?.includes('timeout')) {
              console.warn('Network connectivity issue detected:', networkError.message);
              return { data: { session: null }, error: networkError };
            }
            throw networkError;
          }
        };

        const { data: { session }, error } = await attemptAuth();

        if (error) {
          console.warn('Supabase auth error, continuing in offline mode:', error.message);
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn('Supabase completely unavailable, entering offline mode:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes with comprehensive error handling
    let subscription: any;
    try {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        try {
          setUser(session?.user ?? null);
          setLoading(false);
        } catch (listenerError) {
          console.warn('Auth state change error:', listenerError);
        }
      });
      subscription = sub;
    } catch (error) {
      console.warn('Unable to set up auth listener, app will work in offline mode:', error);
    }

    return () => {
      try {
        if (subscription) {
          subscription.unsubscribe();
        }
      } catch (cleanupError) {
        console.warn('Error during auth cleanup:', cleanupError);
      }
    };
  }, []);

  const signOut = async () => {
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Sign out timeout')), 3000)
        )
      ]);
    } catch (error) {
      console.warn('Sign out error, clearing local session:', error);
      // Clear local session even if remote sign out fails
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
