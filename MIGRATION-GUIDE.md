# 🚀 Motherlight → Supabase Migration Guide

This guide will help you migrate from Express + JSON files to Supabase + Netlify (100% free hosting).

---

## 📋 Prerequisites

1. ✅ Node.js 18+ installed
2. ✅ Git repository pushed to GitHub
3. ✅ Accounts created:
   - [Supabase](https://supabase.com) (free tier)
   - [Netlify](https://netlify.com) (free tier)

---

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: Motherlight
   - **Database Password**: (save this securely)
   - **Region**: Southeast Asia (Singapore) - closest to Indonesia
4. Click **"Create new project"** (wait 2-3 minutes)

### 1.2 Run SQL Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the editor
5. Click **"Run"** (bottom right)
6. ✅ You should see "Success. No rows returned"

### 1.3 Get API Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`, keep this SECRET!)

---

## Step 2: Configure Environment Variables

### 2.1 Create `.env` File

```bash
cp .env.example .env
```

### 2.2 Fill in `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_KEY=eyJhbGc...your-service-role-key
```

⚠️ **IMPORTANT**: Never commit `.env` to Git! (already in `.gitignore`)

---

## Step 3: Run Migration Script

This will automatically:
- ✅ Upload all images to Supabase Storage
- ✅ Migrate doctors data to database
- ✅ Migrate gallery albums & photos to database
- ✅ Migrate operating hours to database

```bash
npm run migrate:supabase
```

You should see:
```
📋 Migrating doctors data...
  ✓ Inserted: dr. Bima Suryantara...
✅ Doctors migration complete! (10 doctors)

🖼️  Migrating gallery data...
  📁 Processing album: Baby Spa
    ✓ Uploaded thumbnail
    ✓ Uploaded photo 1/3
...
✅ Migration Complete!
```

---

## Step 4: Update Frontend Code

The migration created `src/lib/supabase.js` with all API functions. Now we need to update the pages to use it.

### 4.1 Update Jadwal Page

```bash
# I'll update this file for you
```

### 4.2 Update Galeri Page

```bash
# I'll update this file for you
```

### 4.3 Update Admin Panel

```bash
# I'll update this file for you
```

---

## Step 5: Test Locally

```bash
npm run dev:vite
```

Open [http://localhost:5173](http://localhost:5173) and verify:
- ✅ Jadwal page shows doctors
- ✅ Galeri page shows albums
- ✅ Images load correctly

---

## Step 6: Deploy to Netlify

### 6.1 Connect GitHub to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub**
4. Select your `motherlight` repository
5. Netlify will auto-detect settings from `netlify.toml`

### 6.2 Add Environment Variables

In Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGc...your-anon-key
   ```

### 6.3 Deploy

1. Click **"Deploy site"**
2. Wait 2-3 minutes
3. ✅ Your site is live! (e.g., `https://motherlight-xyz.netlify.app`)

### 6.4 Custom Domain (Optional)

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow instructions to configure DNS

---

## Step 7: Set Up Admin User

### 7.1 Create Admin Account in Supabase

1. Go to Supabase **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: admin@motherlight.id (or your email)
   - **Password**: (choose a strong password)
4. Click **"Create user"**

### 7.2 Test Admin Login

1. Go to `https://your-site.netlify.app/admin/login`
2. Login with the credentials you just created
3. ✅ You should be able to manage doctors and gallery

---

## Step 8: Cleanup (Optional)

Once everything works, you can remove the old Express server files:

```bash
# Remove server directory
rm -rf server/

# Remove old scripts
rm scripts/sync-gallery.js

# Update package.json to remove old scripts
```

---

## 🎉 Migration Complete!

Your site is now running on:
- ✅ **Frontend**: Netlify (free, auto-deploys on git push)
- ✅ **Database**: Supabase Postgres (free tier: 500MB)
- ✅ **Storage**: Supabase Storage (free tier: 1GB)
- ✅ **Auth**: Supabase Auth (free tier: 50,000 users)

### Free Tier Limits

**Supabase Free Tier:**
- Database: 500 MB
- Storage: 1 GB
- Bandwidth: 5 GB/month
- 50,000 monthly active users

**Netlify Free Tier:**
- Bandwidth: 100 GB/month
- Build minutes: 300/month
- Auto-deploys from GitHub

---

## 📝 Daily Workflow

### Making Changes

1. Edit code locally
2. Test: `npm run dev:vite`
3. Commit & push to GitHub
4. ✅ Netlify auto-deploys

### Managing Content

1. Go to `/admin/login`
2. Update doctors/gallery
3. Changes save to Supabase instantly

---

## 🆘 Troubleshooting

### "Migration failed: fetch failed"
- ✅ Check `.env` has correct Supabase credentials
- ✅ Make sure you ran `supabase-schema.sql` in SQL Editor

### "Images not loading"
- ✅ Check Supabase Storage → gallery bucket exists
- ✅ Verify bucket is set to **public**

### "Admin login not working"
- ✅ Make sure you created user in Supabase Auth
- ✅ Check environment variables in Netlify

---

## 🔄 Rolling Back (if needed)

If something goes wrong, you can still run the old Express server:

```bash
npm run dev  # Uses old Express + JSON files
```

---

## 📞 Need Help?

1. Check Supabase logs: **Logs** → **Postgres Logs**
2. Check Netlify logs: **Deploys** → (click latest deploy) → **Deploy log**
3. Check browser console: F12 → Console tab
