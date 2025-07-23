import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase configuration:");
  console.error("- VITE_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "❌ Missing");
  console.error(
    "- SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "✓ Set" : "❌ Missing",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log("🧪 Testing Supabase connection...\n");

  try {
    // Test 1: Basic connection
    console.log("1. Testing basic connection...");
    const { data: healthCheck, error: healthError } = await supabase
      .from("user_subscriptions")
      .select("count", { count: "exact", head: true });

    if (healthError) {
      console.error("❌ Connection failed:", healthError.message);
      return;
    }
    console.log("✅ Basic connection successful");

    // Test 2: Check if tables exist
    console.log("\n2. Checking required tables...");
    const tables = [
      "user_subscriptions",
      "daily_usage",
      "payments",
      "scenario_packs",
      "user_pack_purchases",
      "user_progress",
      "user_scenarios",
    ];

    for (const table of tables) {
      try {
        const { error } = await supabase.from(table).select("*").limit(1);
        if (error) {
          console.error(`❌ Table '${table}' error:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and accessible`);
        }
      } catch (err) {
        console.error(`❌ Table '${table}' check failed:`, err);
      }
    }

    // Test 3: Check RLS policies
    console.log("\n3. Testing Row Level Security...");
    try {
      // This should fail if RLS is properly configured
      const { error: rlsError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .limit(1);

      if (rlsError && rlsError.message.includes("policy")) {
        console.log(
          "✅ RLS is properly configured (access denied without proper auth)",
        );
      } else {
        console.log(
          "⚠️  RLS might not be configured - this is a security risk",
        );
      }
    } catch (err) {
      console.log("✅ RLS appears to be working (access properly restricted)");
    }

    // Test 4: PayPal configuration
    console.log("\n4. Checking PayPal configuration...");
    const paypalClientId =
      process.env.VITE_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET;

    console.log(
      "- PayPal Client ID:",
      paypalClientId ? "✅ Set" : "❌ Missing",
    );
    console.log("- PayPal Secret:", paypalSecret ? "✅ Set" : "❌ Missing");
    console.log(
      "- PayPal Environment:",
      process.env.VITE_PAYPAL_ENVIRONMENT ||
        process.env.PAYPAL_ENVIRONMENT ||
        "sandbox",
    );

    console.log("\n🎉 Connection test completed!");
  } catch (error) {
    console.error("❌ Unexpected error during testing:", error);
  }
}

testConnection();
