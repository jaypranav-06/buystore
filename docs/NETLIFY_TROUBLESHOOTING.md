# Netlify Authentication 500 Error - Troubleshooting Guide

## The Problem
You're getting a 500 error on `/api/auth/session` which means NextAuth is failing to initialize.

## Root Cause
Missing or incorrect environment variables on Netlify.

## Solution - Step by Step

### Step 1: Verify ALL Environment Variables

Go to Netlify Dashboard → Your Site → Site settings → Environment variables

You MUST have these 8 variables (copy/paste exactly):

| Key | Value | Status |
|-----|-------|--------|
| `DATABASE_URL` | `postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | ☐ |
| `DIRECT_URL` | `postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres` | ☐ |
| `NEXTAUTH_URL` | `https://silly-longma-69e139.netlify.app` | ☐ |
| `NEXTAUTH_SECRET` | `feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=` | ☐ |
| `GOOGLE_CLIENT_ID` | `your-google-client-id.apps.googleusercontent.com` | ☐ |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret` | ☐ |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cztqhcuoebdlwkhmjliv.supabase.co` | ☐ |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | `sb_publishable_afZOgHNh-NHAcwEVw-KX-w_ZLrhHfRm` | ☐ |

### Step 2: Common Mistakes to Avoid

❌ **WRONG**: Adding spaces in the value
```
NEXTAUTH_SECRET = feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=
```

✅ **CORRECT**: No spaces, exact value
```
NEXTAUTH_SECRET=feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=
```

❌ **WRONG**: Typo in variable name
```
NEXTAUTH_SECERT (missing 'T')
```

✅ **CORRECT**: Exact spelling
```
NEXTAUTH_SECRET
```

❌ **WRONG**: Missing the `%40` encoding in DATABASE_URL
```
...EasyBuyStore@...
```

✅ **CORRECT**: Use `%40` for `@` symbol
```
...EasyBuyStore%40...
```

### Step 3: How to Add Variables in Netlify

1. Click **"Add a variable"** button
2. In **Key** field, type: `NEXTAUTH_SECRET` (exact spelling, no spaces)
3. In **Value** field, paste: `feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=`
4. Under **"Scopes"**, select **"Same value for all deploy contexts"**
5. Click **"Create variable"**
6. Repeat for ALL 8 variables above

### Step 4: Redeploy After Adding Variables

**IMPORTANT**: Environment variables only take effect after redeployment!

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**
4. Wait for deployment to complete (usually 2-3 minutes)

### Step 5: Check Deploy Logs for Errors

While deploying:
1. Click on the active deploy (the one that's in progress)
2. Watch the logs for any errors
3. Look for messages like:
   - ✅ "Build succeeded"
   - ❌ "Error: Missing environment variable"
   - ❌ "Prisma Client initialization failed"

### Step 6: Check Function Logs

After deployment:
1. Go to **Functions** tab in Netlify
2. Click on any function (like `___netlify-handler`)
3. Look at the logs to see the actual error message
4. Common errors:
   - "NEXTAUTH_SECRET is not set"
   - "Cannot connect to database"
   - "Prisma Client not initialized"

### Step 7: Test Authentication

After successful deployment, try these in order:

1. **Test Session Endpoint**
   - Visit: `https://silly-longma-69e139.netlify.app/api/auth/session`
   - Should see: `{}` or `{"user":null}` (NOT a 500 error)

2. **Test Admin Login**
   - Go to: `https://silly-longma-69e139.netlify.app/admin/login`
   - Username: `admin@easybuy.com`
   - Password: `admin123`

3. **Test Google Login**
   - Go to home page
   - Click "Sign in with Google"
   - Should redirect to Google login

## Still Getting 500 Error?

### Check These Specific Issues:

#### Issue 1: Prisma Client Not Generated
Netlify might not be generating Prisma Client during build.

**Fix**: Add this to `package.json` (already done, but verify):
```json
"scripts": {
  "build": "prisma generate && next build"
}
```

#### Issue 2: Database Connection Failed
Your Supabase database might be unreachable.

**Test**: Try accessing your database from Supabase dashboard to ensure it's running.

#### Issue 3: NEXTAUTH_SECRET is Invalid
The secret might have special characters causing issues.

**Generate New Secret** (optional):
```bash
openssl rand -base64 32
```
Then update both `.env` (local) and Netlify environment variables.

## Quick Verification Checklist

Before redeploying, verify:
- [ ] All 8 environment variables are added in Netlify
- [ ] No typos in variable names
- [ ] No extra spaces in values
- [ ] `%40` is used instead of `@` in DATABASE_URL
- [ ] NEXTAUTH_URL matches your Netlify domain exactly
- [ ] You clicked "Clear cache and deploy site" after adding variables

## Screenshot Guide

If you're still stuck, take screenshots of:
1. Your Netlify Environment Variables page (blur sensitive values)
2. Your deploy logs showing the error
3. Your function logs showing the 500 error details

This will help identify exactly what's wrong.

## Expected Behavior After Fix

✅ `/api/auth/session` returns `{}` (not 500)
✅ Admin login works
✅ User registration works
✅ Google sign-in redirects to Google
✅ No errors in Netlify function logs
