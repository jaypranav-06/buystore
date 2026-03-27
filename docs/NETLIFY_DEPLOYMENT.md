# Netlify Deployment Guide - Google OAuth Fix

## Problem
Google sign-in doesn't work on Netlify because:
1. NEXTAUTH_URL is set to localhost
2. Google OAuth redirect URIs don't include your Netlify domain

## Solution

### Step 1: Configure Netlify Environment Variables

Go to your Netlify site dashboard:
1. Navigate to **Site settings** → **Environment variables**
2. Add/Update the following variables:

#### Required Environment Variables:

```bash
# Database (same as local)
DATABASE_URL=postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.cztqhcuoebdlwkhmjliv:EasyBuyStore%40@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://cztqhcuoebdlwkhmjliv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_afZOgHNh-NHAcwEVw-KX-w_ZLrhHfRm

# NextAuth - UPDATE THIS WITH YOUR NETLIFY URL
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=feesMMBCs205lj4bByWFw4oEUpzV7DDnC7odEX0KPjo=

# Google OAuth (get from your .env file)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# PayPal (if you use it)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox
```

**IMPORTANT**: Replace `https://your-site-name.netlify.app` with your actual Netlify site URL.

### Step 2: Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or the project associated with your OAuth credentials)
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID (the one with ID: 701562144592-...)

#### Add Authorized Redirect URIs:

Click **ADD URI** and add these two URIs:

```
https://your-site-name.netlify.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**Replace** `your-site-name.netlify.app` with your actual Netlify domain.

The localhost URI is for development, the Netlify URI is for production.

#### Add Authorized JavaScript Origins:

Click **ADD URI** under "Authorized JavaScript origins" and add:

```
https://your-site-name.netlify.app
http://localhost:3000
```

5. Click **SAVE**

### Step 3: Find Your Netlify URL

If you don't know your Netlify URL:
1. Go to your Netlify dashboard
2. Click on your site
3. Look at the top - you'll see something like: `https://random-name-123456.netlify.app`
4. You can also set a custom domain or rename it to something like `easybuystore.netlify.app`

### Step 4: Redeploy Your Site

After updating environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for the deployment to complete

### Step 5: Test Google Sign-In

1. Visit your Netlify site
2. Try signing in with Google
3. It should now work!

## Troubleshooting

### Error: "redirect_uri_mismatch"
This means the redirect URI in Google Console doesn't match your Netlify URL.
- Check that you added the EXACT Netlify URL with `/api/auth/callback/google`
- Make sure there are no typos
- Ensure you clicked SAVE in Google Console

### Error: "NEXTAUTH_URL is not set"
- Go to Netlify dashboard → Site settings → Environment variables
- Make sure NEXTAUTH_URL is set to your production URL
- Redeploy the site

### Google sign-in redirects to localhost
- You forgot to update NEXTAUTH_URL in Netlify environment variables
- Update it and redeploy

### Environment variables not updating
- After changing environment variables, you MUST trigger a new deploy
- Click "Clear cache and deploy site" to ensure changes take effect

## Custom Domain (Optional)

If you want to use a custom domain like `easybuystore.com`:

1. In Netlify: **Domain settings** → **Add custom domain**
2. Update NEXTAUTH_URL to your custom domain: `https://easybuystore.com`
3. Update Google OAuth redirect URIs to: `https://easybuystore.com/api/auth/callback/google`
4. Redeploy

## Security Note

Never commit environment variables to Git. The `.env` file is in `.gitignore` to prevent this.
For production, always set environment variables in your hosting platform (Netlify, Vercel, etc.).
