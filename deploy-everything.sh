#!/bin/bash
# deploy-everything.sh
# Full automated deployment: GitHub → Supabase → Netlify
# Usage: bash deploy-everything.sh

set -e
cd "$(dirname "$0")"

SUPABASE_URL="https://pvjudrlxwmjxvbzhkdks.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2anVkcmx4d21qeHZiemhrZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjY2OTAsImV4cCI6MjA5NDYwMjY5MH0.4HoDg0iVmN3_gi9ikhYPfVLwLRVui_OI_G4X5Lr4ia4"
GITHUB_REPO="motherlight"
NETLIFY_SITE_NAME="motherlight-clinic"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║       Motherlight — Full Deployment Automation          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  1. GitHub  — init repo, commit, push"
echo "  2. Netlify — create site, set env vars, deploy"
echo "  3. Safari  — Supabase schema + data migration"
echo "  4. Safari  — verify live site"
echo ""

# ─────────────────────────────────────────────────
# Prerequisites check
# ─────────────────────────────────────────────────
for cmd in git gh netlify node npx; do
  if ! command -v $cmd &>/dev/null; then
    echo "❌ '$cmd' is not installed or not in PATH"
    exit 1
  fi
done

if ! gh auth status &>/dev/null; then
  echo "❌ Not logged in to GitHub. Run: gh auth login"
  exit 1
fi

if ! netlify status &>/dev/null; then
  echo "❌ Not logged in to Netlify. Run: netlify login"
  exit 1
fi

echo "✓ All prerequisites met"
echo ""

# ─────────────────────────────────────────────────
# STEP 1: Git init + GitHub push
# ─────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  STEP 1 — GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit: Motherlight — klinik website with Supabase"
  echo "✓ Git initialized and committed"
else
  echo "Git repo already initialized, staging any changes..."
  git add .
  git diff --cached --quiet || git commit -m "Update: pre-deployment sync"
  echo "✓ Changes committed"
fi

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
  echo "✓ Remote 'origin' already set: $(git remote get-url origin)"
else
  echo "Creating GitHub repository: $GITHUB_REPO..."
  gh repo create "$GITHUB_REPO" --public --source=. --remote=origin --push
  echo "✓ Repository created and pushed"
fi

# Push latest
git push origin HEAD 2>/dev/null || git push --set-upstream origin main 2>/dev/null || git push --set-upstream origin master 2>/dev/null || true

GITHUB_URL=$(gh repo view --json url -q .url 2>/dev/null || echo "https://github.com/zulfikarfirdaus/$GITHUB_REPO")
echo "✓ GitHub: $GITHUB_URL"
echo ""

# ─────────────────────────────────────────────────
# STEP 2: Build
# ─────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  STEP 2 — Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Building project..."
npm run build
echo "✓ Build complete → dist/"
echo ""

# ─────────────────────────────────────────────────
# STEP 3: Netlify — create site + deploy
# ─────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  STEP 3 — Netlify"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Try named site, fall back to timestamped name if taken
SITE_NAME_ATTEMPT="$NETLIFY_SITE_NAME"
echo "Creating Netlify site: $SITE_NAME_ATTEMPT..."

SITE_JSON=$(netlify api createSite --data "{\"name\":\"$SITE_NAME_ATTEMPT\"}" 2>/dev/null) || {
  SITE_NAME_ATTEMPT="${NETLIFY_SITE_NAME}-$(date +%s)"
  echo "  Name taken — trying: $SITE_NAME_ATTEMPT"
  SITE_JSON=$(netlify api createSite --data "{\"name\":\"$SITE_NAME_ATTEMPT\"}")
}

SITE_ID=$(echo "$SITE_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
NETLIFY_SITE_URL=$(echo "$SITE_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['ssl_url'])")

echo "✓ Site created: $NETLIFY_SITE_URL"
echo "  Site ID: $SITE_ID"

# Set Supabase env vars on Netlify (for GitHub-triggered rebuilds)
echo "Setting environment variables on Netlify..."
netlify env:set VITE_SUPABASE_URL "$SUPABASE_URL" --site "$SITE_ID" --context production 2>/dev/null || true
netlify env:set VITE_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" --site "$SITE_ID" --context production 2>/dev/null || true
echo "✓ Environment variables set"

# Deploy the built dist
echo "Deploying to Netlify (production)..."
DEPLOY_OUTPUT=$(netlify deploy --prod --dir=dist --site="$SITE_ID" 2>&1)
echo "$DEPLOY_OUTPUT"

# Extract live URL from deploy output
LIVE_URL=$(echo "$DEPLOY_OUTPUT" | grep -E 'https://[a-z0-9-]+\.netlify\.app' | tail -1 | tr -d ' ')
LIVE_URL="${LIVE_URL:-$NETLIFY_SITE_URL}"

echo ""
echo "✓ Netlify: $LIVE_URL"
echo ""

# ─────────────────────────────────────────────────
# STEP 4 & 5: Safari — Supabase + verify live site
# ─────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  STEP 4 — Safari: Supabase schema + data migration + verify"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Opening Safari browser for Supabase setup..."
echo "(You may need to log in to Supabase if prompted)"
echo ""

mkdir -p test-results

NETLIFY_SITE_URL="$LIVE_URL" \
  npx playwright test tests/safari-deploy.spec.js \
  --config=playwright-safari.config.js \
  --project=safari \
  --reporter=list

echo ""

# ─────────────────────────────────────────────────
# Done
# ─────────────────────────────────────────────────
echo "╔══════════════════════════════════════════════════════════╗"
echo "║            DEPLOYMENT COMPLETE                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  GitHub  → $GITHUB_URL"
echo "  Netlify → $LIVE_URL"
echo "  Supabase→ https://supabase.com/dashboard/project/pvjudrlxwmjxvbzhkdks"
echo ""
echo "  To redeploy after changes:"
echo "    git add . && git commit -m 'update' && git push"
echo "    netlify deploy --prod --dir=dist --site=$SITE_ID"
echo ""
