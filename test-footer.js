import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[CONSOLE ${msg.type()}]:`, msg.text());
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]:', error.message);
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.error('[REQUEST FAILED]:', request.url(), request.failure()?.errorText);
  });

  try {
    console.log('Navigating to localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });

    console.log('\n✓ Page loaded successfully');

    // Wait a bit for React to render
    await page.waitForTimeout(2000);

    // Check if footer exists
    const footer = await page.locator('footer.footer').count();
    console.log(`\n✓ Footer found: ${footer > 0 ? 'YES' : 'NO'}`);

    // Check for Instagram icon
    const instagramIcon = await page.locator('.footer-social svg').count();
    console.log(`✓ Instagram icon found: ${instagramIcon > 0 ? 'YES' : 'NO'}`);

    // Check for logo
    const logo = await page.locator('.footer-logo').count();
    console.log(`✓ Footer logo found: ${logo > 0 ? 'YES' : 'NO'}`);

    // Take screenshot
    await page.screenshot({ path: 'footer-test.png', fullPage: true });
    console.log('\n✓ Screenshot saved to footer-test.png');

    // Get page title
    const title = await page.title();
    console.log(`\n✓ Page title: ${title}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  await browser.close();
})();
