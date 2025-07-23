# Fly.dev Environment Setup Guide

## Problem: .env Files Don't Work in Production

Your `.env` file works great for local development, but **Fly.dev doesn't use .env files**. You need to set environment variables directly in your Fly.dev app.

## Solution: Set Environment Variables in Fly.dev

### Method 1: Using Fly CLI (Recommended)

If you have the Fly CLI installed, run these commands:

```bash
# Set Supabase credentials
fly secrets set VITE_SUPABASE_URL="https://lxzwakeusanxquhshcph.supabase.co"
fly secrets set VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE"
fly secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98"

# Set PayPal credentials (for payment integration)
fly secrets set PAYPAL_CLIENT_ID="AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7"
fly secrets set PAYPAL_CLIENT_SECRET="ENYtUkHlmyemozYLPOsU_R8eTqyqd_QrHVO7Gpljt0f3k_7fB7kXJovKqPZa76wKibycz1XzW5WP48Y4"
fly secrets set PAYPAL_ENVIRONMENT="production"

# Set Node environment
fly secrets set NODE_ENV="production"

# Deploy with new environment variables
fly deploy
```

### Method 2: Using Fly.dev Web Dashboard

1. Go to [fly.io/apps](https://fly.io/apps)
2. Click on your app
3. Go to "Secrets" tab
4. Add these environment variables:

```
VITE_SUPABASE_URL = https://lxzwakeusanxquhshcph.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98
PAYPAL_CLIENT_ID = AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7
PAYPAL_CLIENT_SECRET = ENYtUkHlmyemozYLPOsU_R8eTqyqd_QrHVO7Gpljt0f3k_7fB7kXJovKqPZa76wKibycz1XzW5WP48Y4
PAYPAL_ENVIRONMENT = production
NODE_ENV = production
```

5. Click "Save" and then redeploy your app

### Method 3: Using fly.toml (Not Recommended for Secrets)

You can add non-sensitive environment variables to `fly.toml`:

```toml
[env]
  NODE_ENV = "production"
  PAYPAL_ENVIRONMENT = "production"

# Don't put secrets here - use fly secrets instead
```

## After Setting Environment Variables

1. **Redeploy your app** (this is crucial!)
2. **Check the app** - the demo mode indicator should disappear
3. **Test authentication** - sign up/login should work
4. **Test Supabase connection** - progress saving should work

## Verification

After setting up environment variables, your app should:

- ✅ **No longer show "Demo Mode Active"**
- ✅ **Enable user authentication**
- ✅ **Save progress to database**
- ✅ **Show subscription features**
- ✅ **Connect to Supabase successfully**

## Troubleshooting

### If Demo Mode Still Shows:

1. Verify environment variables are set in Fly.dev (not just .env)
2. Make sure you redeployed after setting variables
3. Check browser console for environment debug info

### If Authentication Doesn't Work:

1. Verify Supabase URL and keys are correct
2. Check Supabase dashboard for connection attempts
3. Ensure Row Level Security (RLS) is configured properly

### If You Don't Have Fly CLI:

- Install it: `curl -L https://fly.io/install.sh | sh`
- Or use the web dashboard method above

## Security Note

- ✅ **Your .env file is perfect for local development**
- ✅ **Keep .env in .gitignore** (already done)
- ✅ **Use Fly secrets for production** (what we're setting up)
- ✅ **Never commit secrets to git**

This separation keeps your secrets secure while allowing the app to work in both environments.
