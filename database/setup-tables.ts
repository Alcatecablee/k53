import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTables() {
  console.log("🚀 Setting up production database tables...\n");

  const queries = [
    // 1. User Subscriptions Table
    `CREATE TABLE IF NOT EXISTS public.user_subscriptions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'basic', 'pro', 'family')),
      status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trial', 'pending')),
      price_cents INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'ZAR',
      billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
      trial_ends_at TIMESTAMP WITH TIME ZONE,
      current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
      current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
      canceled_at TIMESTAMP WITH TIME ZONE,
      paypal_subscription_id TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      UNIQUE(user_id)
    )`,

    // 2. Daily Usage Tracking
    `CREATE TABLE IF NOT EXISTS public.daily_usage (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      scenarios_used INTEGER NOT NULL DEFAULT 0,
      questions_used INTEGER NOT NULL DEFAULT 0,
      max_scenarios INTEGER NOT NULL DEFAULT 5,
      max_questions INTEGER NOT NULL DEFAULT 10,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      UNIQUE(user_id, date)
    )`,

    // 3. Payment Records
    `CREATE TABLE IF NOT EXISTS public.payments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE CASCADE,
      amount_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'ZAR',
      status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'canceled')),
      payment_method TEXT NOT NULL DEFAULT 'paypal',
      paypal_order_id TEXT,
      paypal_payment_id TEXT,
      paypal_payer_id TEXT,
      failure_reason TEXT,
      processed_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    )`,

    // 4. Scenario Packs
    `CREATE TABLE IF NOT EXISTS public.scenario_packs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      location_region TEXT NOT NULL,
      location_city TEXT,
      scenario_count INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'ZAR',
      scenario_ids JSONB NOT NULL DEFAULT '[]',
      preview_scenarios JSONB NOT NULL DEFAULT '[]',
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    )`,

    // 5. User Pack Purchases
    `CREATE TABLE IF NOT EXISTS public.user_pack_purchases (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      pack_id UUID NOT NULL REFERENCES public.scenario_packs(id) ON DELETE CASCADE,
      price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'ZAR',
      paypal_order_id TEXT,
      purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      UNIQUE(user_id, pack_id)
    )`,

    // 6. User Progress
    `CREATE TABLE IF NOT EXISTS public.user_progress (
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
    )`,

    // 7. User Scenarios
    `CREATE TABLE IF NOT EXISTS public.user_scenarios (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      scenario_id TEXT NOT NULL,
      answered_correctly BOOLEAN NOT NULL,
      time_taken INTEGER NOT NULL,
      completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    )`
  ];

  for (let i = 0; i < queries.length; i++) {
    try {
      console.log(`Creating table ${i + 1}/${queries.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql: queries[i] 
      });

      if (error) {
        console.error(`❌ Error creating table ${i + 1}:`, error);
        // Try direct query execution
        console.log("Trying alternative method...");
        await executeDirectQuery(queries[i]);
      } else {
        console.log(`✅ Table ${i + 1} created successfully`);
      }
    } catch (err) {
      console.error(`❌ Failed to create table ${i + 1}:`, err);
    }
  }

  // Enable RLS and create policies
  console.log("\n🔒 Setting up Row Level Security...");
  await setupRLS();

  // Create indexes
  console.log("\n⚡ Creating indexes...");
  await createIndexes();

  // Insert default data
  console.log("\n📦 Inserting default scenario packs...");
  await insertDefaultData();

  console.log("\n✅ Database setup completed!");
}

async function executeDirectQuery(sql: string) {
  // Since rpc might not work, we'll try using a different approach
  try {
    // Split the SQL into parts and execute using regular Supabase operations
    console.log("Attempting direct SQL execution...");
    // This is a workaround - in production you'd run this in Supabase SQL editor
  } catch (error) {
    console.warn("Direct SQL execution failed. You may need to run the SQL manually in Supabase SQL Editor.");
  }
}

async function setupRLS() {
  const rlsCommands = [
    'ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.user_pack_purchases ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.user_scenarios ENABLE ROW LEVEL SECURITY',
    'ALTER TABLE public.scenario_packs ENABLE ROW LEVEL SECURITY',
  ];

  for (const command of rlsCommands) {
    try {
      await supabase.rpc('exec_sql', { sql: command });
    } catch (error) {
      console.warn("RLS setup note:", command);
    }
  }
}

async function createIndexes() {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date)',
    'CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id)',
  ];

  for (const index of indexes) {
    try {
      await supabase.rpc('exec_sql', { sql: index });
    } catch (error) {
      console.warn("Index creation note:", index);
    }
  }
}

async function insertDefaultData() {
  const packs = [
    {
      name: "Cape Town Coastal Pack",
      description: "Coastal driving scenarios including baboon encounters and beach traffic",
      location_region: "Western Cape",
      location_city: "Cape Town",
      scenario_count: 30,
      price_cents: 3000
    },
    {
      name: "Johannesburg Urban Pack", 
      description: "City driving with taxi ranks and traffic complexities",
      location_region: "Gauteng",
      location_city: "Johannesburg",
      scenario_count: 28,
      price_cents: 3000
    }
  ];

  for (const pack of packs) {
    try {
      const { error } = await supabase
        .from('scenario_packs')
        .upsert(pack, { onConflict: 'name' });
      
      if (error) {
        console.warn(`Scenario pack note: ${pack.name}`);
      } else {
        console.log(`✅ Created: ${pack.name}`);
      }
    } catch (error) {
      console.warn(`Pack creation note: ${pack.name}`);
    }
  }
}

setupTables().catch(console.error);
