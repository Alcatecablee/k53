-- Clean up duplicate RLS policies for daily_usage and user_subscriptions tables
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies for daily_usage
DROP POLICY IF EXISTS "Users can insert own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_insert_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_select_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_update_policy" ON public.daily_usage;

-- 2. Drop all existing policies for user_subscriptions
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_insert_policy" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_select_policy" ON public.user_subscriptions;
DROP POLICY IF EXISTS "user_subscriptions_update_policy" ON public.user_subscriptions;

-- 3. Create clean, single policies for daily_usage
CREATE POLICY "daily_usage_select_policy" ON public.daily_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_usage_insert_policy" ON public.daily_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_usage_update_policy" ON public.daily_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Create clean, single policies for user_subscriptions
CREATE POLICY "user_subscriptions_select_policy" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_insert_policy" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_update_policy" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Verify the cleanup by showing remaining policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('daily_usage', 'user_subscriptions')
ORDER BY tablename, policyname;

-- 6. Grant proper permissions
GRANT ALL ON public.daily_usage TO authenticated;
GRANT ALL ON public.user_subscriptions TO authenticated;

-- 7. Verify table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('daily_usage', 'user_subscriptions')
ORDER BY table_name, ordinal_position; 