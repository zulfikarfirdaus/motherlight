import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to footer and screenshot just that section
  const footer = page.locator('footer.footer');
  await footer.scrollIntoViewIfNeeded();
  await footer.screenshot({ path: 'footer-section.png' });

  console.log('✓ Footer screenshot saved to footer-section.png');
  await browser.close();
})();
