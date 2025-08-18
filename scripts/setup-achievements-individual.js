import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAchievementsDatabase() {
  try {
    console.log('🚀 Setting up Achievement Database Tables...');
    
    // Step 1: Create achievements table
    console.log('📋 Creating achievements table...');
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `
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
        `
      });
      if (error) console.log('⚠️  Achievements table creation failed:', error.message);
      else console.log('✅ Achievements table created');
    } catch (e) {
      console.log('⚠️  Achievements table creation failed:', e.message);
    }

    // Step 2: Create user_achievements table
    console.log('📋 Creating user_achievements table...');
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `
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
        `
      });
      if (error) console.log('⚠️  User achievements table creation failed:', error.message);
      else console.log('✅ User achievements table created');
    } catch (e) {
      console.log('⚠️  User achievements table creation failed:', e.message);
    }

    // Step 3: Create achievement_notifications table
    console.log('📋 Creating achievement_notifications table...');
    try {
      const { error } = await supabase.rpc('exec_sql', { 
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
      });
      if (error) console.log('⚠️  Notifications table creation failed:', error.message);
      else console.log('✅ Notifications table created');
    } catch (e) {
      console.log('⚠️  Notifications table creation failed:', e.message);
    }

    // Step 4: Create achievement_history table
    console.log('📋 Creating achievement_history table...');
    try {
      const { error } = await supabase.rpc('exec_sql', { 
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
      });
      if (error) console.log('⚠️  History table creation failed:', error.message);
      else console.log('✅ History table created');
    } catch (e) {
      console.log('⚠️  History table creation failed:', e.message);
    }

    // Step 5: Create achievement_leaderboards table
    console.log('📋 Creating achievement_leaderboards table...');
    try {
      const { error } = await supabase.rpc('exec_sql', { 
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
      });
      if (error) console.log('⚠️  Leaderboards table creation failed:', error.message);
      else console.log('✅ Leaderboards table created');
    } catch (e) {
      console.log('⚠️  Leaderboards table creation failed:', e.message);
    }

    // Step 6: Insert default achievements
    console.log('📋 Inserting default achievements...');
    const achievements = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'First Steps',
        description: 'Complete your first scenario',
        icon: 'target',
        category: 'scenarios',
        requirement: 1,
        points: 10,
        rarity: 'common'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Scenario Master',
        description: 'Complete 50 scenarios',
        icon: 'target',
        category: 'scenarios',
        requirement: 50,
        points: 100,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Scenario Expert',
        description: 'Complete 100 scenarios',
        icon: 'target',
        category: 'scenarios',
        requirement: 100,
        points: 200,
        rarity: 'epic'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Consistent Learner',
        description: 'Maintain a 3-day streak',
        icon: 'flame',
        category: 'streak',
        requirement: 3,
        points: 25,
        rarity: 'common'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        title: 'Dedicated Student',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        category: 'streak',
        requirement: 7,
        points: 50,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: 'flame',
        category: 'streak',
        requirement: 30,
        points: 200,
        rarity: 'legendary'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'Controls Expert',
        description: 'Complete 20 control scenarios',
        icon: 'gamepad2',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        title: 'Signs Expert',
        description: 'Complete 20 sign scenarios',
        icon: 'traffic-cone',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        title: 'Rules Expert',
        description: 'Complete 20 rule scenarios',
        icon: 'clipboard',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'Mixed Expert',
        description: 'Complete 20 mixed scenarios',
        icon: 'dice1',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        title: 'Local Explorer',
        description: 'Practice in 3 different cities',
        icon: 'map-pin',
        category: 'location',
        requirement: 3,
        points: 50,
        rarity: 'rare'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        title: 'Regional Master',
        description: 'Practice in 5 different regions',
        icon: 'map-pin',
        category: 'location',
        requirement: 5,
        points: 100,
        rarity: 'epic'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        title: 'Question Master',
        description: 'Answer 100 questions correctly',
        icon: 'award',
        category: 'questions',
        requirement: 100,
        points: 150,
        rarity: 'epic'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440014',
        title: 'Perfect Score',
        description: 'Get 100% on a test',
        icon: 'star',
        category: 'questions',
        requirement: 1,
        points: 100,
        rarity: 'rare'
      }
    ];

    for (const achievement of achievements) {
      try {
        const { error } = await supabase
          .from('achievements')
          .upsert(achievement, { onConflict: 'id' });
        
        if (error) {
          console.log(`⚠️  Failed to insert achievement ${achievement.title}:`, error.message);
        } else {
          console.log(`✅ Inserted achievement: ${achievement.title}`);
        }
      } catch (e) {
        console.log(`⚠️  Failed to insert achievement ${achievement.title}:`, e.message);
      }
    }

    // Step 7: Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    const tables = ['achievements', 'user_achievements', 'achievement_notifications', 'achievement_history', 'achievement_leaderboards'];
    
    for (const table of tables) {
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`
        });
        if (error) console.log(`⚠️  RLS enable failed for ${table}:`, error.message);
        else console.log(`✅ RLS enabled for ${table}`);
      } catch (e) {
        console.log(`⚠️  RLS enable failed for ${table}:`, e.message);
      }
    }

    // Step 8: Create RLS policies
    console.log('🔐 Creating RLS policies...');
    
    // Achievements: public read
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "achievements_public_read" ON achievements FOR SELECT USING (is_active = true);`
      });
      if (error) console.log('⚠️  Achievements policy failed:', error.message);
      else console.log('✅ Achievements policy created');
    } catch (e) {
      console.log('⚠️  Achievements policy failed:', e.message);
    }

    // User achievements: user access
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "user_achievements_user_access" ON user_achievements FOR ALL USING (auth.uid() = user_id);`
      });
      if (error) console.log('⚠️  User achievements policy failed:', error.message);
      else console.log('✅ User achievements policy created');
    } catch (e) {
      console.log('⚠️  User achievements policy failed:', e.message);
    }

    // Notifications: user access
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "achievement_notifications_user_access" ON achievement_notifications FOR ALL USING (auth.uid() = user_id);`
      });
      if (error) console.log('⚠️  Notifications policy failed:', error.message);
      else console.log('✅ Notifications policy created');
    } catch (e) {
      console.log('⚠️  Notifications policy failed:', e.message);
    }

    // History: user access
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "achievement_history_user_access" ON achievement_history FOR ALL USING (auth.uid() = user_id);`
      });
      if (error) console.log('⚠️  History policy failed:', error.message);
      else console.log('✅ History policy created');
    } catch (e) {
      console.log('⚠️  History policy failed:', e.message);
    }

    // Leaderboards: public read, user write
    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "achievement_leaderboards_public_read" ON achievement_leaderboards FOR SELECT USING (true);`
      });
      if (error) console.log('⚠️  Leaderboards read policy failed:', error.message);
      else console.log('✅ Leaderboards read policy created');
    } catch (e) {
      console.log('⚠️  Leaderboards read policy failed:', e.message);
    }

    try {
      const { error } = await supabase.rpc('exec_sql', { 
        sql: `CREATE POLICY "achievement_leaderboards_user_access" ON achievement_leaderboards FOR INSERT WITH CHECK (auth.uid() = user_id);`
      });
      if (error) console.log('⚠️  Leaderboards insert policy failed:', error.message);
      else console.log('✅ Leaderboards insert policy created');
    } catch (e) {
      console.log('⚠️  Leaderboards insert policy failed:', e.message);
    }

    // Step 9: Verify setup
    console.log('🔍 Verifying setup...');
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .limit(5);
      
      if (error) {
        console.log('❌ Verification failed:', error.message);
      } else {
        console.log(`✅ Verification successful: ${data?.length || 0} achievements found`);
        if (data && data.length > 0) {
          console.log('📋 Sample achievements:');
          data.forEach(achievement => {
            console.log(`  - ${achievement.title} (${achievement.category})`);
          });
        }
      }
    } catch (e) {
      console.log('❌ Verification failed:', e.message);
    }
    
    console.log('🎉 Achievement database setup completed!');
    
  } catch (error) {
    console.error('❌ Error setting up achievement database:', error);
    process.exit(1);
  }
}

// Run the setup
setupAchievementsDatabase(); 