import { createClient } from '@supabase/supabase-js';

// Test database connection
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testDatabaseConnection() {
  console.log('Testing database connection and tables...');
  
  try {
    // Test 1: Check if profiles table exists
    console.log('\n1. Testing profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ Profiles table error:', profilesError.message);
    } else {
      console.log('✅ Profiles table is accessible');
    }
    
    // Test 2: Check if daily_usage table exists
    console.log('\n2. Testing daily_usage table...');
    const { data: dailyUsageData, error: dailyUsageError } = await supabase
      .from('daily_usage')
      .select('count')
      .limit(1);
    
    if (dailyUsageError) {
      console.log('❌ Daily usage table error:', dailyUsageError.message);
      console.log('   Error code:', dailyUsageError.code);
    } else {
      console.log('✅ Daily usage table is accessible');
    }
    
    // Test 3: Check if user_subscriptions table exists
    console.log('\n3. Testing user_subscriptions table...');
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('user_subscriptions')
      .select('count')
      .limit(1);
    
    if (subscriptionsError) {
      console.log('❌ User subscriptions table error:', subscriptionsError.message);
      console.log('   Error code:', subscriptionsError.code);
    } else {
      console.log('✅ User subscriptions table is accessible');
    }
    
    // Test 4: Check table structure
    console.log('\n4. Checking table structure...');
    
    // Test daily_usage structure
    const { data: dailyUsageStructure, error: dailyUsageStructureError } = await supabase
      .from('daily_usage')
      .select('id, user_id, date, scenarios_used, questions_used, max_scenarios, max_questions')
      .limit(0);
    
    if (dailyUsageStructureError) {
      console.log('❌ Daily usage table structure error:', dailyUsageStructureError.message);
    } else {
      console.log('✅ Daily usage table structure is correct');
    }
    
    // Test user_subscriptions structure
    const { data: subscriptionsStructure, error: subscriptionsStructureError } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, plan_type, status, price_cents, currency, billing_cycle')
      .limit(0);
    
    if (subscriptionsStructureError) {
      console.log('❌ User subscriptions table structure error:', subscriptionsStructureError.message);
    } else {
      console.log('✅ User subscriptions table structure is correct');
    }
    
    console.log('\n📋 Summary:');
    console.log('- Profiles table:', profilesError ? '❌ Error' : '✅ OK');
    console.log('- Daily usage table:', dailyUsageError ? '❌ Error' : '✅ OK');
    console.log('- User subscriptions table:', subscriptionsError ? '❌ Error' : '✅ OK');
    
    if (dailyUsageError || subscriptionsError) {
      console.log('\n🔧 To fix the issues, run the SQL in database/fix-table-constraints.sql in your Supabase SQL Editor');
    } else {
      console.log('\n🎉 All tables are working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDatabaseConnection(); 