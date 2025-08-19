import { createClient } from '@supabase/supabase-js';

// Test client-side API access with proper authentication
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

async function testClientAccess() {
  console.log('Testing client-side API access...');
  
  try {
    // Test 1: Check current session
    console.log('\n1. Checking authentication status...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ User is authenticated');
      console.log('   User ID:', session.user.id);
      console.log('   Email:', session.user.email);
      
      // Test 2: Test authenticated API access
      console.log('\n2. Testing authenticated API access...');
      
      // Test daily_usage access
      const { data: dailyUsageData, error: dailyUsageError } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (dailyUsageError) {
        console.log('❌ Daily usage access error:', dailyUsageError.message);
        console.log('   Error code:', dailyUsageError.code);
        
        if (dailyUsageError.code === '406') {
          console.log('   🔧 406 error indicates RLS policy issue');
        } else if (dailyUsageError.code === '400') {
          console.log('   🔧 400 error indicates authentication issue');
        }
      } else {
        console.log('✅ Daily usage access successful');
        console.log('   Records found:', dailyUsageData?.length || 0);
      }
      
      // Test user_subscriptions access
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (subscriptionsError) {
        console.log('❌ User subscriptions access error:', subscriptionsError.message);
        console.log('   Error code:', subscriptionsError.code);
        
        if (subscriptionsError.code === '406') {
          console.log('   🔧 406 error indicates RLS policy issue');
        } else if (subscriptionsError.code === '400') {
          console.log('   🔧 400 error indicates authentication issue');
        }
      } else {
        console.log('✅ User subscriptions access successful');
        console.log('   Records found:', subscriptionsData?.length || 0);
      }
      
      // Test 3: Test creating new records
      console.log('\n3. Testing record creation...');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Try to create a daily usage record
      const { data: newUsageData, error: newUsageError } = await supabase
        .from('daily_usage')
        .insert({
          user_id: session.user.id,
          date: today,
          scenarios_used: 0,
          questions_used: 0,
          max_scenarios: 5,
          max_questions: 10
        })
        .select()
        .single();
      
      if (newUsageError) {
        console.log('❌ Daily usage creation error:', newUsageError.message);
        console.log('   Error code:', newUsageError.code);
      } else {
        console.log('✅ Daily usage creation successful');
        console.log('   Created record ID:', newUsageData?.id);
      }
      
      // Try to create a subscription record
      const { data: newSubData, error: newSubError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: session.user.id,
          plan_type: 'free',
          status: 'active',
          price_cents: 0,
          currency: 'ZAR',
          billing_cycle: 'monthly'
        })
        .select()
        .single();
      
      if (newSubError) {
        console.log('❌ User subscription creation error:', newSubError.message);
        console.log('   Error code:', newSubError.code);
      } else {
        console.log('✅ User subscription creation successful');
        console.log('   Created record ID:', newSubData?.id);
      }
      
    } else {
      console.log('❌ No active session - user is not authenticated');
      console.log('\nTo test authenticated access, you need to:');
      console.log('1. Sign in to the application in your browser');
      console.log('2. Run this script again');
      console.log('\nOr test unauthenticated access:');
      
      // Test unauthenticated access (should be blocked)
      console.log('\n4. Testing unauthenticated access...');
      
      const { data: unAuthData, error: unAuthError } = await supabase
        .from('daily_usage')
        .select('*')
        .limit(1);
      
      if (unAuthError) {
        console.log('✅ Unauthenticated access properly blocked');
        console.log('   Error:', unAuthError.message);
        console.log('   Error code:', unAuthError.code);
      } else {
        console.log('⚠️  Unauthenticated access allowed (security issue)');
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('- Authentication:', session ? '✅ Active' : '❌ None');
    console.log('- Daily usage access:', dailyUsageError ? '❌ Failed' : '✅ Working');
    console.log('- User subscriptions access:', subscriptionsError ? '❌ Failed' : '✅ Working');
    console.log('- Record creation:', (newUsageError || newSubError) ? '❌ Failed' : '✅ Working');
    
    if (session && !dailyUsageError && !subscriptionsError) {
      console.log('\n🎉 All tests passed! The 406 errors should be resolved.');
      console.log('Your application should now work correctly.');
    } else if (session && (dailyUsageError || subscriptionsError)) {
      console.log('\n⚠️  Some issues remain. Check the error details above.');
    } else {
      console.log('\nℹ️  Please sign in to the application and run this test again.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testClientAccess(); 