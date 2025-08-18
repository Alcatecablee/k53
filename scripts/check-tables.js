import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...');
    
    // List of tables to check
    const tablesToCheck = [
      'achievements',
      'user_achievements', 
      'achievement_notifications',
      'achievement_history',
      'achievement_analytics',
      'achievement_exports',
      'achievement_leaderboards',
      'achievement_shares',
      'profiles',
      'scenarios',
      'questions'
    ];

    for (const tableName of tablesToCheck) {
      try {
        console.log(`\n📋 Checking table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ Table ${tableName} exists`);
          
          if (data && data.length > 0) {
            console.log(`📊 Columns in ${tableName}:`, Object.keys(data[0]));
            console.log(`📊 Row count: ${data.length} (sample)`);
          } else {
            console.log(`📊 Table ${tableName} is empty`);
            
            // Try to get column info by attempting to insert a dummy row
            try {
              const dummyData = {};
              if (tableName === 'achievements') {
                dummyData.id = 'test-id';
                dummyData.title = 'Test Achievement';
                dummyData.description = 'Test Description';
                dummyData.icon = 'test';
                dummyData.requirement = 1;
              } else if (tableName === 'profiles') {
                dummyData.id = 'test-user-id';
                dummyData.email = 'test@example.com';
              } else if (tableName === 'scenarios') {
                dummyData.id = 'test-scenario-id';
                dummyData.title = 'Test Scenario';
              } else if (tableName === 'questions') {
                dummyData.id = 'test-question-id';
                dummyData.question = 'Test Question';
              }
              
              if (Object.keys(dummyData).length > 0) {
                const { error: insertError } = await supabase
                  .from(tableName)
                  .insert(dummyData);
                
                if (insertError) {
                  console.log(`📋 Expected columns for ${tableName}:`, Object.keys(dummyData));
                  console.log(`📋 Insert error (shows missing columns):`, insertError.message);
                } else {
                  console.log(`📋 Successfully inserted test data into ${tableName}`);
                  // Clean up test data
                  await supabase.from(tableName).delete().eq('id', dummyData.id);
                }
              }
            } catch (e) {
              console.log(`📋 Could not test insert for ${tableName}:`, e.message);
            }
          }
        }
      } catch (e) {
        console.log(`❌ Error checking table ${tableName}:`, e.message);
      }
    }

    // Check for RPC functions
    console.log('\n🔍 Checking RPC functions...');
    
    const functionsToCheck = [
      'get_user_achievements',
      'update_achievement_progress', 
      'get_achievement_leaderboard',
      'exec_sql'
    ];

    for (const funcName of functionsToCheck) {
      try {
        const { data, error } = await supabase.rpc(funcName, {});
        
        if (error) {
          console.log(`❌ Function ${funcName}: ${error.message}`);
        } else {
          console.log(`✅ Function ${funcName} exists`);
        }
      } catch (e) {
        console.log(`❌ Function ${funcName}: ${e.message}`);
      }
    }

    console.log('\n🎉 Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
    process.exit(1);
  }
}

// Run the check
checkTables(); 