/**
 * Post-build prerender.
 *
 * The site is a client-rendered SPA, so every route would otherwise ship the
 * same empty <div id="root"> and the same <title>. Crawlers that don't execute
 * JS see nothing, and the ones that do still get one shared title for six
 * pages. This serves the built dist, visits each public route with a real
 * browser, and writes the fully rendered HTML back to disk as route/index.html.
 *
 * Cloudflare Workers assets serve those directory indexes automatically, so
 * /layanan now responds with its own title, description, and body copy.
 */
/* global process */
import { chromium } from 'playwright';
import { preview } from 'vite';
import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const ROUTES = ['/', '/tentang-kami', '/layanan', '/jadwal', '/galeri', '/kontak'];
const DIST = 'dist';
const PORT = 4178;

/** CI images often ship Playwright without its browser binaries. */
async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch (err) {
    if (!/Executable doesn't exist|browserType.launch/.test(err.message)) throw err;
    console.log('  Chromium missing, installing it for the prerender step...');
    execSync('npx playwright install chromium', { stdio: 'inherit' });
    return chromium.launch();
  }
}

const server = await preview({ preview: { port: PORT, strictPort: true } });
const browser = await launchBrowser();
const page = await browser.newPage();

let failed = 0;

for (const route of ROUTES) {
  try {
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#root > *', { timeout: 15000 });

    // Reveal-on-scroll sections start at opacity 0; mark them visible so the
    // saved HTML isn't a page of invisible text.
    await page.evaluate(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    });

    const html = await page.content();
    const title = await page.title();

    const outFile = route === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route.slice(1), 'index.html');

    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf8');

    console.log(`  ✓ ${route.padEnd(15)} ${title}`);
  } catch (err) {
    failed += 1;
    console.error(`  ✗ ${route} — ${err.message}`);
  }
}

await browser.close();
await server.close();

if (failed) {
  console.error(`\nPrerender failed for ${failed} route(s).`);
  process.exit(1);
}
console.log(`\nPrerendered ${ROUTES.length} routes.`);
