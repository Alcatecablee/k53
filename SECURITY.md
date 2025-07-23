# Security Configuration Guide

## ⚠️ CRITICAL: Environment Setup

### 1. Initial Setup

1. **Copy environment template:**

   ```bash
   cp .env.example .env
   ```

2. **Get your Supabase credentials:**

   - Go to [supabase.com](https://supabase.com) and sign in
   - Open your project dashboard
   - Go to Settings → API
   - Copy your Project URL and anon public key

3. **Update your .env file:**
   ```bash
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

### 2. Security Checklist

- [ ] ✅ Hardcoded credentials removed from source code
- [ ] ✅ .env file created and configured
- [ ] ✅ .env file added to .gitignore
- [ ] ⚠️ Service role key secured (only in .env, never in client code)
- [ ] ⚠️ Row Level Security (RLS) enabled on Supabase tables
- [ ] ⚠��� API rate limiting configured
- [ ] ⚠️ Production environment variables set up

### 3. Supabase Security Configuration

#### Enable Row Level Security (RLS)

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scenarios ENABLE ROW LEVEL SECURITY;

-- Users can only see their own progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own scenario attempts
CREATE POLICY "Users can view own scenarios" ON public.user_scenarios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scenarios" ON public.user_scenarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### API Limits and Security Headers

1. **In Supabase Dashboard:**

   - Go to Settings → API
   - Enable "API Gateway"
   - Set rate limits for your API endpoints
   - Configure CORS settings

2. **For Production:**
   - Use custom domain for Supabase
   - Enable database SSL
   - Configure backup policies

### 4. Development vs Production

#### Development (.env)

```bash
NODE_ENV=development
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Production (Platform Environment Variables)

```bash
NODE_ENV=production
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 5. Common Security Mistakes to Avoid

❌ **DON'T:**

- Commit .env files to git
- Use service role keys in client-side code
- Disable RLS on user data tables
- Use the same database for dev and production
- Store sensitive data without encryption

✅ **DO:**

- Use environment variables for all secrets
- Enable RLS on all user data tables
- Use separate databases for dev/staging/production
- Regularly rotate API keys
- Monitor API usage and errors

### 6. Testing Your Security Setup

Run this command to verify your environment:

```bash
npm run dev
```

If you see this error, your environment is not configured:

```
Missing required environment variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
```

### 7. Emergency Response

If credentials are accidentally committed:

1. **Immediately rotate all keys** in Supabase dashboard
2. Update .env with new keys
3. Verify no unauthorized access occurred
4. Review commit history and remove exposed credentials

## Next Steps

After completing security setup:

1. Set up database tables (Phase 2)
2. Implement payment integration (Phase 3)
3. Configure production deployment (Phase 4)
