# Netlify Deployment Checklist

## Pre-Deployment Checks

### Local Environment Working?
- [ ] `npm run dev` runs without errors
- [ ] Google sign-in works on localhost
- [ ] Admin login works on localhost
- [ ] Database connections working
- [ ] No Prisma connection pool errors

---

## Step 1: Google Cloud Console Setup

### Navigate to Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Select your project (or find the project with Client ID: 701562144592-...)
3. Go to: **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID

### Add Authorized Redirect URIs
Click **"ADD URI"** under "Authorized redirect URIs" and add:

```
https://silly-longma-69e139.netlify.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**Checklist:**
- [ ] Added Netlify redirect URI
- [ ] Kept localhost redirect URI for development
- [ ] No typos in the URL
- [ ] Includes `/api/auth/callback/google` path

### Add Authorized JavaScript Origins
Click **"ADD URI"** under "Authorized JavaScript origins" and add:

```
https://silly-longma-69e139.netlify.app
http://localhost:3000
```

**Checklist:**
- [ ] Added Netlify origin
- [ ] Kept localhost origin for development
- [ ] No trailing slash
- [ ] No typos

### Save Changes
- [ ] Clicked **"SAVE"** button
- [ ] Confirmation message appeared
- [ ] No error messages

---

## Step 2: Netlify Environment Variables

### Navigate to Netlify Dashboard
1. Go to: https://app.netlify.com/
2. Select your site: **silly-longma-69e139**
3. Go to: **Site settings** → **Environment variables**

### Add/Verify ALL Variables

Copy these EXACTLY (no spaces, no typos):

#### 1. DATABASE_URL
```
DATABASE_URL=postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&pool_timeout=20
```
- [ ] Variable added
- [ ] Uses `%40` for @ symbol
- [ ] Has `pgbouncer=true` parameter
- [ ] Scope: "Same value for all deploy contexts"

#### 2. DIRECT_URL
```
DIRECT_URL=postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```
- [ ] Variable added
- [ ] Uses port 5432
- [ ] Uses `%40` for @ symbol
- [ ] Scope: "Same value for all deploy contexts"

#### 3. NEXTAUTH_URL
```
NEXTAUTH_URL=https://silly-longma-69e139.netlify.app
```
- [ ] Variable added
- [ ] **NOT** set to localhost
- [ ] Matches your exact Netlify URL
- [ ] No trailing slash
- [ ] Scope: "Same value for all deploy contexts"

#### 4. NEXTAUTH_SECRET
```
NEXTAUTH_SECRET=feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=
```
- [ ] Variable added
- [ ] Exact value (no spaces)
- [ ] Includes the `=` at the end
- [ ] Scope: "Same value for all deploy contexts"

#### 5. GOOGLE_CLIENT_ID
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```
- [ ] Variable added
- [ ] Complete value (ends with .apps.googleusercontent.com)
- [ ] Scope: "Same value for all deploy contexts"
- [ ] Get from your .env file

