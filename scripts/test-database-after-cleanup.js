import { createClient } from '@supabase/supabase-js';

// Test database after policy cleanup
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabaseAfterCleanup() {
  console.log('Testing database after policy cleanup...');
  
  try {
    // Test 1: Check RLS policies
    console.log('\n1. Checking RLS policies...');
    
    const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          tablename,
          policyname,
          cmd,
          COUNT(*) as policy_count
        FROM pg_policies 
        WHERE tablename IN ('daily_usage', 'user_subscriptions')
        GROUP BY tablename, policyname, cmd
        ORDER BY tablename, policyname;
      `
    });
    
    if (policiesError) {
      console.log('❌ Error checking policies:', policiesError.message);
    } else {
      console.log('✅ RLS policies check successful');
      console.log('   Policies found:', policies?.length || 0);
      
      if (policies) {
        policies.forEach(policy => {
          console.log(`   - ${policy.tablename}: ${policy.policyname} (${policy.cmd})`);
        });
      }
    }
    
    // Test 2: Check table structure
    console.log('\n2. Checking table structure...');
    
    const { data: structure, error: structureError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT 
          table_name,
          column_name,
          data_type,
          is_nullable
        FROM information_schema.columns 
        WHERE table_name IN ('daily_usage', 'user_subscriptions')
        ORDER BY table_name, ordinal_position;
      `
    });
    
    if (structureError) {
      console.log('❌ Error checking table structure:', structureError.message);
    } else {
      console.log('✅ Table structure check successful');
      console.log('   Columns found:', structure?.length || 0);
    }
    
    // Test 3: Test basic operations
    console.log('\n3. Testing basic operations...');
    
    // Test daily_usage operations
    const testUserId = '00000000-0000-0000-0000-000000000000';
    const testDate = '2025-01-01';
    
    // Test insert (should work with service role)
    const { data: insertData, error: insertError } = await supabase
      .from('daily_usage')
      .insert({
        user_id: testUserId,
        date: testDate,
        scenarios_used: 0,
        questions_used: 0,
        max_scenarios: 5,
        max_questions: 10
      })
      .select();
    
    if (insertError) {
      console.log('❌ Daily usage insert test failed:', insertError.message);
    } else {
      console.log('✅ Daily usage insert test successful');
    }
    
    // Test select
    const { data: selectData, error: selectError } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', testUserId)
      .eq('date', testDate)
      .limit(1);
    
    if (selectError) {
      console.log('❌ Daily usage select test failed:', selectError.message);
    } else {
      console.log('✅ Daily usage select test successful');
      console.log('   Records found:', selectData?.length || 0);
    }
    
    // Test user_subscriptions operations
    const { data: subInsertData, error: subInsertError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: testUserId,
        plan_type: 'free',
        status: 'active',
        price_cents: 0,
        currency: 'ZAR',
        billing_cycle: 'monthly'
      })
      .select();
    
    if (subInsertError) {
      console.log('❌ User subscriptions insert test failed:', subInsertError.message);
    } else {
      console.log('✅ User subscriptions insert test successful');
    }
    
    // Test select
    const { data: subSelectData, error: subSelectError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', testUserId)
      .limit(1);
    
    if (subSelectError) {
      console.log('❌ User subscriptions select test failed:', subSelectError.message);
    } else {
      console.log('✅ User subscriptions select test successful');
      console.log('   Records found:', subSelectData?.length || 0);
    }
    
    // Test 4: Clean up test data
    console.log('\n4. Cleaning up test data...');
    
    const { error: cleanupError } = await supabase
      .from('daily_usage')
      .delete()
      .eq('user_id', testUserId);
    
    if (cleanupError) {
      console.log('❌ Daily usage cleanup failed:', cleanupError.message);
    } else {
      console.log('✅ Daily usage cleanup successful');
    }
    
    const { error: subCleanupError } = await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', testUserId);
    
    if (subCleanupError) {
      console.log('❌ User subscriptions cleanup failed:', subCleanupError.message);
    } else {
      console.log('✅ User subscriptions cleanup successful');
    }
    
    console.log('\n📋 Summary:');
    console.log('- RLS policies:', policiesError ? '❌ Error' : '✅ Clean');
    console.log('- Table structure:', structureError ? '❌ Error' : '✅ Valid');
    console.log('- Daily usage operations:', insertError || selectError ? '❌ Failed' : '✅ Working');
    console.log('- User subscriptions operations:', subInsertError || subSelectError ? '❌ Failed' : '✅ Working');
    
    if (!policiesError && !structureError && !insertError && !selectError && !subInsertError && !subSelectError) {
      console.log('\n🎉 All tests passed! Database is working correctly.');
      console.log('\nThe 406 errors should now be resolved. Test your application to confirm.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the errors above for details.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDatabaseAfterCleanup(); 