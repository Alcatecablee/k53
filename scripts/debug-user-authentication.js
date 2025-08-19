import { createClient } from '@supabase/supabase-js';

// Debug specific user authentication issue
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function debugUserAuthentication() {
  console.log('Debugging user authentication issue...');
  
  const problemUserId = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
  const problemDate = '2025-08-19';
  
  try {
    // Check 1: Verify user exists in auth.users
    console.log('\n1. Checking if user exists in auth.users...');
    
    const { data: userData, error: userError } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .eq('id', problemUserId)
      .single();
    
    if (userError) {
      console.log('❌ Error checking auth.users:', userError.message);
      console.log('   This suggests the user does not exist in auth.users table');
    } else if (userData) {
      console.log('✅ User found in auth.users');
      console.log('   User ID:', userData.id);
      console.log('   Email:', userData.email);
      console.log('   Created:', userData.created_at);
    } else {
      console.log('❌ User not found in auth.users table');
    }
    
    // Check 2: Check if user exists in profiles table
    console.log('\n2. Checking if user exists in profiles table...');
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', problemUserId)
      .single();
    
    if (profileError) {
      console.log('❌ Error checking profiles:', profileError.message);
    } else if (profileData) {
      console.log('✅ User found in profiles table');
      console.log('   Profile data:', profileData);
    } else {
      console.log('❌ User not found in profiles table');
    }
    
    // Check 3: Check existing daily_usage records for this user
    console.log('\n3. Checking existing daily_usage records...');
    
    const { data: usageData, error: usageError } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', problemUserId);
    
    if (usageError) {
      console.log('❌ Error checking daily_usage:', usageError.message);
      console.log('   Error code:', usageError.code);
    } else {
      console.log('✅ Daily usage records found:', usageData?.length || 0);
      if (usageData && usageData.length > 0) {
        usageData.forEach(record => {
          console.log(`   - Date: ${record.date}, Scenarios: ${record.scenarios_used}, Questions: ${record.questions_used}`);
        });
      }
    }
    
    // Check 4: Check existing user_subscriptions records for this user
    console.log('\n4. Checking existing user_subscriptions records...');
    
    const { data: subData, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', problemUserId);
    
    if (subError) {
      console.log('❌ Error checking user_subscriptions:', subError.message);
      console.log('   Error code:', subError.code);
    } else {
      console.log('✅ User subscription records found:', subData?.length || 0);
      if (subData && subData.length > 0) {
        subData.forEach(record => {
          console.log(`   - Plan: ${record.plan_type}, Status: ${record.status}`);
        });
      }
    }
    
    // Check 5: Test creating a record for this specific user
    console.log('\n5. Testing record creation for problem user...');
    
    const { data: newUsageData, error: newUsageError } = await supabase
      .from('daily_usage')
      .insert({
        user_id: problemUserId,
        date: problemDate,
        scenarios_used: 0,
        questions_used: 0,
        max_scenarios: 5,
        max_questions: 10
      })
      .select()
      .single();
    
    if (newUsageError) {
      console.log('❌ Error creating daily_usage record:', newUsageError.message);
      console.log('   Error code:', newUsageError.code);
      
      if (newUsageError.code === '23503') {
        console.log('   🔧 Foreign key constraint violation - user does not exist in auth.users');
      } else if (newUsageError.code === '406') {
        console.log('   🔧 RLS policy violation - authentication issue');
      }
    } else {
      console.log('✅ Successfully created daily_usage record');
      console.log('   Record ID:', newUsageData?.id);
    }
    
    // Check 6: Test the exact query that's failing
    console.log('\n6. Testing the exact failing query...');
    
    const { data: exactQueryData, error: exactQueryError } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', problemUserId)
      .eq('date', problemDate);
    
    if (exactQueryError) {
      console.log('❌ Exact query failed:', exactQueryError.message);
      console.log('   Error code:', exactQueryError.code);
    } else {
      console.log('✅ Exact query successful');
      console.log('   Records found:', exactQueryData?.length || 0);
    }
    
    console.log('\n📋 Summary:');
    console.log('- User in auth.users:', userData ? '✅ Exists' : '❌ Missing');
    console.log('- User in profiles:', profileData ? '✅ Exists' : '❌ Missing');
    console.log('- Daily usage records:', usageData ? `✅ ${usageData.length} found` : '❌ Error');
    console.log('- Subscription records:', subData ? `✅ ${subData.length} found` : '❌ Error');
    console.log('- Record creation:', newUsageError ? '❌ Failed' : '✅ Success');
    console.log('- Exact query:', exactQueryError ? '❌ Failed' : '✅ Success');
    
    // Provide recommendations
    console.log('\n🔧 Recommendations:');
    
    if (!userData) {
      console.log('1. The user does not exist in auth.users table');
      console.log('   - This is likely the root cause of the 406 errors');
      console.log('   - The user may have been deleted or never properly created');
      console.log('   - Solution: Recreate the user account or check authentication flow');
    }
    
    if (newUsageError && newUsageError.code === '23503') {
      console.log('2. Foreign key constraint violation detected');
      console.log('   - The daily_usage table has a foreign key to auth.users');
      console.log('   - Cannot create records for non-existent users');
      console.log('   - Solution: Ensure user exists in auth.users before creating records');
    }
    
    if (exactQueryError && exactQueryError.code === '406') {
      console.log('3. RLS policy violation still occurring');
      console.log('   - Even with clean policies, user authentication is failing');
      console.log('   - Solution: Check client-side authentication and session management');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

// Run the debug
debugUserAuthentication(); 