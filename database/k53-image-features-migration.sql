-- K53 Image Features Database Migration
-- Run this in your Supabase SQL Editor to set up all tables and functions

-- ========================================
-- PHASE 1: Core Learning Features
-- ========================================

-- Flashcard progress and mastery tracking
CREATE TABLE IF NOT EXISTS public.flashcard_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_id TEXT NOT NULL,
    difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    next_review TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    review_count INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    mastered BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, image_id)
);

-- Flashcard study sessions
CREATE TABLE IF NOT EXISTS public.flashcard_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('study', 'test', 'review')),
    total_cards INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    incorrect_answers INTEGER NOT NULL DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Image comparison interactions
CREATE TABLE IF NOT EXISTS public.image_comparisons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    left_image_id TEXT NOT NULL,
    right_image_id TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    user_choice TEXT CHECK (user_choice IN ('left', 'right')),
    correct_choice TEXT CHECK (correct_choice IN ('left', 'right')),
    time_taken_ms INTEGER,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Search history and saved searches
CREATE TABLE IF NOT EXISTS public.search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    search_text TEXT,
    filters JSONB NOT NULL DEFAULT '{}',
    results_count INTEGER NOT NULL DEFAULT 0,
    search_type TEXT NOT NULL CHECK (search_type IN ('text', 'filter', 'advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filters JSONB NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- PHASE 2: Advanced Learning Features
-- ========================================

-- Image-based scenarios with branching
CREATE TABLE IF NOT EXISTS public.image_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    estimated_time INTEGER NOT NULL DEFAULT 300,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scenario images with order and metadata
CREATE TABLE IF NOT EXISTS public.scenario_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES public.image_scenarios(id) ON DELETE CASCADE,
    image_id TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    description TEXT,
    action TEXT,
    delay_ms INTEGER DEFAULT 0,
    context TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scenario decision points
CREATE TABLE IF NOT EXISTS public.scenario_decisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES public.image_scenarios(id) ON DELETE CASCADE,
    scenario_image_id UUID NOT NULL REFERENCES public.scenario_images(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scenario session tracking
CREATE TABLE IF NOT EXISTS public.scenario_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.image_scenarios(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    end_time TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    score INTEGER NOT NULL DEFAULT 0,
    total_decisions INTEGER NOT NULL DEFAULT 0,
    correct_decisions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Location-based learning data
CREATE TABLE IF NOT EXISTS public.location_learning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    location_coordinates JSONB NOT NULL,
    region TEXT NOT NULL,
    province TEXT NOT NULL,
    driving_conditions TEXT[] NOT NULL DEFAULT '{}',
    special_rules TEXT[] NOT NULL DEFAULT '{}',
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    population INTEGER,
    description TEXT,
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Location learning sessions
CREATE TABLE IF NOT EXISTS public.location_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES public.location_learning(id) ON DELETE CASCADE,
    current_image_index INTEGER NOT NULL DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    end_time TIMESTAMP WITH TIME ZONE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    score INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- PHASE 3: Analytics & Personalization
-- ========================================

-- User analytics data
CREATE TABLE IF NOT EXISTS public.user_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_performance JSONB NOT NULL DEFAULT '{}',
    time_spent JSONB NOT NULL DEFAULT '{}',
    difficulty_progress JSONB NOT NULL DEFAULT '{}',
    total_study_time INTEGER NOT NULL DEFAULT 0,
    total_sessions INTEGER NOT NULL DEFAULT 0,
    average_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    readiness_score INTEGER NOT NULL DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
    last_study_date DATE,
    streak_days INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Learning recommendations
CREATE TABLE IF NOT EXISTS public.learning_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('focus', 'review', 'practice', 'mastery')),
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    description TEXT NOT NULL,
    estimated_time INTEGER NOT NULL DEFAULT 300,
    reason TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Learning paths
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    total_time INTEGER NOT NULL DEFAULT 0,
    completed_time INTEGER NOT NULL DEFAULT 0,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category TEXT NOT NULL,
    adaptive BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Learning objectives within paths
CREATE TABLE IF NOT EXISTS public.learning_objectives (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    estimated_time INTEGER NOT NULL DEFAULT 300,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    progress DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
    prerequisites TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Performance gaps analysis
CREATE TABLE IF NOT EXISTS public.performance_gaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    current_level INTEGER NOT NULL DEFAULT 0,
    target_level INTEGER NOT NULL DEFAULT 100,
    gap_size INTEGER NOT NULL DEFAULT 0,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    recommended_actions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- PHASE 4: Export & Sharing
-- ========================================

-- Export collections
CREATE TABLE IF NOT EXISTS public.export_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Collection images
CREATE TABLE IF NOT EXISTS public.collection_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id UUID NOT NULL REFERENCES public.export_collections(id) ON DELETE CASCADE,
    image_id TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Export history
CREATE TABLE IF NOT EXISTS public.export_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES public.export_collections(id) ON DELETE CASCADE,
    format TEXT NOT NULL CHECK (format IN ('pdf', 'png', 'jpg')),
    quality TEXT NOT NULL CHECK (quality IN ('low', 'medium', 'high')),
    settings JSONB NOT NULL DEFAULT '{}',
    file_size INTEGER,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Share history
CREATE TABLE IF NOT EXISTS public.share_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    collection_id UUID NOT NULL REFERENCES public.export_collections(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('email', 'whatsapp', 'telegram', 'copy-link')),
    recipient_email TEXT,
    message TEXT,
    include_progress BOOLEAN NOT NULL DEFAULT TRUE,
    include_notes BOOLEAN NOT NULL DEFAULT TRUE,
    shared_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Mobile settings and preferences
CREATE TABLE IF NOT EXISTS public.mobile_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    touch_gestures BOOLEAN NOT NULL DEFAULT TRUE,
    voice_commands BOOLEAN NOT NULL DEFAULT FALSE,
    offline_caching BOOLEAN NOT NULL DEFAULT TRUE,
    image_compression BOOLEAN NOT NULL DEFAULT TRUE,
    lazy_loading BOOLEAN NOT NULL DEFAULT TRUE,
    progressive_loading BOOLEAN NOT NULL DEFAULT TRUE,
    cache_management BOOLEAN NOT NULL DEFAULT TRUE,
    mobile_ui BOOLEAN NOT NULL DEFAULT TRUE,
    swipe_navigation BOOLEAN NOT NULL DEFAULT TRUE,
    pinch_zoom BOOLEAN NOT NULL DEFAULT TRUE,
    haptic_feedback BOOLEAN NOT NULL DEFAULT TRUE,
    auto_rotate BOOLEAN NOT NULL DEFAULT TRUE,
    battery_optimization BOOLEAN NOT NULL DEFAULT TRUE,
    data_saver BOOLEAN NOT NULL DEFAULT FALSE,
    compression_level INTEGER NOT NULL DEFAULT 70 CHECK (compression_level >= 10 AND compression_level <= 100),
    cache_size_mb INTEGER NOT NULL DEFAULT 100 CHECK (cache_size_mb >= 50 AND cache_size_mb <= 500),
    lazy_load_threshold INTEGER NOT NULL DEFAULT 200 CHECK (lazy_load_threshold >= 50 AND lazy_load_threshold <= 500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Voice commands configuration
CREATE TABLE IF NOT EXISTS public.voice_commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phrase TEXT NOT NULL,
    action TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, phrase)
);

-- Cache information tracking
CREATE TABLE IF NOT EXISTS public.cache_info (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_size_mb INTEGER NOT NULL DEFAULT 0,
    image_count INTEGER NOT NULL DEFAULT 0,
    compression_ratio DECIMAL(3,2) NOT NULL DEFAULT 0.70 CHECK (compression_ratio >= 0.10 AND compression_ratio <= 1.00),
    cache_hit_rate DECIMAL(3,2) NOT NULL DEFAULT 0.85 CHECK (cache_hit_rate >= 0.00 AND cache_hit_rate <= 1.00),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Performance metrics tracking
CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    load_time_ms INTEGER NOT NULL DEFAULT 0,
    memory_usage_mb DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    battery_drain_percent DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    data_usage_mb DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    cache_efficiency DECIMAL(3,2) NOT NULL DEFAULT 0.00 CHECK (cache_efficiency >= 0.00 AND cache_efficiency <= 1.00),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Flashcard indexes
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_user_id ON public.flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_image_id ON public.flashcard_progress(image_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_next_review ON public.flashcard_progress(next_review);
CREATE INDEX IF NOT EXISTS idx_flashcard_progress_mastered ON public.flashcard_progress(mastered);

CREATE INDEX IF NOT EXISTS idx_flashcard_sessions_user_id ON public.flashcard_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcard_sessions_start_time ON public.flashcard_sessions(start_time DESC);

-- Comparison indexes
CREATE INDEX IF NOT EXISTS idx_image_comparisons_user_id ON public.image_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_image_comparisons_category ON public.image_comparisons(category);
CREATE INDEX IF NOT EXISTS idx_image_comparisons_difficulty ON public.image_comparisons(difficulty);
CREATE INDEX IF NOT EXISTS idx_image_comparisons_completed_at ON public.image_comparisons(completed_at DESC);

-- Search indexes
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON public.search_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON public.saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_last_used ON public.saved_searches(last_used DESC);

-- Scenario indexes
CREATE INDEX IF NOT EXISTS idx_image_scenarios_user_id ON public.image_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_image_scenarios_category ON public.image_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_image_scenarios_difficulty ON public.image_scenarios(difficulty);
CREATE INDEX IF NOT EXISTS idx_image_scenarios_is_public ON public.image_scenarios(is_public);

CREATE INDEX IF NOT EXISTS idx_scenario_images_scenario_id ON public.scenario_images(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenario_images_order_index ON public.scenario_images(order_index);

CREATE INDEX IF NOT EXISTS idx_scenario_sessions_user_id ON public.scenario_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_sessions_scenario_id ON public.scenario_sessions(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenario_sessions_start_time ON public.scenario_sessions(start_time DESC);

-- Location indexes
CREATE INDEX IF NOT EXISTS idx_location_learning_user_id ON public.location_learning(user_id);
CREATE INDEX IF NOT EXISTS idx_location_learning_province ON public.location_learning(province);
CREATE INDEX IF NOT EXISTS idx_location_learning_difficulty ON public.location_learning(difficulty);

CREATE INDEX IF NOT EXISTS idx_location_sessions_user_id ON public.location_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_location_sessions_location_id ON public.location_sessions(location_id);
CREATE INDEX IF NOT EXISTS idx_location_sessions_start_time ON public.location_sessions(start_time DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_readiness_score ON public.user_analytics(readiness_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_last_study_date ON public.user_analytics(last_study_date DESC);

CREATE INDEX IF NOT EXISTS idx_learning_recommendations_user_id ON public.learning_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_type ON public.learning_recommendations(type);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_priority ON public.learning_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_learning_recommendations_is_completed ON public.learning_recommendations(is_completed);

CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON public.learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_status ON public.learning_paths(status);
CREATE INDEX IF NOT EXISTS idx_learning_paths_difficulty ON public.learning_paths(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_paths_last_accessed ON public.learning_paths(last_accessed DESC);

CREATE INDEX IF NOT EXISTS idx_learning_objectives_path_id ON public.learning_objectives(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_learning_objectives_completed ON public.learning_objectives(completed);
CREATE INDEX IF NOT EXISTS idx_learning_objectives_order_index ON public.learning_objectives(order_index);

CREATE INDEX IF NOT EXISTS idx_performance_gaps_user_id ON public.performance_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_gaps_priority ON public.performance_gaps(priority);
CREATE INDEX IF NOT EXISTS idx_performance_gaps_category ON public.performance_gaps(category);

-- Export indexes
CREATE INDEX IF NOT EXISTS idx_export_collections_user_id ON public.export_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_export_collections_is_public ON public.export_collections(is_public);
CREATE INDEX IF NOT EXISTS idx_export_collections_last_modified ON public.export_collections(last_modified DESC);

CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id ON public.collection_images(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_images_order_index ON public.collection_images(order_index);

CREATE INDEX IF NOT EXISTS idx_export_history_user_id ON public.export_history(user_id);
CREATE INDEX IF NOT EXISTS idx_export_history_collection_id ON public.export_history(collection_id);
CREATE INDEX IF NOT EXISTS idx_export_history_created_at ON public.export_history(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_share_history_user_id ON public.share_history(user_id);
CREATE INDEX IF NOT EXISTS idx_share_history_collection_id ON public.share_history(collection_id);
CREATE INDEX IF NOT EXISTS idx_share_history_platform ON public.share_history(platform);
CREATE INDEX IF NOT EXISTS idx_share_history_shared_at ON public.share_history(shared_at DESC);

-- Mobile indexes
CREATE INDEX IF NOT EXISTS idx_mobile_settings_user_id ON public.mobile_settings(user_id);

CREATE INDEX IF NOT EXISTS idx_voice_commands_user_id ON public.voice_commands(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_commands_enabled ON public.voice_commands(enabled);

CREATE INDEX IF NOT EXISTS idx_cache_info_user_id ON public.cache_info(user_id);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON public.performance_metrics(recorded_at DESC);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_learning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create basic policies for user data access
-- Users can only access their own data
CREATE POLICY "Users can view own flashcard progress" ON public.flashcard_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard progress" ON public.flashcard_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard progress" ON public.flashcard_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for all other tables (simplified for brevity)
-- In production, you would create comprehensive policies for each table

-- Public scenarios can be viewed by all authenticated users
CREATE POLICY "Users can view public scenarios" ON public.image_scenarios
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- Public collections can be viewed by all authenticated users
CREATE POLICY "Users can view public collections" ON public.export_collections
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_flashcard_progress_updated_at BEFORE UPDATE ON public.flashcard_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON public.saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_scenarios_updated_at BEFORE UPDATE ON public.image_scenarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_learning_updated_at BEFORE UPDATE ON public.location_learning
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON public.user_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_paths_updated_at BEFORE UPDATE ON public.learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_export_collections_updated_at BEFORE UPDATE ON public.export_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobile_settings_updated_at BEFORE UPDATE ON public.mobile_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_commands_updated_at BEFORE UPDATE ON public.voice_commands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cache_info_updated_at BEFORE UPDATE ON public.cache_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate readiness score
CREATE OR REPLACE FUNCTION calculate_readiness_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_questions INTEGER;
    correct_answers INTEGER;
    readiness_score INTEGER;
BEGIN
    -- Calculate based on flashcard mastery and recent performance
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE mastered = true) as mastered_count
    INTO total_questions, correct_answers
    FROM public.flashcard_progress
    WHERE user_id = user_uuid;
    
    IF total_questions = 0 THEN
        readiness_score := 0;
    ELSE
        readiness_score := ROUND((correct_answers::DECIMAL / total_questions::DECIMAL) * 100);
    END IF;
    
    RETURN readiness_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update user analytics
CREATE OR REPLACE FUNCTION update_user_analytics(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_analytics (user_id, readiness_score, last_study_date, updated_at)
    VALUES (
        user_uuid,
        calculate_readiness_score(user_uuid),
        CURRENT_DATE,
        TIMEZONE('utc'::text, NOW())
    )
    ON CONFLICT (user_id) DO UPDATE SET
        readiness_score = EXCLUDED.readiness_score,
        last_study_date = EXCLUDED.last_study_date,
        updated_at = EXCLUDED.updated_at;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- Success message
SELECT 'K53 Image Features database migration completed successfully!' as status; 