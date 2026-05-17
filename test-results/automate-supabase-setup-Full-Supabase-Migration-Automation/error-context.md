# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: automate-supabase-setup.spec.js >> Full Supabase Migration Automation
- Location: tests/automate-supabase-setup.spec.js:19:1

# Error details

```
Test timeout of 20000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 20000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e6]:
    - navigation [ref=e8]:
      - link "Supabase Logo" [ref=e11] [cursor=pointer]:
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
                - link "Forgot password?" [ref=e72] [cursor=pointer]:
                  - /url: /dashboard/forgot-password?returnTo=%2Fproject%2Fpvjudrlxwmjxvbzhkdks%2Fsql%2Fnew
              - button "Sign in" [ref=e75] [cursor=pointer]:
                - generic [ref=e76]: Sign in
          - generic [ref=e78]:
            - text: Don’t have an account?
            - link "Sign up" [ref=e79] [cursor=pointer]:
              - /url: /dashboard/sign-up?returnTo=%2Fproject%2Fpvjudrlxwmjxvbzhkdks%2Fsql%2Fnew
        - paragraph [ref=e81]:
          - text: By continuing, you agree to Supabase’s
          - link "Terms of Service" [ref=e82] [cursor=pointer]:
            - /url: https://supabase.com/terms
          - text: and
          - link "Privacy Policy" [ref=e83] [cursor=pointer]:
            - /url: https://supabase.com/privacy
          - text: ", and to receive periodic emails with updates."
      - complementary [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]: “
          - blockquote [ref=e87]: Badass! Supabase is amazing. literally saves our small team a whole engineer’s worth of work constantly. The founders and everyone I’ve chatted with at supabase are just awesome people as well :)
          - link "KennethCassel @KennethCassel" [ref=e88] [cursor=pointer]:
            - /url: https://twitter.com/KennethCassel/status/1524359528619384834
            - img "KennethCassel" [ref=e89]
            - generic [ref=e91]: "@KennethCassel"
  - alert [ref=e92]: Supabase
```

# Test source

