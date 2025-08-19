-- Fix table constraints for daily_usage and user_subscriptions tables
-- Run this in your Supabase SQL Editor

-- 1. Fix daily_usage table constraints
-- Make current_period_start and current_period_end nullable in user_subscriptions
ALTER TABLE public.user_subscriptions 
ALTER COLUMN current_period_start DROP NOT NULL,
ALTER COLUMN current_period_end DROP NOT NULL;

-- 2. Update existing records to have proper timestamps
UPDATE public.user_subscriptions 
SET 
    current_period_start = created_at,
    current_period_end = created_at + INTERVAL '30 days'
WHERE current_period_start IS NULL OR current_period_end IS NULL;

-- 3. Ensure RLS policies are properly set up for daily_usage
DROP POLICY IF EXISTS "Users can view their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own daily usage" ON public.daily_usage;

CREATE POLICY "Users can view their own daily usage" ON public.daily_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily usage" ON public.daily_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily usage" ON public.daily_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Ensure RLS policies are properly set up for user_subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Grant proper permissions
GRANT ALL ON public.daily_usage TO authenticated;
GRANT ALL ON public.user_subscriptions TO authenticated;

-- 6. Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_id ON public.daily_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON public.daily_usage(date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_type ON public.user_subscriptions(plan_type);

-- 7. Verify tables are ready
SELECT 
    'daily_usage' as table_name,
    COUNT(*) as record_count
FROM public.daily_usage
UNION ALL
SELECT 
    'user_subscriptions' as table_name,
    COUNT(*) as record_count
FROM public.user_subscriptions; 