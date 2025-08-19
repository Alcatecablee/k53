import { createClient } from '@supabase/supabase-js';

// Test client-side authentication and API calls
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

async function checkClientAuth() {
  console.log('Checking client authentication and API access...');
  
  try {
    // Test 1: Check if we can access the API without authentication
    console.log('\n1. Testing unauthenticated access...');
    
    const { data: unauthenticatedData, error: unauthenticatedError } = await supabase
      .from('daily_usage')
      .select('*')
      .limit(1);
    
    if (unauthenticatedError) {
      console.log('❌ Unauthenticated access blocked (expected):', unauthenticatedError.message);
      console.log('   Error code:', unauthenticatedError.code);
    } else {
      console.log('⚠️  Unauthenticated access allowed (unexpected)');
    }
    
    // Test 2: Check if we can access user_subscriptions without authentication
    const { data: unauthenticatedSubData, error: unauthenticatedSubError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .limit(1);
    
    if (unauthenticatedSubError) {
      console.log('❌ Unauthenticated subscription access blocked (expected):', unauthenticatedSubError.message);
      console.log('   Error code:', unauthenticatedSubError.code);
    } else {
      console.log('⚠️  Unauthenticated subscription access allowed (unexpected)');
    }
    
    // Test 3: Check current session
    console.log('\n2. Checking current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ User is authenticated');
      console.log('   User ID:', session.user.id);
      console.log('   Email:', session.user.email);
      
      // Test 4: Test authenticated access
      console.log('\n3. Testing authenticated access...');
      
      const { data: authData, error: authError } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (authError) {
        console.log('❌ Authenticated daily_usage access error:', authError.message);
        console.log('   Error code:', authError.code);
      } else {
        console.log('✅ Authenticated daily_usage access successful');
        console.log('   Records found:', authData?.length || 0);
      }
      
      const { data: authSubData, error: authSubError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .limit(1);
      
      if (authSubError) {
        console.log('❌ Authenticated user_subscriptions access error:', authSubError.message);
        console.log('   Error code:', authSubError.code);
      } else {
        console.log('✅ Authenticated user_subscriptions access successful');
        console.log('   Records found:', authSubData?.length || 0);
      }
      
    } else {
      console.log('❌ No active session - user is not authenticated');
      console.log('\nTo test authenticated access, you need to:');
      console.log('1. Sign in to the application');
      console.log('2. Run this script again');
    }
    
    // Test 5: Check RLS policies
    console.log('\n4. Checking RLS policies...');
    
    // Test with a specific user ID that might exist
    const testUserId = '6c014ec8-2f79-4809-8c35-4cae1966e0f8'; // From the error logs
    
    const { data: rlsData, error: rlsError } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', testUserId)
      .eq('date', '2025-08-19')
      .limit(1);
    
    if (rlsError) {
      console.log('❌ RLS test error:', rlsError.message);
      console.log('   Error code:', rlsError.code);
      
      if (rlsError.code === '406') {
        console.log('\n🔧 406 error indicates RLS policy issue. Possible solutions:');
        console.log('1. Check if the user exists in auth.users table');
        console.log('2. Verify RLS policies are correctly configured');
        console.log('3. Ensure the user is properly authenticated');
      }
    } else {
      console.log('✅ RLS test successful');
    }
    
    console.log('\n📋 Summary:');
    console.log('- Unauthenticated access:', unauthenticatedError ? '❌ Blocked (good)' : '⚠️  Allowed (bad)');
    console.log('- User session:', session ? '✅ Active' : '❌ None');
    console.log('- Authenticated access:', session && !authError ? '✅ Working' : '❌ Failed');
    console.log('- RLS policies:', rlsError ? '❌ Issue detected' : '✅ Working');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
checkClientAuth(); 