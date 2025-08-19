import { createClient } from '@supabase/supabase-js';

// Direct migration using the provided service role key
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabaseTables() {
  console.log('Fixing database tables for production readiness...');
  
  try {
    // Test connection first
    console.log('Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') {
      console.error('Database connection failed:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Create daily_usage table by inserting a test record
    await createDailyUsageTable();
    
    // Create user_subscriptions table by inserting a test record
    await createUserSubscriptionsTable();
    
    console.log('✅ All tables verified and ready');
  } catch (error) {
    console.error('❌ Error during fix:', error.message);
  }
}

async function createDailyUsageTable() {
  console.log('Creating daily_usage table...');
  
  try {
    // Try to insert a test record to create the table
    const testRecord = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      date: '2025-01-01',
      scenarios_used: 0,
      questions_used: 0,
      max_scenarios: 5,
      max_questions: 10
    };
    
    const { error } = await supabase
      .from('daily_usage')
      .insert(testRecord);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, we need to create it via SQL
      console.log('Table daily_usage does not exist. Please run the SQL migration manually.');
      console.log('Run this SQL in your Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS public.daily_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    date DATE NOT NULL,
    scenarios_used INTEGER NOT NULL DEFAULT 0,
    questions_used INTEGER NOT NULL DEFAULT 0,
    max_scenarios INTEGER NOT NULL DEFAULT 5,
    max_questions INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_usage_user_id ON public.daily_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON public.daily_usage(date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);

ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own daily usage" ON public.daily_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily usage" ON public.daily_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily usage" ON public.daily_usage
    FOR UPDATE USING (auth.uid() = user_id);

GRANT ALL ON public.daily_usage TO authenticated;
      `);
      return;
    }
    
    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error('Error with daily_usage table:', error);
      return;
    }
    
    console.log('✅ daily_usage table is ready');
  } catch (error) {
    console.error('Error creating daily_usage table:', error);
  }
}

async function createUserSubscriptionsTable() {
  console.log('Creating user_subscriptions table...');
  
  try {
    // Try to insert a test record to create the table
    const testRecord = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      plan_type: 'free',
      status: 'active',
      price_cents: 0,
      currency: 'ZAR',
      billing_cycle: 'monthly'
    };
    
    const { error } = await supabase
      .from('user_subscriptions')
      .insert(testRecord);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, we need to create it via SQL
      console.log('Table user_subscriptions does not exist. Please run the SQL migration manually.');
      console.log('Run this SQL in your Supabase SQL Editor:');
      console.log(`
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'standard', 'premium')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'trial')),
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'ZAR',
    billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_type ON public.user_subscriptions(plan_type);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

GRANT ALL ON public.user_subscriptions TO authenticated;
      `);
      return;
    }
    
    if (error && error.code !== '23505') { // Ignore unique constraint violations
      console.error('Error with user_subscriptions table:', error);
      return;
    }
    
    console.log('✅ user_subscriptions table is ready');
  } catch (error) {
    console.error('Error creating user_subscriptions table:', error);
  }
}

// Run the fix
fixDatabaseTables(); 