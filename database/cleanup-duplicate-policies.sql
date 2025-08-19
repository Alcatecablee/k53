-- Clean up duplicate RLS policies
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies for daily_usage
DROP POLICY IF EXISTS "Users can insert own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view their own daily usage" ON public.daily_usage;

-- 2. Drop all existing policies for user_subscriptions
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;

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

-- 5. Verify the cleanup
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

-- 6. Test the policies work correctly
-- This should return the count of policies (should be 6 total: 3 for each table)
SELECT 
    tablename,
    COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename IN ('daily_usage', 'user_subscriptions')
GROUP BY tablename
ORDER BY tablename; 