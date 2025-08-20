-- Debug and fix daily_usage table issues
-- Run this in your Supabase SQL Editor

-- 1. Check if RLS is enabled on daily_usage table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'daily_usage';

-- 2. Enable RLS if it's not enabled
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- 3. Check if the user exists in auth.users
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';

-- 4. Check if there are any existing records for this user
SELECT * FROM public.daily_usage 
WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';

-- 5. Check table constraints
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

-- 6. Drop and recreate the foreign key constraint if it exists
ALTER TABLE public.daily_usage DROP CONSTRAINT IF EXISTS daily_usage_user_id_fkey;

-- 7. Add the foreign key constraint back
ALTER TABLE public.daily_usage 
ADD CONSTRAINT daily_usage_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. Verify the policies are working by testing with a direct query
-- (This will help identify if the issue is with the policies or something else)
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_usage';

-- 9. Check if there are any triggers that might be interfering
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'daily_usage';

-- 10. Test insert with explicit values (this will help identify the exact issue)
-- Note: This is just for testing - don't run this in production
-- INSERT INTO public.daily_usage (
--     user_id, 
--     date, 
--     scenarios_used, 
--     questions_used, 
--     max_scenarios, 
--     max_questions
-- ) VALUES (
--     '6c014ec8-2f79-4809-8c35-4cae1966e0f8',
--     '2025-08-20',
--     0,
--     0,
--     5,
--     10
-- ) ON CONFLICT (user_id, date) DO UPDATE SET
--     scenarios_used = EXCLUDED.scenarios_used,
--     questions_used = EXCLUDED.questions_used,
--     updated_at = NOW();

-- 11. Check table permissions
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'daily_usage'; 