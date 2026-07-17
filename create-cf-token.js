#!/usr/bin/env node
/**
 * Creates a Cloudflare API token using real Safari (AppleScript),
 * then deploys motherlight via wrangler.
 */
import { execSync, spawnSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

function safari(js) {
  const script = `tell application "Safari"
  set theTab to current tab of front window
  set theResult to do JavaScript "${js.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}" in theTab
  return theResult
end tell`;
  const result = spawnSync('osascript', ['-e', script], { encoding: 'utf8', timeout: 30000 });
  return result.stdout?.trim();
}

function safariNavigate(url) {
  const script = `tell application "Safari"
  set URL of current tab of front window to "${url}"
  delay 4
end tell`;
  spawnSync('osascript', ['-e', script], { encoding: 'utf8', timeout: 15000 });
}

function activate() {
  spawnSync('osascript', ['-e', 'tell application "Safari" to activate'], { encoding: 'utf8' });
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function sleep(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

console.log('🔑 Opening Cloudflare API tokens page in Safari...');
activate();
safariNavigate('https://dash.cloudflare.com/profile/api-tokens');
sleep(5000);

console.log('📋 Checking page loaded...');
const title = safari('document.title');
console.log('Page title:', title);

if (title?.includes('login') || title?.includes('Login')) {
  console.error('❌ Not logged in to Cloudflare on Safari. Please log in first.');
  process.exit(1);
}

// Click "Create Token" button
console.log('🖱️  Clicking Create Token...');
safari(`
  const btns = [...document.querySelectorAll('a, button')];
  const btn = btns.find(b => b.textContent.trim() === 'Create token');
  if (btn) btn.click();
  btn ? 'clicked' : 'not found';
`);
sleep(4000);

// Check current page
const page2Title = safari('document.title');
console.log('After click:', page2Title);

// Find "Edit Cloudflare Workers" template and click "Use template"
console.log('📝 Looking for Edit Cloudflare Workers template...');
const clicked = safari(`
  const headings = [...document.querySelectorAll('h2, h3, h4, div, span, p')];
  const heading = headings.find(h => h.textContent.includes('Edit Cloudflare Workers'));
  if (!heading) return 'heading not found';
  // Find nearest "Use template" button/link
  const parent = heading.closest('li, article, section, div[class*="card"], div[class*="row"]') || heading.parentElement?.parentElement;
  const btn = parent?.querySelector('a[href*="template"], button');
  if (btn) { btn.click(); return 'clicked: ' + btn.textContent.trim(); }
  // Try sibling approach
  const links = [...document.querySelectorAll('a[href*="template"], button')];
  const link = links.find(l => l.textContent.trim().toLowerCase().includes('use template'));
  if (link) { link.click(); return 'fallback clicked: ' + link.textContent.trim(); }
  return 'button not found';
`);
console.log('Template click result:', clicked);
sleep(5000);

// Click "Continue to summary"
console.log('➡️  Clicking Continue to summary...');
safari(`
  const btns = [...document.querySelectorAll('button, a')];
  const btn = btns.find(b => b.textContent.toLowerCase().includes('continue to summary'));
  if (btn) btn.click();
  btn ? 'clicked' : 'not found';
`);
sleep(4000);

// Click "Create Token"
console.log('✅ Clicking Create Token (final)...');
safari(`
  const btns = [...document.querySelectorAll('button')];
  const btn = btns.find(b => b.textContent.trim().toLowerCase() === 'create token');
  if (btn) btn.click();
  btn ? 'clicked' : 'not found';
`);
sleep(5000);

// Extract the token from the page
console.log('📥 Extracting token...');
const token = safari(`
  // Try readonly input
  const input = document.querySelector('input[readonly], input[type="text"][class*="token"]');
  if (input && input.value.length > 20) return input.value;

  // Try code element
  const code = document.querySelector('code');
  if (code && code.textContent.length > 20) return code.textContent.trim();

  // Try any input with a long value
  const inputs = [...document.querySelectorAll('input')];
  const tokenInput = inputs.find(i => i.value.length > 30);
  if (tokenInput) return tokenInput.value;

  return 'NOT_FOUND';
`);

console.log('Token result:', token?.substring(0, 15) + '...');

if (!token || token === 'NOT_FOUND' || token.length < 20) {
  // Take a screenshot via Safari for debugging
  console.log('⚠️  Could not auto-extract token. Taking screenshot...');
  safari('document.body.innerHTML.substring(0, 500)').then?.(h => console.log(h));
  const html = safari('document.body.innerText.substring(0, 1000)');
  console.log('Page text:', html);
  process.exit(1);
}

// Save token
writeFileSync('/tmp/cf_token.txt', token.trim());
console.log('✅ Token saved!');

// Deploy
console.log('\n🚀 Deploying motherlight to Cloudflare Workers...');
try {
  const output = execSync(
    `cd /Volumes/2T/Projects/motherlight && CLOUDFLARE_API_TOKEN="${token.trim()}" npx wrangler deploy 2>&1`,
    { encoding: 'utf8', timeout: 300000 }
  );
  console.log(output);
  const url = output.match(/https:\/\/[^\s]+workers\.dev/)?.[0];
  console.log('\n✅ DEPLOYED:', url || 'check output above');
} catch (err) {
  console.error('Deploy error:', err.stdout || err.message);
}
