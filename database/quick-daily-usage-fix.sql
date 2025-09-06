-- Quick fix for daily_usage table issues
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies for daily_usage
DROP POLICY IF EXISTS "daily_usage_select_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_insert_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_update_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own daily usage" ON public.daily_usage;

-- 2. Create simple, permissive policies
CREATE POLICY "daily_usage_select_policy" ON public.daily_usage
    FOR SELECT USING (true);

CREATE POLICY "daily_usage_insert_policy" ON public.daily_usage
    FOR INSERT WITH CHECK (true);

CREATE POLICY "daily_usage_update_policy" ON public.daily_usage
    FOR UPDATE USING (true);

-- 3. Grant all permissions
GRANT ALL ON public.daily_usage TO authenticated;
GRANT ALL ON public.daily_usage TO anon;
GRANT ALL ON public.daily_usage TO service_role;

-- 4. Ensure RLS is enabled
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
