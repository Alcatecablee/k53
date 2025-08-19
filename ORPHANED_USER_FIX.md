# Orphaned User Fix

## 🔍 Root Cause Identified

The 406 errors are caused by an **orphaned user** - a user that exists in the `profiles` table but **does NOT exist** in the `auth.users` table.

### User Details
- **User ID**: `6c014ec8-2f79-4809-8c35-4cae1966e0f8`
- **Email**: `alcatecable@gmail.com`
- **Status**: Profile exists, but no auth.users record

## Why This Causes 406 Errors

1. **RLS Policies**: Require `auth.uid()` to match `user_id`
2. **Invalid Session**: User's session references a non-existent auth.users record
3. **Policy Violation**: RLS policies reject the request because `auth.uid()` returns null/invalid

## Solutions

### Option 1: Clean Up Orphaned Data (RECOMMENDED)

Run this SQL in your Supabase SQL Editor to remove the orphaned user data:

```sql
-- Check what data exists for the orphaned user
SELECT 
    'profiles' as table_name,
    COUNT(*) as record_count
FROM profiles 
WHERE id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8'

UNION ALL

SELECT 
    'daily_usage' as table_name,
    COUNT(*) as record_count
FROM daily_usage 
WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8'

UNION ALL

SELECT 
    'user_subscriptions' as table_name,
    COUNT(*) as record_count
FROM user_subscriptions 
WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';

-- If you want to clean up the orphaned data, uncomment these lines:
-- DELETE FROM daily_usage WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
-- DELETE FROM user_subscriptions WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
-- DELETE FROM profiles WHERE id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
```

### Option 2: Recreate the User Account

If this is a real user who needs their data preserved:

1. **Sign out** the current user
2. **Sign up again** with the same email (`alcatecable@gmail.com`)
3. **Update the user ID** in the database to match the new auth.users record

### Option 3: Fix Authentication Session

The user should:
1. **Sign out** completely
2. **Clear browser cache** and localStorage
3. **Sign in again** with valid credentials

## Client-Side Improvements

I've updated the error handling to:
- **Detect 406 errors** specifically
- **Log session invalidity** warnings
- **Provide fallback behavior** to localStorage
- **Suggest re-authentication** when needed

## Verification Steps

### 1. Check Current Status
Run the debug script to see the current state:
```bash
node scripts/debug-user-authentication.js
```

### 2. Apply the Fix
Choose one of the options above based on your needs.

### 3. Test the Application
After applying the fix:
1. **Sign out** completely
2. **Sign in again** with valid credentials
3. **Check the console** - 406 errors should be gone
4. **Verify functionality** - daily usage and subscriptions should work

## Prevention

To prevent this issue in the future:

1. **Proper User Creation**: Ensure users are created in both `auth.users` and `profiles` tables
2. **Session Management**: Implement proper session refresh and validation
3. **Error Handling**: Continue using the improved error handling for graceful degradation

## Expected Results

After fixing the orphaned user:
- ✅ No more 406 errors
- ✅ Proper authentication flow
- ✅ Database operations work correctly
- ✅ Graceful fallback to localStorage when needed

## Files Modified

- `database/fix-orphaned-user.sql` - SQL script to clean up orphaned data
- `client/services/subscriptionService.ts` - Improved error handling for 406 errors
- `scripts/debug-user-authentication.js` - Debug script to identify orphaned users

The orphaned user is the root cause of your 406 errors. Once this is resolved, your application should work correctly. 