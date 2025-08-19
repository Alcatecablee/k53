-- Create missing tables for K53 application
-- Run this in your Supabase SQL Editor

-- 1. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'ZAR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method TEXT NOT NULL DEFAULT 'payfast' CHECK (payment_method IN ('payfast', 'card', 'eft')),
    paypal_order_id TEXT,
    payment_reference TEXT,
    fee_cents INTEGER DEFAULT 0,
    refunded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON public.payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON public.payments
    FOR UPDATE USING (auth.uid() = user_id);

-- 2. Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    event_type TEXT NOT NULL,
    event_data JSONB,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Enable RLS for analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_events
CREATE POLICY "Users can view their own analytics events" ON public.analytics_events
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own analytics events" ON public.analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 3. Create error_logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    error_context JSONB,
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for error_logs
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON public.error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at DESC);

-- Enable RLS for error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for error_logs
CREATE POLICY "Users can view their own error logs" ON public.error_logs
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own error logs" ON public.error_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4. Fix user_subscriptions table (add missing columns if needed)
DO $$ 
BEGIN
    -- Add current_period_start and current_period_end if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'current_period_start') THEN
        ALTER TABLE public.user_subscriptions ADD COLUMN current_period_start TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'current_period_end') THEN
        ALTER TABLE public.user_subscriptions ADD COLUMN current_period_end TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'canceled_at') THEN
        ALTER TABLE public.user_subscriptions ADD COLUMN canceled_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 5. Fix daily_usage table (add foreign key constraint if needed)
DO $$ 
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'daily_usage_user_id_fkey' 
        AND table_name = 'daily_usage'
    ) THEN
        ALTER TABLE public.daily_usage 
        ADD CONSTRAINT daily_usage_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. Fix payments table (add foreign key constraint if needed)
DO $$ 
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_user_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        ALTER TABLE public.payments 
        ADD CONSTRAINT payments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 7. Fix profiles table (add foreign key constraint if needed)
DO $$ 
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_id_fkey' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_id_fkey 
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 8. Fix analytics_events table (add foreign key constraint if needed)
DO $$ 
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'analytics_events_user_id_fkey' 
        AND table_name = 'analytics_events'
    ) THEN
        ALTER TABLE public.analytics_events 
        ADD CONSTRAINT analytics_events_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 9. Fix error_logs table (add foreign key constraint if needed)
DO $$ 
BEGIN
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'error_logs_user_id_fkey' 
        AND table_name = 'error_logs'
    ) THEN
        ALTER TABLE public.error_logs 
        ADD CONSTRAINT error_logs_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_payments
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.analytics_events TO authenticated;
GRANT ALL ON public.error_logs TO authenticated;

-- Create admin policies for service role access
CREATE POLICY "Service role can manage payments" ON public.payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage analytics events" ON public.analytics_events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage error logs" ON public.error_logs
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert sample data for testing (optional)
-- Uncomment the following lines if you want to insert sample data

/*
INSERT INTO public.user_subscriptions (user_id, plan_type, status, current_period_start, current_period_end)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'free', 'active', NOW(), NOW() + INTERVAL '1 month')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.daily_usage (user_id, date, scenarios_used, questions_used)
VALUES 
    ('00000000-0000-0000-0000-000000000001', CURRENT_DATE, 0, 0)
ON CONFLICT (user_id, date) DO NOTHING;
*/ 