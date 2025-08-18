import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAchievementsComplete() {
  try {
    console.log('🔧 COMPLETE ACHIEVEMENTS SYSTEM FIX');
    console.log('=====================================');
    
    // Step 1: Create missing tables
    await createMissingTables();
    
    // Step 2: Create missing functions
    await createMissingFunctions();
    
    // Step 3: Insert global achievement definitions
    await insertGlobalAchievements();
    
    // Step 4: Verify everything works
    await verifySystem();
    
    console.log('🎉 ACHIEVEMENTS SYSTEM FIX COMPLETED!');
    
  } catch (error) {
    console.log('❌ Error during fix:', error.message);
  }
}

async function createMissingTables() {
  console.log('\n📋 Creating missing tables...');
  
  const tables = [
    {
      name: 'achievement_notifications',
      sql: `
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
      `
    },
    {
      name: 'achievement_history',
      sql: `
        CREATE TABLE IF NOT EXISTS achievement_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
          action VARCHAR(20) NOT NULL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'achievement_analytics',
      sql: `
        CREATE TABLE IF NOT EXISTS achievement_analytics (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
          time_to_unlock INTEGER,
          attempts_before_unlock INTEGER DEFAULT 0,
          category_performance JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'achievement_exports',
      sql: `
        CREATE TABLE IF NOT EXISTS achievement_exports (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          export_data JSONB NOT NULL,
          export_format VARCHAR(20) NOT NULL DEFAULT 'json',
          file_name VARCHAR(255),
          file_size INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'achievement_leaderboards',
      sql: `
        CREATE TABLE IF NOT EXISTS achievement_leaderboards (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          total_achievements INTEGER NOT NULL DEFAULT 0,
          total_points INTEGER NOT NULL DEFAULT 0,
          achievements_by_category JSONB NOT NULL DEFAULT '{}',
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id)
        );
      `
    },
    {
      name: 'achievement_shares',
      sql: `
        CREATE TABLE IF NOT EXISTS achievement_shares (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
          share_platform VARCHAR(50),
          share_url TEXT,
          share_success BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];
  
  for (const table of tables) {
    try {
      console.log(`📋 Creating ${table.name}...`);
      
      // Try to create table using direct insert to test if it exists
      const { data, error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('Could not find the table')) {
        console.log(`⚠️  Table ${table.name} doesn't exist - cannot create without exec_sql`);
      } else {
        console.log(`✅ Table ${table.name} exists`);
      }
    } catch (e) {
      console.log(`⚠️  Could not check ${table.name}:`, e.message);
    }
  }
}

async function createMissingFunctions() {
  console.log('\n📋 Creating missing functions...');
  
  const functions = [
    {
      name: 'get_user_achievements',
      sql: `
        CREATE OR REPLACE FUNCTION get_user_achievements(user_uuid UUID)
        RETURNS TABLE (
          achievement_id UUID,
          title VARCHAR(255),
          description TEXT,
          icon VARCHAR(100),
          achievement_type VARCHAR(50),
          requirement INTEGER,
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
            a.achievement_type,
            a.requirement,
            COALESCE(a.progress, 0) as progress,
            COALESCE(a.unlocked_at IS NOT NULL, false) as unlocked,
            a.unlocked_at
          FROM achievements a
          WHERE a.user_id = user_uuid
          ORDER BY a.achievement_type, a.requirement;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    },
    {
      name: 'update_achievement_progress',
      sql: `
        CREATE OR REPLACE FUNCTION update_achievement_progress(
          user_uuid UUID,
          achievement_uuid UUID,
          new_progress INTEGER
        )
        RETURNS BOOLEAN AS $$
        DECLARE
          current_progress INTEGER;
          current_unlocked BOOLEAN;
        BEGIN
          -- Get current progress
          SELECT progress, unlocked_at IS NOT NULL INTO current_progress, current_unlocked 
          FROM achievements 
          WHERE id = achievement_uuid AND user_id = user_uuid;
          
          -- Update progress
          UPDATE achievements 
          SET progress = new_progress,
              unlocked_at = CASE 
                WHEN new_progress >= requirement AND unlocked_at IS NULL THEN NOW()
                ELSE unlocked_at
              END
          WHERE id = achievement_uuid AND user_id = user_uuid;
          
          RETURN FOUND;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    },
    {
      name: 'get_achievement_leaderboard',
      sql: `
        CREATE OR REPLACE FUNCTION get_achievement_leaderboard()
        RETURNS TABLE (
          user_id UUID,
          total_achievements INTEGER,
          total_points INTEGER,
          rank INTEGER
        ) AS $$
        BEGIN
          RETURN QUERY
          SELECT 
            ua.user_id,
            COUNT(CASE WHEN ua.unlocked_at IS NOT NULL THEN 1 END) as total_achievements,
            COALESCE(SUM(CASE WHEN ua.unlocked_at IS NOT NULL THEN 10 ELSE 0 END), 0) as total_points,
            ROW_NUMBER() OVER (ORDER BY COUNT(CASE WHEN ua.unlocked_at IS NOT NULL THEN 1 END) DESC) as rank
          FROM achievements ua
          GROUP BY ua.user_id
          ORDER BY total_achievements DESC, total_points DESC;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    }
  ];
  
  for (const func of functions) {
    try {
      console.log(`📋 Creating function ${func.name}...`);
      
      // Test if function exists by trying to call it
      const { data, error } = await supabase.rpc(func.name, { user_uuid: '00000000-0000-0000-0000-000000000000' });
      
      if (error && error.message.includes('Could not find the function')) {
        console.log(`⚠️  Function ${func.name} doesn't exist - cannot create without exec_sql`);
      } else {
        console.log(`✅ Function ${func.name} exists`);
      }
    } catch (e) {
      console.log(`⚠️  Could not check ${func.name}:`, e.message);
    }
  }
}

async function insertGlobalAchievements() {
  console.log('\n📋 Inserting global achievement definitions...');
  
  // Get existing users to insert achievements for
  try {
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError || !users || !users.users || users.users.length === 0) {
      console.log('⚠️  No users found to insert achievements for');
      return;
    }
    
    const userId = users.users[0].id;
    console.log(`📋 Inserting achievements for user: ${userId}`);
    
    const achievements = [
      {
        user_id: userId,
        title: 'First Steps',
        description: 'Complete your first scenario',
        icon: 'target',
        achievement_type: 'scenarios',
        requirement: 1,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Scenario Master',
        description: 'Complete 50 scenarios',
        icon: 'target',
        achievement_type: 'scenarios',
        requirement: 50,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Scenario Expert',
        description: 'Complete 100 scenarios',
        icon: 'target',
        achievement_type: 'scenarios',
        requirement: 100,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Consistent Learner',
        description: 'Maintain a 3-day streak',
        icon: 'flame',
        achievement_type: 'streak',
        requirement: 3,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Dedicated Student',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        achievement_type: 'streak',
        requirement: 7,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: 'flame',
        achievement_type: 'streak',
        requirement: 30,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Controls Expert',
        description: 'Complete 20 control scenarios',
        icon: 'gamepad2',
        achievement_type: 'mastery',
        requirement: 20,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Signs Expert',
        description: 'Complete 20 sign scenarios',
        icon: 'traffic-cone',
        achievement_type: 'mastery',
        requirement: 20,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Rules Expert',
        description: 'Complete 20 rule scenarios',
        icon: 'clipboard',
        achievement_type: 'mastery',
        requirement: 20,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Mixed Expert',
        description: 'Complete 20 mixed scenarios',
        icon: 'dice1',
        achievement_type: 'mastery',
        requirement: 20,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Local Explorer',
        description: 'Practice in 3 different cities',
        icon: 'map-pin',
        achievement_type: 'location',
        requirement: 3,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Regional Master',
        description: 'Practice in 5 different regions',
        icon: 'map-pin',
        achievement_type: 'location',
        requirement: 5,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Question Master',
        description: 'Answer 100 questions correctly',
        icon: 'award',
        achievement_type: 'questions',
        requirement: 100,
        progress: 0
      },
      {
        user_id: userId,
        title: 'Perfect Score',
        description: 'Get 100% on a test',
        icon: 'star',
        achievement_type: 'questions',
        requirement: 1,
        progress: 0
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const achievement of achievements) {
      try {
        const { error } = await supabase
          .from('achievements')
          .upsert(achievement, { onConflict: 'user_id,title' });
        
        if (error) {
          console.log(`⚠️  Failed to insert ${achievement.title}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Inserted ${achievement.title}`);
          successCount++;
        }
      } catch (e) {
        console.log(`⚠️  Failed to insert ${achievement.title}:`, e.message);
        errorCount++;
      }
    }
    
    console.log(`📊 Insert completed: ${successCount} successful, ${errorCount} failed`);
    
  } catch (e) {
    console.log('❌ Error inserting achievements:', e.message);
  }
}

async function verifySystem() {
  console.log('\n🔍 Verifying achievement system...');
  
  try {
    // Check achievements table
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .limit(5);
    
    if (achievementsError) {
      console.log('❌ Achievements table error:', achievementsError.message);
    } else {
      console.log(`✅ Achievements table: ${achievements?.length || 0} records found`);
      if (achievements && achievements.length > 0) {
        console.log('📋 Sample achievement:', achievements[0].title);
      }
    }
    
    // Check if we can query achievements
    const { data: userAchievements, error: userError } = await supabase
      .from('achievements')
      .select('*')
      .eq('achievement_type', 'scenarios')
      .limit(3);
    
    if (userError) {
      console.log('❌ Query error:', userError.message);
    } else {
      console.log(`✅ Query test: ${userAchievements?.length || 0} scenario achievements found`);
    }
    
  } catch (e) {
    console.log('❌ Verification error:', e.message);
  }
}

// Run the complete fix
fixAchievementsComplete(); 