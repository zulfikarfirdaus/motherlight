# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: safari-deploy.spec.js >> Supabase schema setup in Safari
- Location: tests/safari-deploy.spec.js:23:1

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 180000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/project/pvjudrlxwmjxvbzhkdks/**" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - navigation [ref=e8]:
      - link "Supabase Logo" [ref=e11]:
        - /url: https://supabase.com
        - img "Supabase Logo" [ref=e12]
      - link "Documentation" [ref=e14] [cursor=pointer]:
        - /url: https://supabase.com/docs
        - img [ref=e16]
        - generic [ref=e19]: Documentation
    - generic [ref=e20]:
      - main [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]:
            - heading "Welcome back" [level=1] [ref=e24]
            - heading "Sign in to your account" [level=2] [ref=e25]
          - generic [ref=e26]:
            - button "Continue with GitHub" [ref=e29] [cursor=pointer]:
              - img [ref=e31]
              - generic [ref=e34]: Continue with GitHub
            - link "Continue with SSO" [ref=e37] [cursor=pointer]:
              - /url: /dashboard/sign-in-sso?returnTo=%2Fproject%2Fpvjudrlxwmjxvbzhkdks%2Fsql%2Fnew
              - img [ref=e39]
              - generic [ref=e42]: Continue with SSO
            - generic [ref=e47]: or
            - generic [ref=e48]:
              - generic [ref=e50]:
                - generic [ref=e53]: Email
                - textbox "Email" [ref=e56]:
                  - /placeholder: you@example.com
              - generic [ref=e57]:
                - generic [ref=e59]:
                  - generic [ref=e62]: Password
                  - generic [ref=e65]:
                    - textbox "Password" [ref=e66]:
                      - /placeholder: ••••••••
                    - button "Show password" [ref=e67] [cursor=pointer]:
                      - img [ref=e69]
                - link "Forgot password?" [ref=e72]:
                  - /url: /dashboard/forgot-password?returnTo=%2Fproject%2Fpvjudrlxwmjxvbzhkdks%2Fsql%2Fnew
              - button "Sign in" [ref=e75] [cursor=pointer]:
                - generic [ref=e76]: Sign in
          - generic [ref=e78]:
            - text: Don’t have an account?
            - link "Sign up" [ref=e79]:
              - /url: /dashboard/sign-up?returnTo=%2Fproject%2Fpvjudrlxwmjxvbzhkdks%2Fsql%2Fnew
        - paragraph [ref=e81]:
          - text: By continuing, you agree to Supabase’s
          - link "Terms of Service" [ref=e82]:
            - /url: https://supabase.com/terms
          - text: and
          - link "Privacy Policy" [ref=e83]:
            - /url: https://supabase.com/privacy
          - text: ", and to receive periodic emails with updates."
      - complementary [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]: “
          - blockquote [ref=e87]: Where has @supabase been all my life? 😍
          - link "Elsolo244 @Elsolo244" [ref=e88]:
            - /url: https://twitter.com/Elsolo244/status/1360257201911320579
            - img "Elsolo244" [ref=e89]
            - generic [ref=e91]: "@Elsolo244"
  - alert [ref=e92]: Supabase
```

# Test source

```ts
  1   | /**
  2   |  * Safari (WebKit) Deployment Automation
  3   |  *
  4   |  * Handles:
  5   |  *   1. Supabase SQL schema setup via SQL Editor
  6   |  *   2. Verifying the live Netlify site
  7   |  *
  8   |  * Run via: deploy-everything.sh (not directly)
  9   |  */
  10  | 
  11  | import { test, expect } from '@playwright/test';
  12  | import fs from 'fs';
  13  | import path from 'path';
  14  | import { fileURLToPath } from 'url';
  15  | import { execSync } from 'child_process';
  16  | 
  17  | const __dirname = path.dirname(fileURLToPath(import.meta.url));
  18  | const ROOT = path.join(__dirname, '..');
  19  | 
  20  | const SUPABASE_PROJECT_ID = 'pvjudrlxwmjxvbzhkdks';
  21  | const SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`;
  22  | 
  23  | test('Supabase schema setup in Safari', async ({ page }) => {
  24  |   console.log('\n🔶 STEP: Opening Supabase SQL Editor in Safari...\n');
  25  | 
  26  |   await page.goto(SQL_EDITOR_URL);
  27  |   await page.waitForLoadState('domcontentloaded');
  28  |   await page.waitForTimeout(3000);
  29  | 
  30  |   // Handle login if needed
  31  |   const needsLogin = await page.locator('input[type="email"]').isVisible().catch(() => false);
  32  |   if (needsLogin) {
  33  |     console.log('⚠️  Please log in to Supabase in the Safari window.');
  34  |     console.log('    Waiting up to 3 minutes for you to complete login...\n');
> 35  |     await page.waitForURL(`**/project/${SUPABASE_PROJECT_ID}/**`, { timeout: 180000 });
      |                ^ Error: page.waitForURL: Test timeout of 180000ms exceeded.
  36  |     await page.goto(SQL_EDITOR_URL);
  37  |     await page.waitForLoadState('networkidle');
  38  |     console.log('✓ Logged in\n');
  39  |   }
  40  | 
  41  |   // Wait for the SQL editor to be ready
  42  |   console.log('📝 Waiting for SQL editor to load...');
  43  |   const editorSelector = [
  44  |     '.cm-content',
  45  |     '.monaco-editor textarea',
  46  |     '[data-mode-id="sql"] textarea',
  47  |     '.ace_text-input',
  48  |   ].join(', ');
  49  | 
  50  |   await page.waitForSelector(editorSelector, { timeout: 30000 });
  51  |   console.log('✓ SQL editor ready');
  52  | 
  53  |   const schemaSQL = fs.readFileSync(path.join(ROOT, 'supabase-schema.sql'), 'utf8');
  54  | 
  55  |   // Click the editor and clear it
  56  |   const editor = page.locator(editorSelector).first();
  57  |   await editor.click({ force: true });
  58  |   await page.waitForTimeout(500);
  59  |   await page.keyboard.press('Meta+A');
  60  |   await page.waitForTimeout(300);
  61  | 
  62  |   // Type the SQL (insertText handles special chars correctly)
  63  |   console.log('📋 Pasting SQL schema...');
  64  |   await page.keyboard.insertText(schemaSQL);
  65  |   await page.waitForTimeout(500);
  66  | 
  67  |   // Click Run button
  68  |   const runBtn = page.locator([
  69  |     'button:has-text("Run")',
  70  |     'button[title="Run query"]',
  71  |     'button:has-text("Execute")',
  72  |   ].join(', ')).first();
  73  | 
  74  |   await runBtn.waitFor({ timeout: 10000 });
  75  |   console.log('▶  Executing SQL schema...');
  76  |   await runBtn.click();
  77  | 
  78  |   // Wait for success or handle already-exists errors gracefully
  79  |   try {
  80  |     await page.waitForSelector(
  81  |       'text=/Success|completed|rows affected|already exists/i',
  82  |       { timeout: 45000 }
  83  |     );
  84  |     console.log('✅ SQL schema executed successfully\n');
  85  |   } catch {
  86  |     console.log('⚠️  Could not confirm success — check Supabase dashboard.');
  87  |     console.log('    (Tables may already exist — that is fine)\n');
  88  |   }
  89  | });
  90  | 
  91  | test('Data migration', async ({ page }) => {
  92  |   console.log('\n📦 STEP: Running data migration to Supabase...\n');
  93  | 
  94  |   // Close the browser page — migration runs via Node.js
  95  |   await page.close();
  96  | 
  97  |   try {
  98  |     execSync('node migrate-to-supabase.js', {
  99  |       cwd: ROOT,
  100 |       stdio: 'inherit',
  101 |       timeout: 120000,
  102 |     });
  103 |     console.log('✅ Data migration complete\n');
  104 |   } catch (err) {
  105 |     console.error('❌ Migration error:', err.message);
  106 |     console.log('   Check migrate-to-supabase.js output above for details.\n');
  107 |   }
  108 | });
  109 | 
  110 | test('Verify live Netlify site in Safari', async ({ page }) => {
  111 |   const netlifyUrl = process.env.NETLIFY_SITE_URL;
  112 | 
  113 |   if (!netlifyUrl) {
  114 |     console.log('⚠️  NETLIFY_SITE_URL not set — skipping live verification');
  115 |     return;
  116 |   }
  117 | 
  118 |   console.log(`\n🌐 STEP: Opening live site in Safari: ${netlifyUrl}\n`);
  119 | 
  120 |   await page.goto(netlifyUrl);
  121 |   await page.waitForLoadState('networkidle');
  122 | 
  123 |   // Basic sanity check — page should have some content
  124 |   const title = await page.title();
  125 |   console.log(`✓ Site loaded — title: "${title}"`);
  126 | 
  127 |   // Take a screenshot for confirmation
  128 |   await page.screenshot({ path: path.join(ROOT, 'test-results/live-site.png'), fullPage: false });
  129 |   console.log('✅ Screenshot saved to test-results/live-site.png\n');
  130 | });
  131 | 
```