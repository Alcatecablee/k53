import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAchievementsSimple() {
  try {
    console.log('🔧 Fixing achievements table (simple approach)...');
    
    // First, let's see what columns actually exist
    console.log('🔍 Checking current table structure...');
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ Could not check table:', error.message);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('📋 Current columns:', Object.keys(data[0]));
      } else {
        console.log('📋 Table is empty');
      }
    } catch (e) {
      console.log('❌ Could not check table:', e.message);
      return;
    }
    
    // Try to insert achievements with minimal columns first
    console.log('📋 Inserting achievements with minimal columns...');
    
    const minimalAchievements = [
      {
        title: 'First Steps',
        description: 'Complete your first scenario',
        icon: 'target'
      },
      {
        title: 'Scenario Master',
        description: 'Complete 50 scenarios',
        icon: 'target'
      },
      {
        title: 'Scenario Expert',
        description: 'Complete 100 scenarios',
        icon: 'target'
      },
      {
        title: 'Consistent Learner',
        description: 'Maintain a 3-day streak',
        icon: 'flame'
      },
      {
        title: 'Dedicated Student',
        description: 'Maintain a 7-day streak',
        icon: 'flame'
      },
      {
        title: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: 'flame'
      },
      {
        title: 'Controls Expert',
        description: 'Complete 20 control scenarios',
        icon: 'gamepad2'
      },
      {
        title: 'Signs Expert',
        description: 'Complete 20 sign scenarios',
        icon: 'traffic-cone'
      },
      {
        title: 'Rules Expert',
        description: 'Complete 20 rule scenarios',
        icon: 'clipboard'
      },
      {
        title: 'Mixed Expert',
        description: 'Complete 20 mixed scenarios',
        icon: 'dice1'
      },
      {
        title: 'Local Explorer',
        description: 'Practice in 3 different cities',
        icon: 'map-pin'
      },
      {
        title: 'Regional Master',
        description: 'Practice in 5 different regions',
        icon: 'map-pin'
      },
      {
        title: 'Question Master',
        description: 'Answer 100 questions correctly',
        icon: 'award'
      },
      {
        title: 'Perfect Score',
        description: 'Get 100% on a test',
        icon: 'star'
      }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const achievement of minimalAchievements) {
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
    
    // Verify the results
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
        console.log(`  - ${achievement.title}`);
      });
    } else {
      console.log('⚠️  No data found after insert');
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the fix
fixAchievementsSimple(); 