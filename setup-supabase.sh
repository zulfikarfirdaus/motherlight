#!/bin/bash

# Motherlight Supabase Setup Script
# This script guides you through the Supabase migration

set -e

echo "╔════════════════════════════════════════════════╗"
echo "║  Motherlight → Supabase Setup Wizard         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
if [ -f .env ]; then
  echo "✓ .env file found"
else
  echo "📝 Creating .env file from template..."
  cp .env.example .env
  echo ""
  echo "⚠️  Please edit .env and add your Supabase credentials:"
  echo ""
  echo "   1. Go to https://supabase.com/dashboard"
  echo "   2. Create a new project (or open existing)"
  echo "   3. Go to Settings → API"
  echo "   4. Copy:"
  echo "      - Project URL → https://supabase.com/dashboard/project/pvjudrlxwmjxvbzhkdks/settings/api-keys"
  echo "      - anon public key → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY2OTAsImV4cCI6MjA5NDYwMjY5MH0.4HoDg0iVmN3_gi9ikhYPfVLwLRVui_OI_G4X5Lr4ia4"
  echo "      - service_role key → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAyNjY5MCwiZXhwIjoyMDk0NjAyNjkwfQ.GjvnKpJFKUQTRJSnTssdIOYa_y1f3YgEbzU2KqjGptU"
  echo ""
  echo "   Then run this script again."
  echo ""
  exit 1
fi

# Source .env to check if configured
source .env

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "❌ Environment variables not configured!"
  echo ""
  echo "Please edit .env and add your Supabase credentials."
  echo "See MIGRATION-GUIDE.md for detailed instructions."
  echo ""
  exit 1
fi

echo "✓ Environment variables configured"
echo ""

# Check if supabase-schema.sql was run
echo "❓ Have you run supabase-schema.sql in Supabase SQL Editor?"
echo "   (Type 'yes' to continue, or 'no' for instructions)"
read -p "> " ran_schema

if [ "$ran_schema" != "yes" ]; then
  echo ""
  echo "📋 Please run the schema first:"
  echo ""
  echo "   1. Open Supabase dashboard"
  echo "   2. Go to SQL Editor"
  echo "   3. Click 'New query'"
  echo "   4. Copy contents of supabase-schema.sql"
  echo "   5. Paste and click 'Run'"
  echo ""
  echo "   Then run this script again."
  echo ""
  exit 1
fi

echo ""
echo "🚀 Starting migration..."
echo ""

# Run migration
npm run migrate:supabase

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                           ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "  1. Test locally:     npm run dev:vite"
echo "  2. Push to GitHub:   git push"
echo "  3. Deploy to Cloudflare:  npm run build && npx wrangler deploy"
echo ""
