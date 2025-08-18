import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAchievementsDatabase() {
  try {
    console.log('🚀 Setting up Achievement Database Tables...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../database/create-achievements-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Executing SQL script...');
    
    // Execute the SQL script
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('⚠️  exec_sql not available, trying direct execution...');
      
      // Split the SQL into individual statements and execute them
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (stmtError) {
            console.log(`⚠️  Statement failed (this might be expected): ${statement.substring(0, 50)}...`);
          }
        } catch (e) {
          console.log(`⚠️  Statement execution failed (this might be expected): ${e.message}`);
        }
      }
    }
    
    console.log('✅ Achievement database setup completed!');
    
    // Verify tables were created
    console.log('🔍 Verifying tables...');
    
    const tables = [
      'achievements',
      'user_achievements', 
      'achievement_notifications',
      'achievement_history',
      'achievement_analytics',
      'achievement_exports',
      'achievement_leaderboards',
      'achievement_shares'
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
    
    console.log('🎉 Achievement database setup verification completed!');
    
  } catch (error) {
    console.error('❌ Error setting up achievement database:', error);
    process.exit(1);
  }
}

// Run the setup
setupAchievementsDatabase(); 