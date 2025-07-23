import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing required environment variables for database setup:\n" +
      "- VITE_SUPABASE_URL\n" +
      "- SUPABASE_SERVICE_ROLE_KEY\n",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql: string, description: string) {
  try {
    console.log(`Creating ${description}...`);
    const { error } = await supabase.rpc("exec_sql", { sql });
    if (error) {
      console.warn(
        `Note: ${description} may already exist or need manual creation`,
      );
      console.log("SQL:", sql);
    } else {
      console.log(`✅ ${description} created successfully`);
    }
  } catch (error) {
    console.warn(`Note: ${description} may need manual creation:`, error);
  }
}

async function setupProductionDatabase() {
  console.log("🚀 Setting up production database schema...\n");

  // 1. User Subscriptions Table
  await executeSQL(
    `
    CREATE TABLE IF NOT EXISTS public.user_subscriptions (
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
    );
  `,
    "user_subscriptions table",
  );

  // 2. Daily Usage Tracking
  await executeSQL(
    `
    CREATE TABLE IF NOT EXISTS public.daily_usage (
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
    );
  `,
    "daily_usage table",
  );

  // 3. Payment Records
  await executeSQL(
    `
    CREATE TABLE IF NOT EXISTS public.payments (
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
    );
  `,
    "payments table",
  );

  // 4. Scenario Packs
  await executeSQL(
    `
    CREATE TABLE IF NOT EXISTS public.scenario_packs (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      location_region TEXT NOT NULL,
      location_city TEXT,
      scenario_count INTEGER NOT NULL,
      price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'ZAR',
      scenario_ids JSONB NOT NULL,
      preview_scenarios JSONB NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
  `,
    "scenario_packs table",
  );

  // 5. User Pack Purchases
  await executeSQL(
    `
    CREATE TABLE IF NOT EXISTS public.user_pack_purchases (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      pack_id UUID NOT NULL REFERENCES public.scenario_packs(id) ON DELETE CASCADE,
      price_cents INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'ZAR',
      paypal_order_id TEXT,
      purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      UNIQUE(user_id, pack_id)
    );
  `,
    "user_pack_purchases table",
  );

  // 6. Update existing user_progress table
  await executeSQL(
    `
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
    "user_progress table",
  );

  // 7. User Scenarios (individual scenario attempts)
  await executeSQL(
    `
    CREATE TABLE IF NOT EXISTS public.user_scenarios (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      scenario_id TEXT NOT NULL,
      answered_correctly BOOLEAN NOT NULL,
      time_taken INTEGER NOT NULL,
      completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );
  `,
    "user_scenarios table",
  );

  // 8. Create RLS policies
  console.log("\n🔒 Setting up Row Level Security policies...");

  const rlsPolicies = [
    {
      table: "user_subscriptions",
      policies: [
        'DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions',
        'DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions',
        'DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions',
        "ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY",
        'CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id)',
        'CREATE POLICY "Users can insert own subscription" ON public.user_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id)',
        'CREATE POLICY "Users can update own subscription" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id)',
      ],
    },
    {
      table: "daily_usage",
      policies: [
        'DROP POLICY IF EXISTS "Users can view own usage" ON public.daily_usage',
        'DROP POLICY IF EXISTS "Users can insert own usage" ON public.daily_usage',
        'DROP POLICY IF EXISTS "Users can update own usage" ON public.daily_usage',
        "ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY",
        'CREATE POLICY "Users can view own usage" ON public.daily_usage FOR SELECT USING (auth.uid() = user_id)',
        'CREATE POLICY "Users can insert own usage" ON public.daily_usage FOR INSERT WITH CHECK (auth.uid() = user_id)',
        'CREATE POLICY "Users can update own usage" ON public.daily_usage FOR UPDATE USING (auth.uid() = user_id)',
      ],
    },
    {
      table: "payments",
      policies: [
        'DROP POLICY IF EXISTS "Users can view own payments" ON public.payments',
        'DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments',
        "ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY",
        'CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id)',
        'CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id)',
      ],
    },
    {
      table: "user_pack_purchases",
      policies: [
        'DROP POLICY IF EXISTS "Users can view own purchases" ON public.user_pack_purchases',
        'DROP POLICY IF EXISTS "Users can insert own purchases" ON public.user_pack_purchases',
        "ALTER TABLE public.user_pack_purchases ENABLE ROW LEVEL SECURITY",
        'CREATE POLICY "Users can view own purchases" ON public.user_pack_purchases FOR SELECT USING (auth.uid() = user_id)',
        'CREATE POLICY "Users can insert own purchases" ON public.user_pack_purchases FOR INSERT WITH CHECK (auth.uid() = user_id)',
      ],
    },
    {
      table: "user_progress",
      policies: [
        'DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress',
        'DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress',
        "ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY",
        'CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id)',
        'CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id)',
      ],
    },
    {
      table: "user_scenarios",
      policies: [
        'DROP POLICY IF EXISTS "Users can view own scenarios" ON public.user_scenarios',
        'DROP POLICY IF EXISTS "Users can insert own scenarios" ON public.user_scenarios',
        "ALTER TABLE public.user_scenarios ENABLE ROW LEVEL SECURITY",
        'CREATE POLICY "Users can view own scenarios" ON public.user_scenarios FOR SELECT USING (auth.uid() = user_id)',
        'CREATE POLICY "Users can insert own scenarios" ON public.user_scenarios FOR INSERT WITH CHECK (auth.uid() = user_id)',
      ],
    },
  ];

  for (const { table, policies } of rlsPolicies) {
    console.log(`Setting up RLS for ${table}...`);
    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc("exec_sql", { sql: policy });
        if (error && !error.message.includes("already exists")) {
          console.warn(`RLS setup note for ${table}:`, error.message);
        }
      } catch (error) {
        console.warn(`RLS policy note for ${table}:`, error);
      }
    }
  }

  // 9. Create indexes for performance
  console.log("\n⚡ Creating database indexes...");

  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status)",
    "CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date)",
    "CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON public.payments(subscription_id)",
    "CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_user_scenarios_user_id ON public.user_scenarios(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_user_pack_purchases_user_id ON public.user_pack_purchases(user_id)",
  ];

  for (const index of indexes) {
    try {
      const { error } = await supabase.rpc("exec_sql", { sql: index });
      if (error && !error.message.includes("already exists")) {
        console.warn("Index creation note:", error.message);
      }
    } catch (error) {
      console.warn("Index creation note:", error);
    }
  }

  // 10. Insert default scenario packs
  console.log("\n📦 Setting up default scenario packs...");

  const defaultPacks = [
    {
      name: "Cape Town Coastal Pack",
      description:
        "Coastal driving scenarios including baboon encounters and beach traffic",
      location_region: "Western Cape",
      location_city: "Cape Town",
      scenario_count: 30,
      price_cents: 3000,
      scenario_ids: [],
      preview_scenarios: [],
    },
    {
      name: "Johannesburg Urban Pack",
      description: "City driving with taxi ranks and traffic complexities",
      location_region: "Gauteng",
      location_city: "Johannesburg",
      scenario_count: 28,
      price_cents: 3000,
      scenario_ids: [],
      preview_scenarios: [],
    },
    {
      name: "Tembisa Township Pack",
      description: "Real-world scenarios from Tembisa and surrounding areas",
      location_region: "Gauteng",
      location_city: "Tembisa",
      scenario_count: 25,
      price_cents: 2500,
      scenario_ids: [],
      preview_scenarios: [],
    },
    {
      name: "Rural Roads Pack",
      description: "Gravel roads, farm animals, and small town scenarios",
      location_region: "National",
      location_city: null,
      scenario_count: 20,
      price_cents: 2000,
      scenario_ids: [],
      preview_scenarios: [],
    },
    {
      name: "Durban Coastal Pack",
      description: "Beach traffic, holiday crowds, and coastal conditions",
      location_region: "KwaZulu-Natal",
      location_city: "Durban",
      scenario_count: 22,
      price_cents: 2500,
      scenario_ids: [],
      preview_scenarios: [],
    },
  ];

  for (const pack of defaultPacks) {
    try {
      const { error } = await supabase
        .from("scenario_packs")
        .upsert(pack, { onConflict: "name" });

      if (error) {
        console.warn(
          `Scenario pack note: ${pack.name} may need manual creation`,
        );
      } else {
        console.log(`✅ Created scenario pack: ${pack.name}`);
      }
    } catch (error) {
      console.warn(`Scenario pack note: ${pack.name}`, error);
    }
  }

  console.log("\n✅ Production database setup completed!");
  console.log("\n📝 Next steps:");
  console.log("1. Verify all tables were created in your Supabase dashboard");
  console.log("2. Test the payment integration");
  console.log("3. Deploy to production");
}

// Run setup
setupProductionDatabase().catch(console.error);
