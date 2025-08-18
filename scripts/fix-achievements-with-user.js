import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAchievementsWithUser() {
  try {
    console.log('🔧 Fixing achievements table with user approach...');
    
    // First, let's get a real user ID from the auth.users table
    console.log('📋 Getting a real user ID...');
    
    try {
      const { data: users, error: userError } = await supabase.auth.admin.listUsers();
      
      if (userError) {
        console.log('❌ Could not get users:', userError.message);
        console.log('📋 Trying to create a test user...');
        await createTestUser();
        return;
      }
      
      if (users && users.users && users.users.length > 0) {
        const userId = users.users[0].id;
        console.log(`✅ Found user: ${userId}`);
        await insertAchievementsForUser(userId);
      } else {
        console.log('📋 No users found, creating test user...');
        await createTestUser();
      }
    } catch (e) {
      console.log('❌ Could not get users:', e.message);
      console.log('📋 Trying to create a test user...');
      await createTestUser();
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function createTestUser() {
  try {
    console.log('📋 Creating test user...');
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test-achievements@example.com',
      password: 'testpassword123',
      email_confirm: true
    });
    
    if (error) {
      console.log('❌ Could not create test user:', error.message);
      return;
    }
    
    console.log(`✅ Created test user: ${data.user.id}`);
    await insertAchievementsForUser(data.user.id);
    
  } catch (e) {
    console.log('❌ Could not create test user:', e.message);
  }
}

async function insertAchievementsForUser(userId) {
  console.log(`📋 Inserting achievements for user: ${userId}`);
  
  const achievements = [
    {
      user_id: userId,
      title: 'First Steps',
      description: 'Complete your first scenario',
      icon: 'target',
      achievement_type: 'scenarios',
      requirement: 1
    },
    {
      user_id: userId,
      title: 'Scenario Master',
      description: 'Complete 50 scenarios',
      icon: 'target',
      achievement_type: 'scenarios',
      requirement: 50
    },
    {
      user_id: userId,
      title: 'Scenario Expert',
      description: 'Complete 100 scenarios',
      icon: 'target',
      achievement_type: 'scenarios',
      requirement: 100
    },
    {
      user_id: userId,
      title: 'Consistent Learner',
      description: 'Maintain a 3-day streak',
      icon: 'flame',
      achievement_type: 'streak',
      requirement: 3
    },
    {
      user_id: userId,
      title: 'Dedicated Student',
      description: 'Maintain a 7-day streak',
      icon: 'flame',
      achievement_type: 'streak',
      requirement: 7
    },
    {
      user_id: userId,
      title: 'Unstoppable',
      description: 'Maintain a 30-day streak',
      icon: 'flame',
      achievement_type: 'streak',
      requirement: 30
    },
    {
      user_id: userId,
      title: 'Controls Expert',
      description: 'Complete 20 control scenarios',
      icon: 'gamepad2',
      achievement_type: 'mastery',
      requirement: 20
    },
    {
      user_id: userId,
      title: 'Signs Expert',
      description: 'Complete 20 sign scenarios',
      icon: 'traffic-cone',
      achievement_type: 'mastery',
      requirement: 20
    },
    {
      user_id: userId,
      title: 'Rules Expert',
      description: 'Complete 20 rule scenarios',
      icon: 'clipboard',
      achievement_type: 'mastery',
      requirement: 20
    },
    {
      user_id: userId,
      title: 'Mixed Expert',
      description: 'Complete 20 mixed scenarios',
      icon: 'dice1',
      achievement_type: 'mastery',
      requirement: 20
    },
    {
      user_id: userId,
      title: 'Local Explorer',
      description: 'Practice in 3 different cities',
      icon: 'map-pin',
      achievement_type: 'location',
      requirement: 3
    },
    {
      user_id: userId,
      title: 'Regional Master',
      description: 'Practice in 5 different regions',
      icon: 'map-pin',
      achievement_type: 'location',
      requirement: 5
    },
    {
      user_id: userId,
      title: 'Question Master',
      description: 'Answer 100 questions correctly',
      icon: 'award',
      achievement_type: 'questions',
      requirement: 100
    },
    {
      user_id: userId,
      title: 'Perfect Score',
      description: 'Get 100% on a test',
      icon: 'star',
      achievement_type: 'questions',
      requirement: 1
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
    .eq('user_id', userId)
    .limit(5);
  
  if (verifyError) {
    console.log('❌ Verification failed:', verifyError.message);
  } else if (verifyData && verifyData.length > 0) {
    console.log('✅ Verification successful');
    console.log('📋 Available columns:', Object.keys(verifyData[0]));
    console.log('📋 Sample achievements:');
    verifyData.forEach(achievement => {
      console.log(`  - ${achievement.title} (${achievement.achievement_type})`);
    });
  } else {
    console.log('⚠️  No data found after insert');
  }
}

// Run the fix
fixAchievementsWithUser(); 