# 🚀 Quick Setup Commands

## Your Environment Variables Are Ready!

I can see you've already added your credentials to `.env`. Now you just need to copy them to Fly.dev.

## Copy & Paste These Commands:

```bash
# Set Supabase credentials in Fly.dev
fly secrets set VITE_SUPABASE_URL="https://lxzwakeusanxquhshcph.supabase.co"
fly secrets set VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzAxNTIsImV4cCI6MjA2ODgwNjE1Mn0.WzlkTGbselENSvmDG0oD7xEM1s6ZnJtY1TgBiGHuXVE"
fly secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4endha2V1c2FueHF1aHNoY3BoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzIzMDE1MiwiZXhwIjoyMDY4ODA2MTUyfQ.xbwLkC0Lj0EdQHahT9WN1eWUCPJBXl-P5JU9OFswU98"

# Set PayPal credentials
fly secrets set VITE_PAYPAL_CLIENT_ID="AaZabZwUPYitlE5MOXwohkXxtMzI7GaSArFxw7JYMIDfZE_PHvsMzY1WEsZk_QwTdek4SEpjj_DC5ys7"
fly secrets set PAYPAL_CLIENT_SECRET="ENYtUkHlmyemozYLPOsU_R8eTqyqd_QrHVO7Gpljt0f3k_7fB7kXJovKqPZa76wKibycz1XzW5WP48Y4"
fly secrets set VITE_PAYPAL_ENVIRONMENT="production"

# Set environment
fly secrets set NODE_ENV="production"

# Deploy with new secrets
fly deploy
```

## What This Will Do:

1. **✅ Remove "Demo Mode Active" banner**
2. **✅ Enable user authentication & registration**  
3. **✅ Enable progress saving to database**
4. **✅ Enable subscription system**
5. **✅ Enable PayPal payment processing**

## After Running Commands:

1. Wait for deployment to complete (~2-3 minutes)
2. Refresh your app page
3. The demo mode banner should disappear
4. Test sign up/login functionality
5. Check that progress gets saved

## If You Don't Have Fly CLI:

### Option 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Option 2: Use Web Dashboard
1. Go to [fly.io/apps](https://fly.io/apps)
2. Click your app → "Secrets" tab  
3. Add each variable manually
4. Click "Deploy" when done

## Verification:

After deployment, your app should show:
- ✅ No demo mode banner
- ✅ Working sign up/login
- ✅ Subscription pricing page functional
- ✅ Progress saving to database

## Need Help?

Check `FLY_SETUP.md` for detailed instructions or create an issue.
