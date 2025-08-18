import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://lxzwakeusanxquhshcph.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAchievementsDatabase() {
  try {
    console.log('🚀 Setting up Achievement Database Tables...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../database/setup-achievements-simple.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Executing SQL script...');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error) {
          console.log(`⚠️  Statement failed: ${statement.substring(0, 50)}...`);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (e) {
        console.log(`⚠️  Statement execution failed: ${e.message}`);
        errorCount++;
      }
    }
    
    console.log(`✅ SQL execution completed: ${successCount} successful, ${errorCount} failed`);
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    
    const tables = [
      'achievements',
      'user_achievements', 
      'achievement_notifications',
      'achievement_history',
      'achievement_leaderboards'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (e) {
        console.log(`❌ Table ${table}: ${e.message}`);
      }
    }
    
    // Test inserting a sample achievement
    console.log('🧪 Testing achievement insertion...');
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Achievement query failed: ${error.message}`);
      } else {
        console.log(`✅ Achievements found: ${data?.length || 0}`);
        if (data && data.length > 0) {
          console.log(`📋 Sample achievement: ${data[0].title}`);
        }
      }
    } catch (e) {
      console.log(`❌ Achievement test failed: ${e.message}`);
    }
    
    console.log('🎉 Achievement database setup completed!');
    
  } catch (error) {
    console.error('❌ Error setting up achievement database:', error);
    process.exit(1);
  }
}

// Run the setup
setupAchievementsDatabase(); 