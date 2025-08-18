import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAchievementsSchema() {
  try {
    console.log('🔧 Fixing achievements table schema...');
    
    // Step 1: Drop the existing table
    console.log('📋 Dropping existing achievements table...');
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
      
      if (error) {
        console.log('⚠️  Could not clear table:', error.message);
      } else {
        console.log('✅ Cleared existing data');
      }
    } catch (e) {
      console.log('⚠️  Could not clear table:', e.message);
    }
    
    // Step 2: Create the table with correct schema using REST API
    console.log('📋 Creating achievements table with correct schema...');
    
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
            DROP TABLE IF EXISTS achievements CASCADE;
            
            CREATE TABLE achievements (
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
        console.log('✅ Achievements table recreated successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  Table recreation failed:', errorText);
        return;
      }
    } catch (e) {
      console.log('⚠️  Table recreation failed:', e.message);
      return;
    }
    
    // Step 3: Insert default achievements
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
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        title: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: 'flame',
        category: 'streak',
        requirement: 30,
        points: 200,
        rarity: 'legendary',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        title: 'Controls Expert',
        description: 'Complete 20 control scenarios',
        icon: 'gamepad2',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        title: 'Signs Expert',
        description: 'Complete 20 sign scenarios',
        icon: 'traffic-cone',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440009',
        title: 'Rules Expert',
        description: 'Complete 20 rule scenarios',
        icon: 'clipboard',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        title: 'Mixed Expert',
        description: 'Complete 20 mixed scenarios',
        icon: 'dice1',
        category: 'mastery',
        requirement: 20,
        points: 75,
        rarity: 'rare',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        title: 'Local Explorer',
        description: 'Practice in 3 different cities',
        icon: 'map-pin',
        category: 'location',
        requirement: 3,
        points: 50,
        rarity: 'rare',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        title: 'Regional Master',
        description: 'Practice in 5 different regions',
        icon: 'map-pin',
        category: 'location',
        requirement: 5,
        points: 100,
        rarity: 'epic',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440013',
        title: 'Question Master',
        description: 'Answer 100 questions correctly',
        icon: 'award',
        category: 'questions',
        requirement: 100,
        points: 150,
        rarity: 'epic',
        is_active: true
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440014',
        title: 'Perfect Score',
        description: 'Get 100% on a test',
        icon: 'star',
        category: 'questions',
        requirement: 1,
        points: 100,
        rarity: 'rare',
        is_active: true
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const achievement of achievements) {
      try {
        const { error } = await supabase
          .from('achievements')
          .insert(achievement);
        
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
    
    // Step 4: Verify the fix
    console.log('🔍 Verifying the fix...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('achievements')
      .select('*')
      .limit(1);
    
    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message);
    } else if (verifyData && verifyData.length > 0) {
      console.log('✅ Verification successful');
      console.log('📋 Available columns:', Object.keys(verifyData[0]));
      console.log('📋 Sample data:', verifyData[0]);
    } else {
      console.log('⚠️  No data found after fix');
    }
    
  } catch (error) {
    console.log('❌ Error fixing schema:', error.message);
  }
}

// Run the fix
fixAchievementsSchema(); 