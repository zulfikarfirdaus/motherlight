#!/bin/bash

# 🎨 Simple Deployment for UX Designers
# No coding required - just copy and paste!

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║  🎨 Motherlight - Simple Migration Guide             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  cat > .env << 'EOF'
VITE_SUPABASE_URL=https://pvjudrlxwmjxvbzhkdks.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY2OTAsImV4cCI6MjA5NDYwMjY5MH0.4HoDg0iVmN3_gi9ikhYPfVLwLRVui_OI_G4X5Lr4ia4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAyNjY5MCwiZXhwIjoyMDk0NjAyNjkwfQ.GjvnKpJFKUQTRJSnTssdIOYa_y1f3YgEbzU2KqjGptU
EOF
  echo "✅ Created .env file"
  echo ""
fi

echo "📋 STEP 1: Run SQL in Supabase"
echo "════════════════════════════════════════════════════════"
echo ""
echo "1. Open this link in Safari:"
echo "   👉 https://supabase.com/dashboard/project/pvjudrlxwmjxvbzhkdks/sql/new"
echo ""
echo "2. The SQL code is ready to copy!"
echo "   I'll copy it to your clipboard now..."
echo ""

# Copy SQL to clipboard
cat supabase-schema.sql | pbcopy

echo "✅ SQL copied to clipboard!"
echo ""
echo "3. In Safari (Supabase SQL Editor):"
echo "   - Press Command+A (select all)"
echo "   - Press Command+V (paste)"
echo "   - Click the green 'Run' button"
echo ""
echo "4. Wait for 'Success' message"
echo ""
echo "────────────────────────────────────────────────────────"
echo ""
echo "✋ PAUSE HERE!"
echo ""
echo "Once you see 'Success' in Supabase, come back here and"
echo "press ENTER to continue..."
echo ""
read

echo ""
echo "📦 STEP 2: Migrating Your Data"
echo "════════════════════════════════════════════════════════"
echo ""
echo "This will automatically:"
echo "  ✓ Upload all images to Supabase Storage"
echo "  ✓ Copy all doctors to database"
echo "  ✓ Copy all gallery albums to database"
echo ""
echo "Starting migration..."
echo ""

# Run migration
npm run migrate:supabase

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  ✅ MIGRATION COMPLETE!                               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🧪 NEXT: Test Your Site"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Run this command to test locally:"
echo ""
echo "   npm run dev:vite"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Check that:"
echo "  ✓ Jadwal page shows doctors"
echo "  ✓ Galeri page shows albums"
echo "  ✓ Images load correctly"
echo ""
echo "────────────────────────────────────────────────────────"
echo ""
echo "🚀 DEPLOY TO NETLIFY"
echo "════════════════════════════════════════════════════════"
echo ""
echo "1. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Migrate to Supabase'"
echo "   git push"
echo ""
echo "2. Go to: https://app.netlify.com"
echo "   - Click 'Add new site'"
echo "   - Connect your GitHub repo"
echo "   - Add these environment variables:"
echo ""
echo "   VITE_SUPABASE_URL"
echo "   = https://pvjudrlxwmjxvbzhkdks.supabase.co"
echo ""
echo "   VITE_SUPABASE_ANON_KEY"
echo "   = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY2OTAsImV4cCI6MjA5NDYwMjY5MH0.4HoDg0iVmN3_gi9ikhYPfVLwLRVui_OI_G4X5Lr4ia4"
echo ""
echo "   - Click 'Deploy'"
echo ""
echo "────────────────────────────────────────────────────────"
echo ""
echo "🎉 All done! Need help? Just ask!"
echo ""
