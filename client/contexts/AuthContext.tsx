import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseWrapper";

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
    // Get initial session - wrapper handles all errors gracefully
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.warn(
          "Auth initialization error, continuing in offline mode:",
          error,
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes - wrapper handles all errors
    let subscription: any = null;
    try {
      const result = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
      subscription = result?.data?.subscription;
    } catch (error) {
      console.warn("Auth state change listener error:", error);
      setLoading(false);
    }

    return () => {
      try {
        if (subscription?.unsubscribe) {
          subscription.unsubscribe();
        }
      } catch (error) {
        console.warn("Error unsubscribing from auth changes:", error);
      }
    };
  }, []);

  const signOut = async () => {
    try {
      // Wrapper handles all errors, just clear local state
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Sign out error:", error);
    } finally {
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
