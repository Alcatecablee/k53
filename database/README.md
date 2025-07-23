# Database Setup Instructions

This application uses Supabase as the database backend with the following features:

## Features Implemented

✅ **User Authentication** - Sign up, sign in, password reset  
✅ **User Profiles** - Store location preferences and profile data  
✅ **Progress Tracking** - Save test results and performance analytics  
✅ **Location-Aware Scenarios** - Scenarios tailored to user's location  
✅ **Offline Fallback** - Works with local data if database unavailable

## Database Schema

### Core Tables

1. **user_progress** - Stores test results and performance data
2. **user_scenarios** - Tracks individual scenario attempts
3. **scenarios** - Contains all K53 scenarios (226 total)
4. **questions** - Contains all K53 questions

### Setup Steps

1. **Create Tables in Supabase Dashboard:**

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS
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

-- Create user_scenarios table
CREATE TABLE IF NOT EXISTS public.user_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario_id TEXT NOT NULL,
    answered_correctly BOOLEAN NOT NULL,
    time_taken INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW') NOT NULL
);

-- Create questions table
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

-- Enable RLS on all tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own scenarios" ON public.user_scenarios
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scenarios" ON public.user_scenarios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view scenarios" ON public.scenarios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view questions" ON public.questions
    FOR SELECT USING (auth.role() = 'authenticated');
```

2. **Populate Data (Optional):**

The application works with local data by default. To populate the database with scenarios and questions, run:

```bash
npx tsx database/migrate-scenarios.ts
```

## Environment Variables

Make sure your `.env` file contains:

```
SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Features

### Authentication

- ✅ Email/password registration and login
- ✅ User profile management with location preferences
- ✅ Session persistence and auto-refresh
- ✅ Secure logout

### Location-Based Scenarios

- ✅ 226 scenarios with location metadata
- ✅ Smart prioritization (city > region > national)
- ✅ Covers all 9 South African provinces
- ✅ 30+ major cities and towns supported

### Progress Tracking

- ✅ Test results saved to database
- ✅ Performance analytics and statistics
- ✅ Category-wise breakdown
- ✅ Pass/fail tracking with required scores

### Offline Support

- ✅ Application works without database connection
- ✅ Graceful fallback to local scenario data
- ✅ Local storage for user preferences

## Application Flow

1. **User arrives** → Authentication required
2. **User signs up/in** → Profile created with location
3. **User selects test type** → Location-aware scenarios generated
4. **User completes test** → Results saved to database
5. **User views progress** → Historical data retrieved

## Database vs Local Data

The application intelligently chooses data sources:

- **Database Available**: Uses Supabase for scenarios, questions, and progress
- **Database Unavailable**: Falls back to local TypeScript data files
- **Hybrid Mode**: Uses database for progress, local for scenarios if needed

This ensures the application always works, regardless of database connectivity.
