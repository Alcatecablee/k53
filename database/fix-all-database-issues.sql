-- Comprehensive database fix for all issues
-- Run this in your Supabase SQL Editor

-- 1. Fix user_subscriptions table constraints
ALTER TABLE public.user_subscriptions 
ALTER COLUMN current_period_start DROP NOT NULL,
ALTER COLUMN current_period_end DROP NOT NULL;

-- 2. Update existing records to have proper timestamps
UPDATE public.user_subscriptions 
SET 
    current_period_start = COALESCE(current_period_start, created_at),
    current_period_end = COALESCE(current_period_end, created_at + INTERVAL '30 days')
WHERE current_period_start IS NULL OR current_period_end IS NULL;

-- 3. Ensure daily_usage table has proper structure
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_usage' AND column_name = 'created_at') THEN
        ALTER TABLE public.daily_usage ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'daily_usage' AND column_name = 'updated_at') THEN
        ALTER TABLE public.daily_usage ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
    END IF;
END $$;

-- 4. Drop and recreate RLS policies for daily_usage
DROP POLICY IF EXISTS "Users can view their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own daily usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can view their own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can insert their own usage" ON public.daily_usage;
DROP POLICY IF EXISTS "Users can update their own usage" ON public.daily_usage;

CREATE POLICY "Users can view their own daily usage" ON public.daily_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily usage" ON public.daily_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily usage" ON public.daily_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Drop and recreate RLS policies for user_subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;

CREATE POLICY "Users can view their own subscription" ON public.user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON public.user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON public.user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Grant proper permissions
GRANT ALL ON public.daily_usage TO authenticated;
GRANT ALL ON public.user_subscriptions TO authenticated;

-- 7. Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_id ON public.daily_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON public.daily_usage(date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_type ON public.user_subscriptions(plan_type);

-- 8. Create trigger for updated_at on daily_usage if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_daily_usage') THEN
        CREATE TRIGGER handle_updated_at_daily_usage
            BEFORE UPDATE ON public.daily_usage
            FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
    END IF;
END $$;

-- 9. Create trigger for updated_at on user_subscriptions if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_user_subscriptions') THEN
        CREATE TRIGGER handle_updated_at_user_subscriptions
            BEFORE UPDATE ON public.user_subscriptions
            FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
    END IF;
END $$;

-- 10. Ensure handle_updated_at function exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Verify tables are ready
SELECT 
    'daily_usage' as table_name,
    COUNT(*) as record_count,
    'RLS enabled' as status
FROM public.daily_usage
UNION ALL
SELECT 
    'user_subscriptions' as table_name,
    COUNT(*) as record_count,
    'RLS enabled' as status
FROM public.user_subscriptions;

-- 12. Test RLS policies
-- This will show if the policies are working correctly
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