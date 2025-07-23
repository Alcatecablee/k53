-- Enable RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL CHECK (test_type IN ('questions', 'scenarios')),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    categories JSONB NOT NULL,
    passed BOOLEAN NOT NULL,
    location_used TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_scenarios table for tracking individual scenario attempts
CREATE TABLE IF NOT EXISTS public.user_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario_id TEXT NOT NULL,
    answered_correctly BOOLEAN NOT NULL,
    time_taken INTEGER NOT NULL, -- in milliseconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create scenarios table to store scenario data in database
CREATE TABLE IF NOT EXISTS public.scenarios (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('controls', 'signs', 'rules', 'mixed')),
    title TEXT NOT NULL,
    scenario TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    context TEXT NOT NULL,
    time_of_day TEXT,
    weather TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    location JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create questions table to store K53 questions in database
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL CHECK (category IN ('controls', 'signs', 'rules')),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed_at ON public.user_progress(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_test_type ON public.user_progress(test_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_passed ON public.user_progress(passed);

CREATE INDEX IF NOT EXISTS idx_user_scenarios_user_id ON public.user_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scenarios_scenario_id ON public.user_scenarios(scenario_id);
CREATE INDEX IF NOT EXISTS idx_user_scenarios_completed_at ON public.user_scenarios(completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_scenarios_category ON public.scenarios(category);
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON public.scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_scenarios_location ON public.scenarios USING GIN(location);

CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions(category);

-- Enable Row Level Security (RLS) policies
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_scenarios
CREATE POLICY "Users can view their own scenarios" ON public.user_scenarios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scenarios" ON public.user_scenarios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for scenarios (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view scenarios" ON public.scenarios
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for questions (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view questions" ON public.questions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at_user_progress
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_scenarios
    BEFORE UPDATE ON public.scenarios
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_questions
    BEFORE UPDATE ON public.questions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_statistics(user_uuid UUID)
RETURNS TABLE (
    total_tests BIGINT,
    passed_tests BIGINT,
    pass_rate NUMERIC,
    average_score NUMERIC,
    scenario_tests BIGINT,
    question_tests BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_tests,
        COUNT(*) FILTER (WHERE passed = true) as passed_tests,
        ROUND(
            CASE 
                WHEN COUNT(*) > 0 
                THEN (COUNT(*) FILTER (WHERE passed = true)::NUMERIC / COUNT(*)::NUMERIC) * 100 
                ELSE 0 
            END, 2
        ) as pass_rate,
        ROUND(
            CASE 
                WHEN COUNT(*) > 0 
                THEN AVG((score::NUMERIC / total_questions::NUMERIC) * 100) 
                ELSE 0 
            END, 2
        ) as average_score,
        COUNT(*) FILTER (WHERE test_type = 'scenarios') as scenario_tests,
        COUNT(*) FILTER (WHERE test_type = 'questions') as question_tests
    FROM public.user_progress 
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_progress TO authenticated;
GRANT ALL ON public.user_scenarios TO authenticated;
GRANT SELECT ON public.scenarios TO authenticated;
GRANT SELECT ON public.questions TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_statistics TO authenticated;

-- Create admin policies (for inserting scenarios and questions)
CREATE POLICY "Service role can manage scenarios" ON public.scenarios
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage questions" ON public.questions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