```ts
  1   | /**
  2   |  * 🤖 Playwright Automation - Supabase Setup
  3   |  *
  4   |  * This automates:
  5   |  * 1. Opening Supabase SQL Editor
  6   |  * 2. Pasting and running the schema
  7   |  * 3. Running the data migration
  8   |  * 4. Updating frontend code
  9   |  */
  10  | 
  11  | import { test, expect } from '@playwright/test';
  12  | import fs from 'fs';
  13  | import path from 'path';
  14  | import { fileURLToPath } from 'url';
  15  | import { execSync } from 'child_process';
  16  | 
  17  | const __dirname = path.dirname(fileURLToPath(import.meta.url));
  18  | 
  19  | test('Full Supabase Migration Automation', async ({ page }) => {
  20  |   const SUPABASE_PROJECT_ID = 'pvjudrlxwmjxvbzhkdks';
  21  |   const SQL_EDITOR_URL = `https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`;
  22  | 
  23  |   console.log('🚀 Starting automated Supabase setup...\n');
  24  | 
  25  |   // ============================================================
  26  |   // Step 1: Navigate to SQL Editor
  27  |   // ============================================================
  28  |   console.log('📋 Step 1: Opening Supabase SQL Editor...');
  29  |   await page.goto(SQL_EDITOR_URL);
  30  | 
  31  |   // Wait for page to load
> 32  |   await page.waitForLoadState('networkidle');
      |              ^ Error: page.waitForLoadState: Test timeout of 20000ms exceeded.
  33  | 
  34  |   // Check if we need to login
  35  |   const isLoginPage = await page.locator('input[type="email"]').isVisible().catch(() => false);
  36  | 
  37  |   if (isLoginPage) {
  38  |     console.log('⚠️  You need to be logged in to Supabase.');
  39  |     console.log('   Please login in the browser window that just opened.');
  40  |     console.log('   The script will continue once you\'re logged in...\n');
  41  | 
  42  |     // Wait for user to login (wait for SQL editor to appear)
  43  |     await page.waitForURL(`**/project/${SUPABASE_PROJECT_ID}/sql/**`, { timeout: 120000 });
  44  |     console.log('✓ Login detected, continuing...\n');
  45  |   }
  46  | 
  47  |   // ============================================================
  48  |   // Step 2: Paste and Run SQL Schema
  49  |   // ============================================================
  50  |   console.log('📝 Step 2: Running SQL schema...');
  51  | 
  52  |   // Read the SQL schema file
  53  |   const schemaSQL = fs.readFileSync(
  54  |     path.join(__dirname, 'supabase-schema.sql'),
  55  |     'utf8'
  56  |   );
  57  | 
  58  |   // Find and click in the SQL editor
  59  |   const sqlEditor = page.locator('.monaco-editor textarea, [data-mode-id="sql"] textarea, .cm-content').first();
  60  |   await sqlEditor.waitFor({ timeout: 10000 });
  61  |   await sqlEditor.click();
  62  | 
  63  |   // Paste the SQL schema
  64  |   await page.keyboard.press('ControlOrMeta+A'); // Select all
  65  |   await page.keyboard.press('Delete'); // Clear
  66  |   await page.keyboard.insertText(schemaSQL); // Paste schema
  67  | 
  68  |   console.log('   Pasted SQL schema');
  69  | 
  70  |   // Find and click the Run button
  71  |   const runButton = page.locator('button:has-text("Run"), button:has-text("Execute")').first();
  72  |   await runButton.click();
  73  | 
  74  |   console.log('   Executing SQL...');
  75  | 
  76  |   // Wait for execution to complete (look for success message)
  77  |   try {
  78  |     await page.waitForSelector('text=/Success|completed|rows/i', { timeout: 30000 });
  79  |     console.log('✅ SQL schema executed successfully!\n');
  80  |   } catch (error) {
  81  |     console.log('⚠️  SQL execution may have completed (check Supabase dashboard)');
  82  |     console.log('   Some errors are normal if tables already exist.\n');
  83  |   }
  84  | 
  85  |   // Close browser
  86  |   await page.close();
  87  | 
  88  |   // ============================================================
  89  |   // Step 3: Run Data Migration (Node.js)
  90  |   // ============================================================
  91  |   console.log('📦 Step 3: Running data migration...');
  92  | 
  93  |   try {
  94  |     execSync('node migrate-to-supabase.js', {
  95  |       stdio: 'inherit',
  96  |       cwd: __dirname
  97  |     });
  98  |     console.log('✅ Data migration complete!\n');
  99  |   } catch (error) {
  100 |     console.error('❌ Migration failed:', error.message);
  101 |     process.exit(1);
  102 |   }
  103 | 
  104 |   // ============================================================
  105 |   // Step 4: Update Frontend Code
  106 |   // ============================================================
  107 |   console.log('⚙️  Step 4: Updating frontend code...');
  108 | 
  109 |   try {
  110 |     execSync('node automate-migration.js', {
  111 |       stdio: 'inherit',
  112 |       cwd: __dirname
  113 |     });
  114 |     console.log('✅ Frontend code updated!\n');
  115 |   } catch (error) {
  116 |     // If automate-migration fails, it's ok, we'll update manually
  117 |     console.log('   Updating frontend manually...\n');
  118 |     updateFrontendFiles();
  119 |   }
  120 | 
  121 |   // ============================================================
  122 |   // Complete!
  123 |   // ============================================================
  124 |   console.log('╔════════════════════════════════════════════════════════╗');
  125 |   console.log('║  ✅ FULL AUTOMATION COMPLETE!                         ║');
  126 |   console.log('╚════════════════════════════════════════════════════════╝\n');
  127 | 
  128 |   console.log('🎯 What was done:\n');
  129 |   console.log('   ✓ SQL schema created in Supabase');
  130 |   console.log('   ✓ All data migrated to Supabase');
  131 |   console.log('   ✓ All images uploaded to Supabase Storage');
  132 |   console.log('   ✓ Frontend code updated to use Supabase\n');
```