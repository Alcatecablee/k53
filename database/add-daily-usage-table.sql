-- Add daily_usage table for tracking user daily limits
-- Run this in your Supabase SQL Editor

-- Create daily_usage table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_id ON public.daily_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON public.daily_usage(date);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_usage
CREATE POLICY "Users can view their own daily usage" ON public.daily_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily usage" ON public.daily_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily usage" ON public.daily_usage
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_daily_usage
    BEFORE UPDATE ON public.daily_usage
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.daily_usage TO authenticated;

-- Add foreign key constraint after table creation (Supabase handles this automatically)
-- The RLS policies will ensure data integrity instead of foreign key constraints 