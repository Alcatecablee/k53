-- Fix permissions for daily_usage table
-- Run this in your Supabase SQL Editor

-- 1. Grant all necessary permissions to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_usage TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Grant permissions to anon role (if needed for public access)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_usage TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- 3. Grant permissions to service_role (for server-side operations)
GRANT ALL ON public.daily_usage TO service_role;

-- 4. Verify the permissions were granted correctly
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'daily_usage'
ORDER BY grantee, privilege_type;

-- 5. Also grant permissions on user_subscriptions table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_subscriptions TO anon;
GRANT ALL ON public.user_subscriptions TO service_role;

-- 6. Grant permissions on other related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_scenarios TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenarios TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- 7. Grant anon permissions on read-only tables
GRANT SELECT ON public.scenarios TO anon;
GRANT SELECT ON public.questions TO anon;

-- 8. Grant service_role permissions on all tables
GRANT ALL ON public.user_progress TO service_role;
GRANT ALL ON public.user_scenarios TO service_role;
GRANT ALL ON public.scenarios TO service_role;
GRANT ALL ON public.questions TO service_role;
GRANT ALL ON public.profiles TO service_role;

-- 9. Verify all permissions
SELECT 
    table_name,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name IN ('daily_usage', 'user_subscriptions', 'user_progress', 'user_scenarios', 'scenarios', 'questions', 'profiles')
ORDER BY table_name, grantee, privilege_type; 