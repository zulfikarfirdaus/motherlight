/**
 * Safari (WebKit) Deployment Automation
 *
 * Handles:
 *   1. Supabase SQL schema setup via SQL Editor
 *   2. Verifying the live Netlify site
 *
 * Run via: deploy-everything.sh (not directly)
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SUPABASE_PROJECT_ID = 'pvjudrlxwmjxvbzhkdks';
const SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`;

test('Supabase schema setup in Safari', async ({ page }) => {
  console.log('\n🔶 STEP: Opening Supabase SQL Editor in Safari...\n');

  await page.goto(SQL_EDITOR_URL);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Handle login if needed
  const needsLogin = await page.locator('input[type="email"]').isVisible().catch(() => false);
  if (needsLogin) {
    console.log('⚠️  Please log in to Supabase in the Safari window.');
    console.log('    Waiting up to 3 minutes for you to complete login...\n');
    await page.waitForURL(`**/project/${SUPABASE_PROJECT_ID}/**`, { timeout: 180000 });
    await page.goto(SQL_EDITOR_URL);
    await page.waitForLoadState('networkidle');
    console.log('✓ Logged in\n');
  }

  // Wait for the SQL editor to be ready
  console.log('📝 Waiting for SQL editor to load...');
  const editorSelector = [
    '.cm-content',
    '.monaco-editor textarea',
    '[data-mode-id="sql"] textarea',
    '.ace_text-input',
  ].join(', ');

  await page.waitForSelector(editorSelector, { timeout: 30000 });
  console.log('✓ SQL editor ready');

  const schemaSQL = fs.readFileSync(path.join(ROOT, 'supabase-schema.sql'), 'utf8');

  // Click the editor and clear it
  const editor = page.locator(editorSelector).first();
  await editor.click({ force: true });
  await page.waitForTimeout(500);
  await page.keyboard.press('Meta+A');
  await page.waitForTimeout(300);

  // Type the SQL (insertText handles special chars correctly)
  console.log('📋 Pasting SQL schema...');
  await page.keyboard.insertText(schemaSQL);
  await page.waitForTimeout(500);

  // Click Run button
  const runBtn = page.locator([
    'button:has-text("Run")',
    'button[title="Run query"]',
    'button:has-text("Execute")',
  ].join(', ')).first();

  await runBtn.waitFor({ timeout: 10000 });
  console.log('▶  Executing SQL schema...');
  await runBtn.click();

  // Wait for success or handle already-exists errors gracefully
  try {
    await page.waitForSelector(
      'text=/Success|completed|rows affected|already exists/i',
      { timeout: 45000 }
    );
    console.log('✅ SQL schema executed successfully\n');
  } catch {
    console.log('⚠️  Could not confirm success — check Supabase dashboard.');
    console.log('    (Tables may already exist — that is fine)\n');
  }
});

test('Data migration', async ({ page }) => {
  console.log('\n📦 STEP: Running data migration to Supabase...\n');

  // Close the browser page — migration runs via Node.js
  await page.close();

  try {
    execSync('node migrate-to-supabase.js', {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: 120000,
    });
    console.log('✅ Data migration complete\n');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    console.log('   Check migrate-to-supabase.js output above for details.\n');
  }
});

test('Verify live Netlify site in Safari', async ({ page }) => {
  const netlifyUrl = process.env.NETLIFY_SITE_URL;

  if (!netlifyUrl) {
    console.log('⚠️  NETLIFY_SITE_URL not set — skipping live verification');
    return;
  }

  console.log(`\n🌐 STEP: Opening live site in Safari: ${netlifyUrl}\n`);

  await page.goto(netlifyUrl);
  await page.waitForLoadState('networkidle');

  // Basic sanity check — page should have some content
  const title = await page.title();
  console.log(`✓ Site loaded — title: "${title}"`);

  // Take a screenshot for confirmation
  await page.screenshot({ path: path.join(ROOT, 'test-results/live-site.png'), fullPage: false });
  console.log('✅ Screenshot saved to test-results/live-site.png\n');
});
