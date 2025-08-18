import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function recreateAchievementsTable() {
  try {
    console.log('🔧 Recreating achievements table with correct schema...');
    
    // Step 1: Try to drop the existing table using REST API
    console.log('📋 Dropping existing achievements table...');
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: 'DROP TABLE IF EXISTS achievements CASCADE;'
        })
      });

      if (response.ok) {
        console.log('✅ Dropped existing table');
      } else {
        const errorText = await response.text();
        console.log('⚠️  Could not drop table via REST API:', errorText);
      }
    } catch (e) {
      console.log('⚠️  Could not drop table via REST API:', e.message);
    }
    
    // Step 2: Try to create the table using REST API
    console.log('📋 Creating new achievements table...');
    
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
        console.log('✅ Created new table successfully');
      } else {
        const errorText = await response.text();
        console.log('⚠️  Could not create table via REST API:', errorText);
        console.log('📋 Trying alternative approach...');
        await tryAlternativeApproach();
        return;
      }
    } catch (e) {
      console.log('⚠️  Could not create table via REST API:', e.message);
      console.log('📋 Trying alternative approach...');
      await tryAlternativeApproach();
      return;
    }
    
    // Step 3: Insert achievements
    console.log('📋 Inserting achievements...');
    await insertAchievements();
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function tryAlternativeApproach() {
  console.log('📋 Trying to work with existing table structure...');
  
  // Try to insert with a dummy user_id to see what happens
  try {
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID
        title: 'Test Achievement',
        description: 'Test description',
        icon: 'target'
      })
      .select();
    
    if (error) {
      console.log('❌ Alternative approach failed:', error.message);
    } else {
      console.log('✅ Alternative approach worked');
      console.log('📋 Available columns:', Object.keys(data[0]));
      
      // Now try to insert the real achievements
      await insertAchievementsWithUserId();
    }
  } catch (e) {
    console.log('❌ Alternative approach failed:', e.message);
  }
}

async function insertAchievements() {
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
  
  // Verify results
  console.log('🔍 Verifying results...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('achievements')
    .select('*')
    .limit(5);
  
  if (verifyError) {
    console.log('❌ Verification failed:', verifyError.message);
  } else if (verifyData && verifyData.length > 0) {
    console.log('✅ Verification successful');
    console.log('📋 Available columns:', Object.keys(verifyData[0]));
    console.log('📋 Sample achievements:');
    verifyData.forEach(achievement => {
      console.log(`  - ${achievement.title} (${achievement.category || 'no category'})`);
    });
  } else {
    console.log('⚠️  No data found after insert');
  }
}

async function insertAchievementsWithUserId() {
  // If we need to work with the existing table that has user_id
  const achievements = [
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'First Steps',
      description: 'Complete your first scenario',
      icon: 'target'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Scenario Master',
      description: 'Complete 50 scenarios',
      icon: 'target'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Scenario Expert',
      description: 'Complete 100 scenarios',
      icon: 'target'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Consistent Learner',
      description: 'Maintain a 3-day streak',
      icon: 'flame'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Dedicated Student',
      description: 'Maintain a 7-day streak',
      icon: 'flame'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Unstoppable',
      description: 'Maintain a 30-day streak',
      icon: 'flame'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Controls Expert',
      description: 'Complete 20 control scenarios',
      icon: 'gamepad2'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Signs Expert',
      description: 'Complete 20 sign scenarios',
      icon: 'traffic-cone'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Rules Expert',
      description: 'Complete 20 rule scenarios',
      icon: 'clipboard'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Mixed Expert',
      description: 'Complete 20 mixed scenarios',
      icon: 'dice1'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Local Explorer',
      description: 'Practice in 3 different cities',
      icon: 'map-pin'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Regional Master',
      description: 'Practice in 5 different regions',
      icon: 'map-pin'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Question Master',
      description: 'Answer 100 questions correctly',
      icon: 'award'
    },
    {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Perfect Score',
      description: 'Get 100% on a test',
      icon: 'star'
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
}

// Run the fix
recreateAchievementsTable(); 