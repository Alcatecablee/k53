import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                   import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
                   'https://lxzwakeusanxquhshcph.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                       import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
                       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key present:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables', { supabaseUrl, supabaseAnonKey: !!supabaseAnonKey })
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
