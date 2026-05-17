# 🤖 Full Automation - One Command Deploy

Everything is automated! Just run ONE command.

---

## 🚀 Quick Start

```bash
./deploy-everything.sh
```

That's it! The script will:
1. ✅ Open Supabase in your browser
2. ✅ Automatically run SQL schema  
3. ✅ Migrate all doctors data
4. ✅ Migrate all gallery albums & photos
5. ✅ Upload all images to Supabase Storage
6. ✅ Update frontend code to use Supabase
7. ✅ Prepare for Netlify deployment

---

## What Happens During Automation

### Browser Automation (Playwright)
- Opens `https://supabase.com/dashboard/project/pvjudrlxwmjxvbzhkdks/sql/new`
- If you're not logged in, it pauses for you to login
- Once logged in, it:
  - Pastes the entire SQL schema
  - Clicks "Run"
  - Waits for completion

### Data Migration
- Reads `server/data/doctors.json`
- Reads `server/data/gallery.json`
- Uploads all images from `public/images/galeri/` to Supabase Storage
- Inserts all data into Supabase tables

### Code Updates
- Updates `src/pages/Jadwal.jsx` to use Supabase
- Updates `src/pages/Galeri.jsx` to use Supabase
- Creates deployment files

---

## Manual Alternative

If you prefer to run steps manually:

### Step 1: Run SQL Schema
```bash
# Open Supabase SQL Editor
# Copy contents of supabase-schema.sql
# Paste and click Run
```

### Step 2: Migrate Data
```bash
npm run migrate:supabase
```

### Step 3: Update Frontend
```bash
node automate-migration.js
```

---

## After Automation

### Test Locally
```bash
npm run dev:vite
```

Visit http://localhost:5173 and verify:
- ✅ Jadwal page shows doctors
- ✅ Galeri page shows albums
- ✅ Images load from Supabase

### Deploy to Netlify

**Option 1: Netlify UI**
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select `motherlight` repository
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://pvjudrlxwmjxvbzhkdks.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY2OTAsImV4cCI6MjA5NDYwMjY5MH0.4HoDg0iVmN3_gi9ikhYPfVLwLRVui_OI_G4X5Lr4ia4
   ```
6. Click "Deploy"

**Option 2: Netlify CLI** (faster)
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## Troubleshooting

### "Playwright not found"
```bash
npx playwright install
```

### "Browser didn't open"
```bash
# Run with debug mode
npm run automate:full -- --debug
```

### "SQL execution failed"
- Check if you're logged into Supabase
- Manually run `supabase-schema.sql` in SQL Editor
- Then run: `npm run migrate:supabase`

### "Images not uploading"
- Check Supabase Storage → gallery bucket exists
- Verify bucket is public
- Re-run: `npm run migrate:supabase`

---

## What Changed in Your Code

### Files Updated
- ✅ `src/pages/Jadwal.jsx` - Now uses `getDoctors()` from Supabase
- ✅ `src/pages/Galeri.jsx` - Now uses `getGallery()` from Supabase
- ✅ `public/_redirects` - Created for Netlify routing

### Files Created
- ✅ `src/lib/supabase.js` - Supabase client wrapper
- ✅ `.env` - Environment variables (git-ignored)
- ✅ `netlify.toml` - Netlify configuration

### Files You Can Delete (after verifying)
- ❌ `server/` directory (old Express server)
- ❌ `server/data/*.json` (data now in Supabase)

---

## Free Hosting Limits

### Supabase (Free Forever)
- 500 MB Database ✅
- 1 GB Storage ✅
- 5 GB Bandwidth/month ✅
- Your current usage: ~50MB database, ~200MB storage

### Netlify (Free Forever)
- 100 GB Bandwidth/month ✅
- 300 Build minutes/month ✅
- Auto-deploys from GitHub ✅

**You're well within limits!** 🎉

---

## 🎯 Summary

Before:
- ❌ Express server (need paid hosting)
- ❌ JSON files (no backup, can be lost)
- ❌ Local images (lost on server restart)

After:
- ✅ Netlify frontend (FREE, auto-deploys)
- ✅ Supabase database (FREE, auto-backups)
- ✅ Supabase Storage (FREE, durable images)

---

## Need Help?

The automation failed? Run manually:

1. **SQL Schema**: Copy `supabase-schema.sql` → Paste in Supabase SQL Editor → Run
2. **Migration**: `npm run migrate:supabase`
3. **Test**: `npm run dev:vite`
4. **Deploy**: Push to GitHub, connect to Netlify

**Still stuck?** Check the error messages - they're usually descriptive!
