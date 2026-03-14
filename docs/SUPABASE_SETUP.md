# Supabase Database Setup Guide

## Overview
This project uses Supabase as the database provider. Supabase offers a free PostgreSQL database with 500MB storage, perfect for development and small projects.

## Why Supabase?
- Free tier with 500MB database storage
- PostgreSQL database (reliable and feature-rich)
- Built-in authentication (optional)
- Real-time subscriptions
- Auto-generated REST APIs
- Dashboard for database management
- Connection pooling built-in

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

## Step 2: Create a New Project

1. After logging in, click **New Project**
2. Select your organization (or create one)
3. Fill in project details:
   - **Name**: `easybuystore` (or your preferred name)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your location
   - **Pricing Plan**: Free
4. Click **Create new project**
5. Wait 2-3 minutes for project initialization

## Step 3: Get Your Database Connection Strings

1. In your Supabase project dashboard, go to:
   **Settings** > **Database**

2. Scroll down to **Connection string** section

3. You'll need TWO connection strings:

### Connection Pooling URL (for DATABASE_URL)
- Select **Connection pooling**
- Mode: **Transaction**
- Copy the URI that looks like:
  ```
  postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```
- Add `?pgbouncer=true&connection_limit=1` at the end

### Direct Connection URL (for DIRECT_URL)
- Select **Connection string**
- Mode: **Session**
- Copy the URI that looks like:
  ```
  postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
  ```

**Important:** Replace `[YOUR-PASSWORD]` with your actual database password!

## Step 4: Configure Your .env File

Create a `.env` file in the root of your project:

```env
# Database Configuration - Supabase
DATABASE_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# PayPal Configuration (Optional)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
PAYPAL_MODE="sandbox"
```

**Generate NEXTAUTH_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 5: Push Database Schema to Supabase

Now that your Supabase database is configured, push your schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

You should see:
```
Your database is now in sync with your Prisma schema.
```

## Step 6: Verify Database in Supabase Dashboard

1. Go to your Supabase project
2. Click **Table Editor** in the left sidebar
3. You should see all your tables:
   - users
   - admin_users
   - categories
   - products
   - cart_items
   - payment_orders
   - order_items
   - promo_codes
   - reviews
   - contacts

## Step 7: Seed Your Database (Optional)

If you have seeding scripts:

```bash
npx tsx scripts/seed.ts
```

Or manually add data through:
- Supabase Table Editor
- Prisma Studio: `npx prisma studio`

## Troubleshooting

### Error: "Can't reach database server"
- Check your DATABASE_URL is correct
- Ensure password doesn't have special characters that need URL encoding
- Verify your Supabase project is active

### Error: "Invalid connection string"
- Make sure you're using the full connection string
- Check that `?pgbouncer=true&connection_limit=1` is added to DATABASE_URL
- Verify no extra spaces in the .env file

### Error: "SSL connection required"
- Supabase requires SSL by default (this is handled automatically)
- If issues persist, add `?sslmode=require` to connection string

### Connection Pooling Issues
- Make sure DATABASE_URL uses port **6543** (pooler)
- Make sure DIRECT_URL uses port **5432** (direct)

### Password with Special Characters
If your password contains special characters, URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `&` becomes `%26`
- `+` becomes `%2B`

Or regenerate a simpler password in Supabase:
**Settings** > **Database** > **Reset database password**

## Supabase Free Tier Limits

- **Database Size**: 500 MB
- **Bandwidth**: 5 GB
- **Projects**: 2 active projects
- **API Requests**: 50,000/month
- **Realtime Connections**: 200 concurrent

For this e-commerce project, these limits are more than sufficient for development and small production use.

## Managing Your Database

### Prisma Studio (Recommended)
```bash
npx prisma studio
```
Access at: http://localhost:5555

### Supabase Dashboard
1. Go to your project
2. Click **Table Editor**
3. View, edit, add, delete rows directly

### SQL Editor
1. Go to **SQL Editor** in Supabase
2. Run custom SQL queries
3. Save frequently used queries

## Backup Your Data

### Export via Supabase
1. Go to **Database** > **Backups** (Pro plan required for automated backups)

### Export via Script
Use the provided export script:
```bash
npx tsx scripts/export-database.ts
```

This creates JSON exports in `database_exports/` folder.

## Upgrading to Pro

If you need more resources:
- **Database Size**: Up to 100 GB
- **Bandwidth**: 250 GB
- **Point-in-time recovery**
- **Automated daily backups**

Visit: [https://supabase.com/pricing](https://supabase.com/pricing)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

## Support

- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Supabase Discord](https://discord.supabase.com)
- [Prisma Discord](https://pris.ly/discord)
