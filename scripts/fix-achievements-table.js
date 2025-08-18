import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAchievementsTable() {
  try {
    console.log('🔧 Fixing achievements table...');
    
    // First, let's check what columns exist in the achievements table
    console.log('🔍 Checking existing columns...');
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ Could not check achievements table:', error.message);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('📋 Existing columns:', Object.keys(data[0]));
      } else {
        console.log('📋 Achievements table is empty');
      }
    } catch (e) {
      console.log('❌ Could not check achievements table:', e.message);
      return;
    }

    // Try to add missing columns using the REST API
    console.log('📋 Adding missing columns...');
    
    const columnsToAdd = [
      { name: 'category', type: 'VARCHAR(50)', defaultValue: "'scenarios'" },
      { name: 'points', type: 'INTEGER', defaultValue: '10' },
      { name: 'rarity', type: 'VARCHAR(20)', defaultValue: "'common'" },
      { name: 'is_active', type: 'BOOLEAN', defaultValue: 'true' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE', defaultValue: 'NOW()' }
    ];

    for (const column of columnsToAdd) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({
            sql: `ALTER TABLE achievements ADD COLUMN IF NOT EXISTS ${column.name} ${column.type} DEFAULT ${column.defaultValue};`
          })
        });

        if (response.ok) {
          console.log(`✅ Added column: ${column.name}`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️  Failed to add column ${column.name}:`, errorText);
        }
      } catch (e) {
        console.log(`⚠️  Failed to add column ${column.name}:`, e.message);
      }
    }

    // Now try to insert achievements
    console.log('📋 Inserting achievements...');
    
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
          console.log('📋 Sample achievement columns:', Object.keys(data[0]));
          console.log('📋 Sample achievements:');
          data.forEach(achievement => {
            console.log(`  - ${achievement.title} (${achievement.category || 'no category'})`);
          });
        }
      }
    } catch (e) {
      console.log('❌ Final verification failed:', e.message);
    }
    
    console.log('🎉 Achievements table fix completed!');
    console.log(`📊 Summary: ${insertedCount} achievements inserted`);
    
  } catch (error) {
    console.error('❌ Error fixing achievements table:', error);
    process.exit(1);
  }
}

// Run the fix
fixAchievementsTable(); 