#### 6. GOOGLE_CLIENT_SECRET
```
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
- [ ] Variable added
- [ ] Starts with GOCSPX-
- [ ] Scope: "Same value for all deploy contexts"

#### 7. NEXT_PUBLIC_SUPABASE_URL
```
NEXT_PUBLIC_SUPABASE_URL=https://cztqhcuoebdlwkhmjliv.supabase.co
```
- [ ] Variable added
- [ ] Scope: "Same value for all deploy contexts"

#### 8. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
```
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_afZOgHNh-NHAcwEVw-KX-w_ZLrhHfRm
```
- [ ] Variable added
- [ ] Starts with sb_publishable_
- [ ] Scope: "Same value for all deploy contexts"

### Final Check
- [ ] All 8 variables added
- [ ] No typos in variable names
- [ ] No extra spaces in values
- [ ] All scopes set to "Same value for all deploy contexts"

---

## Step 3: Deploy to Netlify

### Option A: Push to Git (Automatic Deploy)
```bash
git add .
git commit -m "Fix authentication and Prisma connection pooling"
git push origin main
```
- [ ] Code pushed to GitHub
- [ ] Netlify auto-deploy triggered
- [ ] Build started

### Option B: Manual Deploy (Recommended for Testing)
1. Go to **Deploys** tab in Netlify
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**
4. Wait for deployment

**Checklist:**
- [ ] Deploy triggered
- [ ] Build running
- [ ] No build errors
- [ ] Deploy succeeded (green checkmark)
- [ ] Site is published

### Monitor Build Logs
While deploying, watch for:
- [ ] ✅ "Installing dependencies"
- [ ] ✅ "Prisma Client generated"
- [ ] ✅ "Build succeeded"
- [ ] ❌ No errors about missing environment variables
- [ ] ❌ No database connection errors

---

## Step 4: Post-Deployment Testing

### Test 1: Health Check
Visit: https://silly-longma-69e139.netlify.app

**Expected Result:**
- [ ] Site loads successfully
- [ ] No 500 errors
- [ ] Products display correctly
- [ ] Navigation works

### Test 2: Session Endpoint
Visit: https://silly-longma-69e139.netlify.app/api/auth/session

**Expected Result:**
- [ ] Returns `{}` or `{"user":null}`
- [ ] **NOT** a 500 error
- [ ] No "Internal Server Error" message

### Test 3: Google Sign-In (Main Test)
1. Go to: https://silly-longma-69e139.netlify.app
2. Click **"Sign In"** or **"Sign in with Google"** button
3. Should redirect to Google login page

**Expected Flow:**
- [ ] Redirects to Google OAuth page
- [ ] Shows your Google accounts
- [ ] Click on your account
- [ ] Redirects back to your Netlify site
- [ ] You are now logged in
- [ ] User name appears in header
- [ ] **NOT** a 404 error
- [ ] **NOT** staying on sign-in page

### Test 4: User Registration
1. Go to: https://silly-longma-69e139.netlify.app/signup
2. Fill in registration form
3. Submit

**Expected Result:**
- [ ] Registration succeeds
- [ ] Redirects to home or account page
- [ ] User is logged in

### Test 5: Admin Login
1. Go to: https://silly-longma-69e139.netlify.app/admin/login
2. Email: `admin@easybuy.com`
3. Password: `admin123`
4. Submit

**Expected Result:**
- [ ] Login succeeds
- [ ] Redirects to admin dashboard
- [ ] Can see admin features

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Cause:** Google OAuth redirect URI not configured correctly

**Fix:**
1. Go back to Google Cloud Console
2. Verify the redirect URI is EXACTLY: `https://silly-longma-69e139.netlify.app/api/auth/callback/google`
3. No typos, includes `/api/auth/callback/google`
4. Click SAVE and wait 5 minutes for changes to propagate

### Error: 500 on /api/auth/session
**Cause:** Missing environment variables

**Fix:**
1. Check ALL 8 environment variables in Netlify
2. Look for typos in variable names
3. Verify no extra spaces in values
4. Redeploy: "Clear cache and deploy site"

### Error: Google redirects to localhost
**Cause:** NEXTAUTH_URL is set to localhost

**Fix:**
1. In Netlify environment variables
2. Find NEXTAUTH_URL
3. Change to: `https://silly-longma-69e139.netlify.app`
4. Redeploy

### Error: Prisma connection timeout
**Cause:** Too many database connections

**Fix:**
1. Already fixed in code with connection pooling
2. If still happening, check Supabase dashboard
3. Verify database is running
4. Check connection limits

### Still Not Working?
Check Netlify Function Logs:
1. Go to **Functions** tab
2. Click on any function
3. View logs for actual error messages
4. Look for clues about what's failing

---

## Success Checklist

After all steps completed:
- [ ] ✅ Site loads on Netlify
- [ ] ✅ No 500 errors on /api/auth/session
- [ ] ✅ Google sign-in works
- [ ] ✅ User registration works
- [ ] ✅ Admin login works
- [ ] ✅ Products load correctly
- [ ] ✅ Cart functionality works
- [ ] ✅ No errors in browser console
- [ ] ✅ No errors in Netlify function logs

---

## Notes

- **Environment variables only take effect after redeployment**
- Always use "Clear cache and deploy site" for environment variable changes
- Google OAuth changes can take up to 5 minutes to propagate
- Keep localhost URIs for development
- Never commit .env file to Git

---

## Quick Reference

### Your URLs
- **Netlify Site:** https://silly-longma-69e139.netlify.app
- **Netlify Dashboard:** https://app.netlify.com/
- **Google Cloud Console:** https://console.cloud.google.com/

### Your Credentials
- **Google Client ID:** Get from your .env file
- **Supabase URL:** Get from your .env file
- **Database:** PostgreSQL on Supabase

### Admin Credentials (from docs/ADMIN_CREDENTIALS.md)
- **Email:** admin@easybuy.com
- **Password:** admin123
