-- Fix orphaned user issue
-- The user exists in profiles but not in auth.users, causing 406 errors

-- Option 1: Create the missing auth.users record
-- Note: This requires the user's email and password to be known
-- If you don't have this information, use Option 2 instead

-- Option 2: Clean up orphaned data (RECOMMENDED)
-- This removes the orphaned profile and related data

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

-- Clean up orphaned data (run this if you want to remove the orphaned user)
-- WARNING: This will permanently delete the user's data

-- DELETE FROM daily_usage WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
-- DELETE FROM user_subscriptions WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
-- DELETE FROM profiles WHERE id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';

-- Alternative: Update the user ID to a valid one if you know the correct user ID
-- UPDATE daily_usage SET user_id = 'correct-user-id' WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
-- UPDATE user_subscriptions SET user_id = 'correct-user-id' WHERE user_id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8';
-- UPDATE profiles SET id = 'correct-user-id' WHERE id = '6c014ec8-2f79-4809-8c35-4cae1966e0f8'; 