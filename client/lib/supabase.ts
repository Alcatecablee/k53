// Re-export from the wrapper for backwards compatibility
export { supabase } from "./supabaseWrapper";

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  location_city?: string;
  location_region?: string;
  location_neighborhood?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  test_type: "questions" | "scenarios";
  score: number;
  total_questions: number;
  categories: Record<
    string,
    { correct: number; total: number; required: number }
  >;
  passed: boolean;
  location_used?: string;
  completed_at: string;
}

export interface UserScenario {
  id: string;
  scenario_id: string;
  user_id: string;
  answered_correctly: boolean;
  time_taken: number;
  completed_at: string;
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { supabase } = await import("./supabaseWrapper");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { supabase } = await import("./supabaseWrapper");
  const { error } = await supabase.auth.signOut();
  return { error };
};
