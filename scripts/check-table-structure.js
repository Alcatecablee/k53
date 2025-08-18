import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  try {
    console.log('🔍 Checking achievements table structure...');
    
    // Try to insert a record with all potentially required fields
    console.log('📋 Testing insert with all required fields...');
    
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000000',
      title: 'Test Achievement',
      description: 'Test description',
      icon: 'target',
      achievement_type: 'scenarios',
      requirement: 1
    };
    
    try {
      const { data, error } = await supabase
        .from('achievements')
        .insert(testData)
        .select();
      
      if (error) {
        console.log('❌ Insert failed:', error.message);
        
        // Try with different achievement_type values
        const types = ['scenarios', 'questions', 'location', 'streak', 'mastery'];
        
        for (const type of types) {
          try {
            const { data: testData2, error: error2 } = await supabase
              .from('achievements')
              .insert({
                user_id: '00000000-0000-0000-0000-000000000000',
                title: `Test ${type}`,
                description: 'Test description',
                icon: 'target',
                achievement_type: type,
                requirement: 1
              })
              .select();
            
            if (error2) {
              console.log(`❌ Failed with achievement_type '${type}':`, error2.message);
            } else {
              console.log(`✅ Success with achievement_type '${type}'`);
              console.log('📋 Available columns:', Object.keys(testData2[0]));
              console.log('📋 Sample data:', testData2[0]);
              
              // Clean up the test record
              await supabase
                .from('achievements')
                .delete()
                .eq('title', `Test ${type}`);
              
              break;
            }
          } catch (e) {
            console.log(`❌ Exception with achievement_type '${type}':`, e.message);
          }
        }
      } else {
        console.log('✅ Insert succeeded');
        console.log('📋 Available columns:', Object.keys(data[0]));
        console.log('📋 Sample data:', data[0]);
        
        // Clean up the test record
        await supabase
          .from('achievements')
          .delete()
          .eq('title', 'Test Achievement');
      }
    } catch (e) {
      console.log('❌ Exception during insert:', e.message);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run the check
checkTableStructure(); 