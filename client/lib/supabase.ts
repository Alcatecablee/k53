import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  location_city?: string
  location_region?: string
  location_neighborhood?: string
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  test_type: 'questions' | 'scenarios'
  score: number
  total_questions: number
  categories: Record<string, { correct: number; total: number; required: number }>
  passed: boolean
  location_used?: string
  completed_at: string
}

export interface UserScenario {
  id: string
  scenario_id: string
  user_id: string
  answered_correctly: boolean
  time_taken: number
  completed_at: string
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
