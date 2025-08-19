import { createClient } from '@supabase/supabase-js';

// Test PayPal configuration
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testPayPalConfig() {
  console.log('Testing PayPal configuration...');
  
  try {
    // Test 1: Check if server is running
    console.log('\n1. Testing server connectivity...');
    
    const serverResponse = await fetch('http://localhost:3000/api/ping');
    
    if (serverResponse.ok) {
      const serverData = await serverResponse.json();
      console.log('✅ Server is running');
      console.log('   Response:', serverData);
    } else {
      console.log('❌ Server is not responding');
      console.log('   Status:', serverResponse.status);
      return;
    }
    
    // Test 2: Check PayPal endpoint directly
    console.log('\n2. Testing PayPal create-order endpoint...');
    
    const paypalResponse = await fetch('http://localhost:3000/api/paypal/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: 'basic',
        amount: 3900, // Amount in cents (R39.00)
        currency: 'ZAR',
        userId: 'test-user-id'
      }),
    });
    
    if (paypalResponse.ok) {
      const paypalData = await paypalResponse.json();
      console.log('✅ PayPal endpoint is working');
      console.log('   Response:', paypalData);
    } else {
      const errorData = await paypalResponse.json();
      console.log('❌ PayPal endpoint failed');
      console.log('   Status:', paypalResponse.status);
      console.log('   Error:', errorData);
      
      if (paypalResponse.status === 500) {
        console.log('\n🔧 500 error indicates server-side issue:');
        console.log('   - Check PayPal credentials in environment variables');
        console.log('   - Check server logs for detailed error');
        console.log('   - Verify PayPal API connectivity');
      }
    }
    
    // Test 3: Check environment variables
    console.log('\n3. Checking environment variables...');
    
    // Test if we can access environment variables from client
    const envResponse = await fetch('http://localhost:3000/api/demo');
    
    if (envResponse.ok) {
      const envData = await envResponse.json();
      console.log('✅ Environment check successful');
      console.log('   Data:', envData);
    } else {
      console.log('❌ Environment check failed');
      console.log('   Status:', envResponse.status);
    }
    
    console.log('\n📋 Summary:');
    console.log('- Server connectivity:', serverResponse.ok ? '✅ Working' : '❌ Failed');
    console.log('- PayPal endpoint:', paypalResponse.ok ? '✅ Working' : '❌ Failed');
    console.log('- Environment check:', envResponse.ok ? '✅ Working' : '❌ Failed');
    
    if (!paypalResponse.ok) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if server is running: npm run dev');
      console.log('2. Verify PayPal credentials in .env file');
      console.log('3. Check server console for detailed error logs');
      console.log('4. Ensure PayPal sandbox/live environment is correct');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('\n🔧 Network error detected:');
      console.log('   - Make sure the server is running on localhost:3000');
      console.log('   - Check if there are any CORS issues');
      console.log('   - Verify the API endpoint is correct');
    }
  }
}

// Run the test
testPayPalConfig(); 