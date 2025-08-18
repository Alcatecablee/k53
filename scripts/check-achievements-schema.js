import { createClient } from '@supabase/supabase-js';

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAchievementsSchema() {
  try {
    console.log('🔍 Checking achievements table schema...');
    
    // Try to get a sample row to see what columns exist
    console.log('🔍 Checking for existing data...');
    const { data: sampleData, error: sampleError } = await supabase
      .from('achievements')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log('❌ Error checking data:', sampleError.message);
      
      // If table doesn't exist, try to create it
      if (sampleError.message.includes('relation "achievements" does not exist')) {
        console.log('📋 Table does not exist. Creating it...');
        await createAchievementsTable();
      }
      return;
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log('📋 Sample row columns:', Object.keys(sampleData[0]));
      console.log('📋 Sample row data:', sampleData[0]);
      
      // Check if category column exists
      if (!sampleData[0].hasOwnProperty('category')) {
        console.log('❌ Category column is missing!');
        console.log('📋 Adding missing columns...');
        await addMissingColumns();
      } else {
        console.log('✅ Category column exists');
      }
    } else {
      console.log('📋 Table exists but is empty');
      
      // Check if we can insert a test row to see what columns are available
      console.log('🔍 Testing insert to check columns...');
      await testInsert();
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function createAchievementsTable() {
  try {
    // Try to create the table using the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE IF NOT EXISTS achievements (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            icon VARCHAR(100) NOT NULL,
            category VARCHAR(50) NOT NULL,
            requirement INTEGER NOT NULL DEFAULT 1,
            points INTEGER NOT NULL DEFAULT 10,
            rarity VARCHAR(20) NOT NULL DEFAULT 'common',
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
    });

    if (response.ok) {
      console.log('✅ Achievements table created successfully');
    } else {
      const errorText = await response.text();
      console.log('⚠️  Table creation failed:', errorText);
    }
  } catch (e) {
    console.log('⚠️  Table creation failed:', e.message);
  }
}

async function addMissingColumns() {
  try {
    const columnsToAdd = [
      { name: 'category', type: 'VARCHAR(50)', defaultValue: "'scenarios'" },
      { name: 'points', type: 'INTEGER', defaultValue: '10' },
      { name: 'rarity', type: 'VARCHAR(20)', defaultValue: "'common'" },
      { name: 'is_active', type: 'BOOLEAN', defaultValue: 'true' },
      { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE', defaultValue: 'NOW()' }
    ];

    for (const column of columnsToAdd) {
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE achievements ADD COLUMN IF NOT EXISTS ${column.name} ${column.type} DEFAULT ${column.defaultValue};`
        });
        
        if (error) {
          console.log(`⚠️  Could not add column ${column.name}:`, error.message);
        } else {
          console.log(`✅ Added column ${column.name}`);
        }
      } catch (e) {
        console.log(`⚠️  Could not add column ${column.name}:`, e.message);
      }
    }
  } catch (error) {
    console.log('❌ Error adding columns:', error.message);
  }
}

async function testInsert() {
  try {
    // Try to insert a test achievement with all expected columns
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Test Achievement',
        description: 'Test description',
        icon: 'target',
        category: 'scenarios',
        requirement: 1,
        points: 10,
        rarity: 'common',
        is_active: true
      })
      .select();
    
    if (error) {
      console.log('❌ Insert test failed:', error.message);
      
      // Try with minimal columns
      const { data: minimalData, error: minimalError } = await supabase
        .from('achievements')
        .insert({
          title: 'Test Achievement',
          description: 'Test description',
          icon: 'target'
        })
        .select();
      
      if (minimalError) {
        console.log('❌ Minimal insert also failed:', minimalError.message);
      } else {
        console.log('✅ Minimal insert succeeded');
        console.log('📋 Available columns:', Object.keys(minimalData[0]));
      }
    } else {
      console.log('✅ Full insert succeeded');
      console.log('📋 Available columns:', Object.keys(data[0]));
    }
  } catch (error) {
    console.log('❌ Error testing insert:', error.message);
  }
}

// Run the check
checkAchievementsSchema(); 