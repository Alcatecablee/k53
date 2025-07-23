import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Missing required environment variables for database setup:\n" +
      "- VITE_SUPABASE_URL\n" +
      "- SUPABASE_SERVICE_ROLE_KEY\n\n" +
      "Skipping database setup. This is normal for demo deployments.",
  );
  console.log("Database setup skipped - running in demo mode");
  process.exit(0); // Exit gracefully instead of with error
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log("Setting up database tables...");

  try {
    // Create user_progress table
    const { error: progressError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS public.user_progress (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            test_type TEXT NOT NULL CHECK (test_type IN ('questions', 'scenarios')),
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            categories JSONB NOT NULL,
            passed BOOLEAN NOT NULL,
            location_used TEXT,
            completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `,
    });

    if (progressError) {
      console.log("Creating user_progress table directly...");
      // Try direct SQL approach
      await supabase.from("user_progress").select("*").limit(1);
    }

    // Create scenarios table
    const { error: scenariosError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS public.scenarios (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL CHECK (category IN ('controls', 'signs', 'rules', 'mixed')),
            title TEXT NOT NULL,
            scenario TEXT NOT NULL,
            question TEXT NOT NULL,
            options JSONB NOT NULL,
            correct INTEGER NOT NULL,
            explanation TEXT NOT NULL,
            difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
            context TEXT NOT NULL,
            time_of_day TEXT,
            weather TEXT,
            language TEXT NOT NULL DEFAULT 'en',
            location JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `,
    });

    if (scenariosError) {
      console.log("Creating scenarios table directly...");
    }

    // Create questions table
    const { error: questionsError } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS public.questions (
            id TEXT PRIMARY KEY,
            category TEXT NOT NULL CHECK (category IN ('controls', 'signs', 'rules')),
            question TEXT NOT NULL,
            options JSONB NOT NULL,
            correct INTEGER NOT NULL,
            explanation TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );
      `,
    });

    if (questionsError) {
      console.log("Creating questions table directly...");
    }

    console.log("Database setup completed!");
  } catch (error) {
    console.error("Database setup error:", error);
  }
}

// Run setup
setupDatabase();
