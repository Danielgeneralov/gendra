# Login Audit Logging Implementation

This document explains the login audit logging implementation for the Gendra platform.

## Purpose

The login audit logging system records every successful login attempt to the `logins` table in Supabase for:

- Security audit trails
- User activity tracking
- Analytics (e.g., daily active users, peak usage times)
- Admin monitoring

## Database Schema

The `logins` table has the following structure:

```sql
CREATE TABLE IF NOT EXISTS public.logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email TEXT,
  timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
  ip_address TEXT, -- Optional: for future use
  user_agent TEXT  -- Optional: for future use
);
```

## Row Level Security (RLS)

The following RLS policies secure the logins table:

1. Users can only insert their own login records
2. Users can only read their own login records
3. (Optional/commented) Admin access to all records

## Implementation Details

The login logging occurs in the `SignInForm.tsx` component after a successful login via Supabase's `signInWithPassword()` method:

1. A new `loginLogged` ref tracks whether the current login has been logged
2. The `logLoginAttempt` function inserts a record into the `logins` table with:
   - User ID 
   - Email address
   - Timestamp (automatically added by default value)
3. The function is called after successful authentication but before redirect
4. Error handling ensures login process isn't blocked if logging fails

## Preventing Duplicate Entries

To prevent duplicate entries in case of page refreshes or navigation:

1. The `loginLogged` ref is used to track if the login has been logged
2. The ref is reset to `false` at the start of each sign-in attempt
3. It's set to `true` after successful logging

## Future Enhancements

Possible future enhancements include:

1. Capturing IP address information (requires server-side middleware)
2. Recording browser/device information via user agent
3. Creating admin dashboards to visualize login patterns
4. Adding failed login attempt logging (with rate limiting to prevent DB floods)

## Testing

To test the login logging:

1. Create a test user
2. Sign in with the test user credentials
3. Check the `logins` table for the new entry
4. Try refreshing the page to ensure duplicate entries aren't created
5. Test with session restoration to verify logging only happens on explicit sign-ins 