import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';

test('create cloudflare api token and deploy', async ({ page }) => {
  // Go to Cloudflare API tokens page (already logged in on Safari)
  await page.goto('https://dash.cloudflare.com/profile/api-tokens');
  await page.waitForLoadState('networkidle');

  console.log('On API tokens page');

  // Click "Create Token"
  const createBtn = page.getByRole('link', { name: /create token/i })
    .or(page.getByRole('button', { name: /create token/i }));
  await createBtn.first().click();
  await page.waitForLoadState('networkidle');

  console.log('On token template page');

  // Use the "Edit Cloudflare Workers" template
  const workersTemplate = page.locator('text=Edit Cloudflare Workers').first();
  await workersTemplate.waitFor({ timeout: 10000 });

  // Click the "Use template" button next to it
  const templateRow = workersTemplate.locator('../..').or(workersTemplate.locator('xpath=ancestor::li[1]'));
  const useTemplateBtn = page.locator('a:has-text("Use template"), button:has-text("Use template")').first();
  await useTemplateBtn.click();
  await page.waitForLoadState('networkidle');

  console.log('Template selected, on token config page');

  // Take a screenshot to see the form
  await page.screenshot({ path: '/tmp/cf-token-form.png' });
  await page.waitForTimeout(2000);

  // Click "Continue to summary"
  const continueBtn = page.getByRole('button', { name: /continue to summary/i })
    .or(page.getByRole('link', { name: /continue to summary/i }));
  await continueBtn.first().click();
  await page.waitForLoadState('networkidle');

  console.log('On summary page');
  await page.screenshot({ path: '/tmp/cf-token-summary.png' });

  // Click "Create Token"
  const finalCreateBtn = page.getByRole('button', { name: /^create token$/i });
  await finalCreateBtn.click();
  await page.waitForLoadState('networkidle');

  console.log('Token created, capturing value');
  await page.screenshot({ path: '/tmp/cf-token-created.png' });
  await page.waitForTimeout(2000);

  // Capture the token from the page
  const tokenInput = page.locator('input[type="text"][readonly], input[type="password"][readonly], input[readonly]').first();
  let token = await tokenInput.inputValue().catch(() => null);

  if (!token) {
    // Try getting it from a code/pre element
    const tokenText = await page.locator('code, pre, .token-value').first().innerText().catch(() => null);
    token = tokenText?.trim();
  }

  if (!token) {
    // Try clipboard approach - click copy button first
    const copyBtn = page.getByRole('button', { name: /copy/i }).first();
    await copyBtn.click().catch(() => {});
    await page.waitForTimeout(500);
    // Read from clipboard via JS
    token = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
  }

  console.log('Token captured:', token ? `${token.substring(0, 10)}...` : 'FAILED');
  expect(token).toBeTruthy();

  // Save token to file for deploy step
  fs.writeFileSync('/tmp/cf_token.txt', token.trim());
  console.log('Token saved to /tmp/cf_token.txt');

  // Now deploy using wrangler with the token
  console.log('Deploying motherlight to Cloudflare Workers...');
  const deployOutput = execSync(
    `cd /Volumes/2T/Projects/motherlight && CLOUDFLARE_API_TOKEN=${token.trim()} npx wrangler deploy 2>&1`,
    { encoding: 'utf8', timeout: 300000 }
  );

  console.log('Deploy output:', deployOutput);
  expect(deployOutput).toContain('workers.dev');

  const workerUrl = deployOutput.match(/https:\/\/[^\s]+workers\.dev/)?.[0];
  console.log('\n✅ DEPLOYED:', workerUrl);
});
