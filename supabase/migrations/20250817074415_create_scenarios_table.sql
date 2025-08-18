-- Create scenarios table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scenarios_category ON public.scenarios(category);
CREATE INDEX IF NOT EXISTS idx_scenarios_difficulty ON public.scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_scenarios_location ON public.scenarios USING GIN(location);

-- Enable RLS
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scenarios (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view scenarios" ON public.scenarios
    FOR SELECT USING (auth.role() = 'authenticated');
