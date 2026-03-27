# Quick Fix for Netlify Authentication Issues

## TL;DR - Do These 3 Things:

### 1. Add to Google Cloud Console
Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth Client ID and add:
```
https://silly-longma-69e139.netlify.app/api/auth/callback/google
https://silly-longma-69e139.netlify.app
```

### 2. Check Netlify Environment Variables
Go to: https://app.netlify.com/ → Your Site → Site settings → Environment variables

Make sure `NEXTAUTH_URL` is:
```
NEXTAUTH_URL=https://silly-longma-69e139.netlify.app
```

NOT:
```
NEXTAUTH_URL=http://localhost:3000  ← WRONG!
```

### 3. Redeploy
Go to: Deploys tab → Trigger deploy → Clear cache and deploy site

---

## Why This Fixes Your Issues:

### Issue 1: 500 Error on /api/auth/session
**Cause:** Missing/incorrect `NEXTAUTH_URL` on Netlify
**Fix:** Set `NEXTAUTH_URL=https://silly-longma-69e139.netlify.app` in Netlify environment variables

### Issue 2: 404 on Google Sign-In
**Cause:** Google doesn't have your Netlify URL in authorized redirect URIs
**Fix:** Add `https://silly-longma-69e139.netlify.app/api/auth/callback/google` in Google Cloud Console

### Issue 3: Prisma Connection Timeout (already fixed in code)
**Fix:** Updated `lib/db/prisma.ts` with proper connection pooling

---

## After Deployment Test:

1. Visit: https://silly-longma-69e139.netlify.app/api/auth/session
   - Should return `{}` not 500

2. Try Google sign-in on your site
   - Should redirect to Google and back successfully

---

## Full Details:
See `docs/DEPLOYMENT_CHECKLIST.md` for complete step-by-step instructions.
