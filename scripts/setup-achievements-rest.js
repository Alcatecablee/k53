import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAchievementsDatabase() {
  try {
    console.log('🚀 Setting up Achievement Database Tables...');
    
    // First, let's check what tables already exist
    console.log('🔍 Checking existing tables...');
    
    try {
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (error) {
        console.log('⚠️  Could not check existing tables:', error.message);
      } else {
        console.log('📋 Existing tables:', tables?.map(t => t.table_name).join(', ') || 'None');
      }
    } catch (e) {
      console.log('⚠️  Could not check existing tables:', e.message);
    }

    // Try to create achievements table using raw SQL
    console.log('📋 Creating achievements table...');
    
    try {
      // Use the REST API to execute raw SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
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
        })
      });

      if (response.ok) {
        console.log('✅ Achievements table created successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  Achievements table creation failed:', errorText);
      }
    } catch (e) {
      console.log('⚠️  Achievements table creation failed:', e.message);
    }

    // Try to insert achievements directly
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
        rarity: 'common',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Scenario Master',
        description: 'Complete 50 scenarios',
        icon: 'target',
        category: 'scenarios',
        requirement: 50,
        points: 100,
        rarity: 'rare',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Scenario Expert',
        description: 'Complete 100 scenarios',
        icon: 'target',
        category: 'scenarios',
        requirement: 100,
        points: 200,
        rarity: 'epic',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        title: 'Consistent Learner',
        description: 'Maintain a 3-day streak',
        icon: 'flame',
        category: 'streak',
        requirement: 3,
        points: 25,
        rarity: 'common',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        title: 'Dedicated Student',
        description: 'Maintain a 7-day streak',
        icon: 'flame',
        category: 'streak',
        requirement: 7,
        points: 50,
        rarity: 'rare',
        is_active: true
      }
    ];

    let insertedCount = 0;
    for (const achievement of achievements) {
      try {
        const { error } = await supabase
          .from('achievements')
          .upsert(achievement, { onConflict: 'id' });
        
        if (error) {
          console.log(`⚠️  Failed to insert achievement ${achievement.title}:`, error.message);
        } else {
          console.log(`✅ Inserted achievement: ${achievement.title}`);
          insertedCount++;
        }
      } catch (e) {
        console.log(`⚠️  Failed to insert achievement ${achievement.title}:`, e.message);
      }
    }

    // Try to create other tables
    console.log('📋 Creating user_achievements table...');
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
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
        })
      });

      if (response.ok) {
        console.log('✅ User achievements table created successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  User achievements table creation failed:', errorText);
      }
    } catch (e) {
      console.log('⚠️  User achievements table creation failed:', e.message);
    }

    // Create achievement_notifications table
    console.log('📋 Creating achievement_notifications table...');
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
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
        })
      });

      if (response.ok) {
        console.log('✅ Notifications table created successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  Notifications table creation failed:', errorText);
      }
    } catch (e) {
      console.log('⚠️  Notifications table creation failed:', e.message);
    }

    // Create achievement_history table
    console.log('📋 Creating achievement_history table...');
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
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
        })
      });

      if (response.ok) {
        console.log('✅ History table created successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  History table creation failed:', errorText);
      }
    } catch (e) {
      console.log('⚠️  History table creation failed:', e.message);
    }

    // Create achievement_leaderboards table
    console.log('📋 Creating achievement_leaderboards table...');
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
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
        })
      });

      if (response.ok) {
        console.log('✅ Leaderboards table created successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  Leaderboards table creation failed:', errorText);
      }
    } catch (e) {
      console.log('⚠️  Leaderboards table creation failed:', e.message);
    }

    // Final verification
    console.log('🔍 Final verification...');
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .limit(5);
      
      if (error) {
        console.log('❌ Final verification failed:', error.message);
      } else {
        console.log(`✅ Final verification successful: ${data?.length || 0} achievements found`);
        if (data && data.length > 0) {
          console.log('📋 Achievements in database:');
          data.forEach(achievement => {
            console.log(`  - ${achievement.title} (${achievement.category})`);
          });
        }
      }
    } catch (e) {
      console.log('❌ Final verification failed:', e.message);
    }
    
    console.log('🎉 Achievement database setup completed!');
    console.log(`📊 Summary: ${insertedCount} achievements inserted`);
    
  } catch (error) {
    console.error('❌ Error setting up achievement database:', error);
    process.exit(1);
  }
}

// Run the setup
setupAchievementsDatabase(); 