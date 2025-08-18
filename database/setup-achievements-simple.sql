-- Simple Achievement System Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    requirement INTEGER NOT NULL DEFAULT 1,
    points INTEGER NOT NULL DEFAULT 10,
    rarity VARCHAR(20) NOT NULL DEFAULT 'common',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0,
    unlocked BOOLEAN NOT NULL DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,
    shared_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Create achievement_notifications table
CREATE TABLE IF NOT EXISTS achievement_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'unlocked',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievement_history table
CREATE TABLE IF NOT EXISTS achievement_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    action VARCHAR(20) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievement_leaderboards table
CREATE TABLE IF NOT EXISTS achievement_leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_achievements INTEGER NOT NULL DEFAULT 0,
    total_points INTEGER NOT NULL DEFAULT 0,
    achievements_by_category JSONB NOT NULL DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Insert default achievements
INSERT INTO achievements (id, title, description, icon, category, requirement, points, rarity) VALUES
-- Scenario achievements
('550e8400-e29b-41d4-a716-446655440001', 'First Steps', 'Complete your first scenario', 'target', 'scenarios', 1, 10, 'common'),
('550e8400-e29b-41d4-a716-446655440002', 'Scenario Master', 'Complete 50 scenarios', 'target', 'scenarios', 50, 100, 'rare'),
('550e8400-e29b-41d4-a716-446655440003', 'Scenario Expert', 'Complete 100 scenarios', 'target', 'scenarios', 100, 200, 'epic'),

-- Streak achievements
('550e8400-e29b-41d4-a716-446655440004', 'Consistent Learner', 'Maintain a 3-day streak', 'flame', 'streak', 3, 25, 'common'),
('550e8400-e29b-41d4-a716-446655440005', 'Dedicated Student', 'Maintain a 7-day streak', 'flame', 'streak', 7, 50, 'rare'),
('550e8400-e29b-41d4-a716-446655440006', 'Unstoppable', 'Maintain a 30-day streak', 'flame', 'streak', 30, 200, 'legendary'),

-- Category mastery achievements
('550e8400-e29b-41d4-a716-446655440007', 'Controls Expert', 'Complete 20 control scenarios', 'gamepad2', 'mastery', 20, 75, 'rare'),
('550e8400-e29b-41d4-a716-446655440008', 'Signs Expert', 'Complete 20 sign scenarios', 'traffic-cone', 'mastery', 20, 75, 'rare'),
('550e8400-e29b-41d4-a716-446655440009', 'Rules Expert', 'Complete 20 rule scenarios', 'clipboard', 'mastery', 20, 75, 'rare'),
('550e8400-e29b-41d4-a716-446655440010', 'Mixed Expert', 'Complete 20 mixed scenarios', 'dice1', 'mastery', 20, 75, 'rare'),

-- Location achievements
('550e8400-e29b-41d4-a716-446655440011', 'Local Explorer', 'Practice in 3 different cities', 'map-pin', 'location', 3, 50, 'rare'),
('550e8400-e29b-41d4-a716-446655440012', 'Regional Master', 'Practice in 5 different regions', 'map-pin', 'location', 5, 100, 'epic'),

-- Question achievements
('550e8400-e29b-41d4-a716-446655440013', 'Question Master', 'Answer 100 questions correctly', 'award', 'questions', 100, 150, 'epic'),
('550e8400-e29b-41d4-a716-446655440014', 'Perfect Score', 'Get 100% on a test', 'star', 'questions', 1, 100, 'rare')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_leaderboards ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Achievements: public read, admin write
CREATE POLICY "achievements_public_read" ON achievements FOR SELECT USING (is_active = true);

-- User achievements: user can only access their own data
CREATE POLICY "user_achievements_user_access" ON user_achievements FOR ALL USING (auth.uid() = user_id);

-- Notifications: user can only access their own notifications
CREATE POLICY "achievement_notifications_user_access" ON achievement_notifications FOR ALL USING (auth.uid() = user_id);

-- History: user can only access their own history
CREATE POLICY "achievement_history_user_access" ON achievement_history FOR ALL USING (auth.uid() = user_id);

