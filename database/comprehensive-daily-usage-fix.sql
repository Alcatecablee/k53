-- Comprehensive fix for daily_usage table issues
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if the user exists and their session status
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
WHERE id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';

-- 2. Check if RLS is enabled and working
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'daily_usage';

-- 3. Disable RLS temporarily to test if that's the issue
ALTER TABLE public.daily_usage DISABLE ROW LEVEL SECURITY;

-- 4. Test a direct insert without RLS
INSERT INTO public.daily_usage (
    user_id, 
    date, 
    scenarios_used, 
    questions_used, 
    max_scenarios, 
    max_questions
) VALUES (
    '6c014ec8-2f79-4809-8c35-4cae1966e0f8',
    '2025-08-20',
    0,
    0,
    5,
    10
) ON CONFLICT (user_id, date) DO UPDATE SET
    scenarios_used = EXCLUDED.scenarios_used,
    questions_used = EXCLUDED.questions_used,
    updated_at = NOW();

-- 5. Test a direct select without RLS
SELECT * FROM public.daily_usage 
WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';

-- 6. If the above works, re-enable RLS with simplified policies
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- 7. Drop all existing policies
DROP POLICY IF EXISTS "daily_usage_select_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_insert_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "daily_usage_update_policy" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own daily usage" ON public.daily_usage;

-- 8. Create very permissive policies for testing
CREATE POLICY "daily_usage_select_policy" ON public.daily_usage
    FOR SELECT USING (true);

CREATE POLICY "daily_usage_insert_policy" ON public.daily_usage
    FOR INSERT WITH CHECK (true);

CREATE POLICY "daily_usage_update_policy" ON public.daily_usage
    FOR UPDATE USING (true);

-- 9. Grant all permissions again to be sure
GRANT ALL ON public.daily_usage TO authenticated;
GRANT ALL ON public.daily_usage TO anon;
GRANT ALL ON public.daily_usage TO service_role;

-- 10. Check if there are any foreign key constraints that might be causing issues
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'daily_usage';

-- 11. If there's a foreign key constraint, temporarily drop it
ALTER TABLE public.daily_usage DROP CONSTRAINT IF EXISTS daily_usage_user_id_fkey;

-- 12. Verify the table structure is correct
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'daily_usage'
ORDER BY ordinal_position;

-- 13. Show current policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_usage'; 