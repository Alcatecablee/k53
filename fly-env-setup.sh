#!/bin/bash

echo "Setting up Fly.dev environment variables..."

# Set Supabase credentials
fly secrets set VITE_SUPABASE_URL="https://lxzwakeusanxquhshcph.supabase.co"
fly secrets set VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE"
fly secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98"

# Set PayPal credentials
fly secrets set VITE_PAYPAL_CLIENT_ID="AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7"
fly secrets set PAYPAL_CLIENT_ID="AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7"
fly secrets set PAYPAL_CLIENT_SECRET="ENYtUkHlmyemozYLPOsU_R8eTqyqd_QrHVO7Gpljt0f3k_7fB7kXJovKqPZa76wKibycz1XzW5WP48Y4"
fly secrets set VITE_PAYPAL_ENVIRONMENT="production"
fly secrets set PAYPAL_ENVIRONMENT="production"

# Set production environment
fly secrets set NODE_ENV="production"

echo "Environment variables set! Deploying..."
fly deploy

echo "✅ Setup complete!"
echo "Your app should now be in production mode with:"
echo "- No demo mode banner"
echo "- Working authentication"
echo "- Payment processing enabled"