-- Leaderboards: public read, user write for own data
CREATE POLICY "achievement_leaderboards_public_read" ON achievement_leaderboards FOR SELECT USING (true);
CREATE POLICY "achievement_leaderboards_user_access" ON achievement_leaderboards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "achievement_leaderboards_user_update" ON achievement_leaderboards FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_user_id ON achievement_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_history_user_id ON achievement_history(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_leaderboards_total_points ON achievement_leaderboards(total_points DESC);

-- Create function to get user achievements
CREATE OR REPLACE FUNCTION get_user_achievements(user_uuid UUID)
RETURNS TABLE (
    achievement_id UUID,
    title VARCHAR(255),
    description TEXT,
    icon VARCHAR(100),
    category VARCHAR(50),
    requirement INTEGER,
    points INTEGER,
    rarity VARCHAR(20),
    progress INTEGER,
    unlocked BOOLEAN,
    unlocked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id as achievement_id,
        a.title,
        a.description,
        a.icon,
        a.category,
        a.requirement,
        a.points,
        a.rarity,
        COALESCE(ua.progress, 0) as progress,
        COALESCE(ua.unlocked, false) as unlocked,
        ua.unlocked_at
    FROM achievements a
    LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = user_uuid
    WHERE a.is_active = true
    ORDER BY a.category, a.requirement;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update achievement progress
CREATE OR REPLACE FUNCTION update_achievement_progress(
    user_uuid UUID,
    achievement_uuid UUID,
    new_progress INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    achievement_record RECORD;
    current_progress INTEGER;
    current_unlocked BOOLEAN;
BEGIN
    -- Get achievement details
    SELECT requirement INTO achievement_record FROM achievements WHERE id = achievement_uuid;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Get current progress
    SELECT progress, unlocked INTO current_progress, current_unlocked 
    FROM user_achievements 
    WHERE user_id = user_uuid AND achievement_id = achievement_uuid;
    
    -- Insert or update user achievement
    INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked, unlocked_at)
    VALUES (user_uuid, achievement_uuid, new_progress, 
            CASE WHEN new_progress >= achievement_record.requirement THEN true ELSE false END,
            CASE WHEN new_progress >= achievement_record.requirement AND (current_unlocked IS NULL OR current_unlocked = false) 
                 THEN NOW() ELSE NULL END)
    ON CONFLICT (user_id, achievement_id) 
    DO UPDATE SET 
        progress = new_progress,
        unlocked = CASE WHEN new_progress >= achievement_record.requirement THEN true ELSE current_unlocked END,
        unlocked_at = CASE WHEN new_progress >= achievement_record.requirement AND current_unlocked = false 
                           THEN NOW() ELSE user_achievements.unlocked_at END,
        updated_at = NOW();
    
    -- Check if achievement was just unlocked
    IF new_progress >= achievement_record.requirement AND (current_unlocked IS NULL OR current_unlocked = false) THEN
        -- Add notification
        INSERT INTO achievement_notifications (user_id, achievement_id, title, description, type)
        SELECT user_uuid, achievement_uuid, 
               'Achievement Unlocked: ' || title, 
               description, 
               'unlocked'
        FROM achievements WHERE id = achievement_uuid;
        
        -- Add to history
        INSERT INTO achievement_history (user_id, achievement_id, action, metadata)
        VALUES (user_uuid, achievement_uuid, 'unlocked', 
                jsonb_build_object('progress', new_progress, 'requirement', achievement_record.requirement));
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get leaderboard
CREATE OR REPLACE FUNCTION get_achievement_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    rank INTEGER,
    user_id UUID,
    total_achievements INTEGER,
    total_points INTEGER,
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY al.total_points DESC, al.total_achievements DESC) as rank,
        al.user_id,
        al.total_achievements,
        al.total_points,
        COALESCE(p.full_name, 'Anonymous User') as username
    FROM achievement_leaderboards al
    LEFT JOIN profiles p ON al.user_id = p.id
    ORDER BY al.total_points DESC, al.total_achievements DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 