# ✅ Supabase Migration Files Created!

I've set up everything you need to migrate to Netlify + Supabase (100% free hosting).

---

## 📦 What Was Created

### 1. **Database Schema**
- `supabase-schema.sql` - Complete database structure
  - Tables: doctors, albums, photos, operating_hours
  - Row Level Security (RLS) policies
  - Storage buckets for images
  - Auto-update triggers

### 2. **Migration Script**
- `migrate-to-supabase.js` - Automated data migration
  - Uploads all images to Supabase Storage
  - Migrates JSON data to Postgres
  - Preserves all existing data

### 3. **Supabase Client**
- `src/lib/supabase.js` - Frontend API wrapper
  - All functions to replace Express endpoints
  - Ready to use in React components

### 4. **Configuration Files**
- `.env.example` - Environment variables template
- `netlify.toml` - Netlify deployment config
- `.gitignore` - Updated to protect `.env`

### 5. **Setup Tools**
- `setup-supabase.sh` - Interactive setup wizard
- `MIGRATION-GUIDE.md` - Step-by-step instructions
- Updated `package.json` with `migrate:supabase` script

---

## 🚀 Quick Start (3 Steps)

### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Name: **Motherlight**
4. Region: **Southeast Asia (Singapore)**
5. Wait 2-3 minutes for project to initialize

### Step 2: Run Setup

```bash
# Interactive setup wizard
./setup-supabase.sh
```

It will guide you through:
- Creating `.env` file
- Getting Supabase credentials
- Running the migration

**OR** manually:

```bash
# 1. Create .env from template
cp .env.example .env

# 2. Edit .env with your Supabase credentials
#    (Get from Supabase → Settings → API)

# 3. Run schema in Supabase SQL Editor
#    (Copy supabase-schema.sql contents)

# 4. Run migration
npm run migrate:supabase
```

### Step 3: Deploy to Netlify

1. Push to GitHub: `git push`
2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import from GitHub"
4. Select your repository
5. Add environment variables (from `.env`)
6. Deploy!

---

## 📊 What Gets Migrated

### ✅ Doctors Data
- All doctor profiles
- Specialties & categories
- Schedules (preserved as JSONB)
- Notes and bios

### ✅ Gallery
- All albums
- All photos
- Thumbnails
- Images uploaded to Supabase Storage

### ✅ Operating Hours
- Business hours
- Emergency hours

---

## 🔄 After Migration

### Update Pages to Use Supabase

The migration created `src/lib/supabase.js` with all API functions.
You'll need to update these files to use it instead of fetch():

**Priority 1** (Public pages):
- [ ] `src/pages/Jadwal.jsx` - Replace `fetch('/api/doctors')`
- [ ] `src/pages/Galeri.jsx` - Replace `fetch('/api/gallery')`

**Priority 2** (Admin pages):
- [ ] `src/admin/AdminDoctors.jsx`
- [ ] `src/admin/AdminGallery.jsx`

I can help update these files next!

---

## 💰 Free Tier Limits

### Supabase (Free Forever)
- ✅ 500 MB Database
- ✅ 1 GB File Storage
- ✅ 5 GB Bandwidth/month
- ✅ 50,000 Monthly Active Users
- ✅ Unlimited API Requests

### Netlify (Free Forever)
- ✅ 100 GB Bandwidth/month
- ✅ 300 Build Minutes/month
- ✅ Auto-deploys from GitHub
- ✅ Free SSL/HTTPS
- ✅ Global CDN

**For your use case:** These limits are MORE than enough. Most small-medium sites never hit them.

---

## 🆘 Troubleshooting

### "Connection failed"
→ Check `.env` has correct Supabase URL and keys

### "Table doesn't exist"
→ Run `supabase-schema.sql` in Supabase SQL Editor first

### "Upload failed"
→ Check Supabase Storage → gallery bucket is public

### "Migration script errors"
→ Check `server/data/` JSON files exist and are valid

---

## 📁 Project Structure After Migration

```
motherlight/
├── src/
│   ├── lib/
│   │   └── supabase.js          ← NEW: Supabase client
│   ├── pages/
│   │   ├── Jadwal.jsx           ← UPDATE: Use supabase.js
│   │   └── Galeri.jsx           ← UPDATE: Use supabase.js
│   └── admin/
│       ├── AdminDoctors.jsx     ← UPDATE: Use supabase.js
│       └── AdminGallery.jsx     ← UPDATE: Use supabase.js
├── server/                      ← CAN DELETE after migration
├── supabase-schema.sql          ← Run in Supabase SQL Editor
├── migrate-to-supabase.js       ← Migration script
├── setup-supabase.sh            ← Setup wizard
├── netlify.toml                 ← Netlify config
├── .env.example                 ← Template
├── .env                         ← YOUR CREDENTIALS (git-ignored)
└── MIGRATION-GUIDE.md           ← Full instructions
```

---

## ✨ Benefits of This Migration

### Before (Express + JSON)
- ❌ Need to pay for server hosting
- ❌ Manual database backups
- ❌ File uploads stored locally (lost on restart)
- ❌ No real-time capabilities
- ❌ Manual scaling

### After (Supabase + Netlify)
- ✅ **100% FREE** hosting
- ✅ Automatic daily backups
- ✅ Durable file storage (never lost)
- ✅ Real-time subscriptions (future feature)
- ✅ Auto-scales to millions of users
- ✅ Global CDN for fast loading
- ✅ Auto-deploy on git push

---

## 🎯 Next Steps

**Right Now:**
1. [ ] Create Supabase project
2. [ ] Run `./setup-supabase.sh`
3. [ ] Verify data migrated correctly

**After Migration:**
1. [ ] Update frontend pages (I can help!)
2. [ ] Test locally: `npm run dev:vite`
3. [ ] Push to GitHub
4. [ ] Deploy on Netlify

**Later (Optional):**
1. [ ] Remove old `server/` directory
2. [ ] Set up custom domain
3. [ ] Configure Supabase email templates

---

## 📞 Need Help?

I'm here! Just ask me to:
- "Update Jadwal.jsx to use Supabase"
- "Help me test the migration"
- "Deploy to Netlify step by step"
- "Set up admin authentication"

Let's get this deployed! 🚀
