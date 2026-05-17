#!/usr/bin/env node
/**
 * sync-gallery.js — Downloads gallery images from Google Drive and
 * places them into public/images/galeri/, then rewrites src/data/gallery.js.
 *
 * FIRST RUN (saves your Google login session):
 *   node scripts/sync-gallery.js --login
 *
 * SUBSEQUENT RUNS:
 *   node scripts/sync-gallery.js
 *
 * OPTIONS:
 *   --login     Open browser for manual login, then save session
 *   --headless  Run headless (not recommended for Drive — may trigger bot checks)
 *   --thumbs    Only download thumbnails, skip album photos
 *   --albums    Only download album photos, skip thumbnails
 */

import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

// ── Paths ────────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT        = path.join(__dirname, '..');
const SESSION_FILE = path.join(__dirname, 'drive-session.json');
const TMP_DIR     = path.join(ROOT, '.tmp-gallery');
const GALERI_DIR  = path.join(ROOT, 'public', 'images', 'galeri');
const THUMBS_DIR  = path.join(GALERI_DIR, 'thumbnails');
const GALLERY_DATA = path.join(ROOT, 'src', 'data', 'gallery.js');

// ── Drive folder IDs (from the URLs the client shared) ───────────────────────

const THUMBNAIL_FOLDER_ID = '1tzJlX8EqD6U2ATt3hlhHzLlZtHYnVAKm';
const PHOTOS_FOLDER_ID    = '1gSmqESyAJIQug-W2bSyGXUEcgxwIjrHz';

// ── Filename → slug maps ─────────────────────────────────────────────────────

// Drive thumbnail filename → target filename in public/images/galeri/thumbnails/
const THUMBNAIL_MAP = {
  'Baby Spa.png':                  'baby-spa.png',
  'facilities terapi wicara.png':  'terapi-wicara.png',
  'Lab.png':                       'laboratorium.png',
  'Obygin.png':                    'obgyn.png',
  'Pharmacy.png':                  'farmasi.png',
  'Playground.png':                'playground.png',
  'poli concelor menyusui.png':    'poli-konselor-menyusui.png',
  'Poli Specialis ANak.png':       'poli-spesialis-anak.png',
  'Poli Umum.png':                 'poli-umum.png',
  'Rawat inap.png':                'fasilitas-ranap.png',
};

// Drive subfolder name → URL slug (must match albums in gallery.js)
const ALBUM_SLUG_MAP = {
  'Baby SPA':               'baby-spa',
  'Facade':                 'facade',
  'Farmasi':                'farmasi',
  'Fasilitas Ranap':        'fasilitas-ranap',
  'Laboratorium':           'laboratorium',
  'Obgyn':                  'obgyn',
  'Pelayanan Bidan':        'pelayanan-bidan',
  'Playground':             'playground',
  'Poli Konselor Menyusui': 'poli-konselor-menyusui',
  'Poli Spesialis Anak':    'poli-spesialis-anak',
  'Poli Umum':              'poli-umum',
  'Terapi Wicara':          'terapi-wicara',
};

// ── CLI args ─────────────────────────────────────────────────────────────────

const args       = process.argv.slice(2);
const isLogin    = args.includes('--login');
const isHeadless = args.includes('--headless');
const thumbsOnly = args.includes('--thumbs');
const albumsOnly = args.includes('--albums');

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg)  { console.log(`\x1b[36m▸\x1b[0m ${msg}`); }
function ok(msg)   { console.log(`\x1b[32m✓\x1b[0m ${msg}`); }
function warn(msg) { console.log(`\x1b[33m⚠\x1b[0m ${msg}`); }
function err(msg)  { console.error(`\x1b[31m✗\x1b[0m ${msg}`); }

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extractZip(zipPath, destDir) {
  ensureDir(destDir);
  execSync(`unzip -o "${zipPath}" -d "${destDir}"`, { stdio: 'pipe' });
}

/** Flatten any extra nested folder that Drive sometimes wraps the zip in. */
function flattenExtracted(dir) {
  const entries = fs.readdirSync(dir);
  if (entries.length === 1) {
    const sub = path.join(dir, entries[0]);
    if (fs.statSync(sub).isDirectory()) {
      for (const f of fs.readdirSync(sub)) {
        fs.renameSync(path.join(sub, f), path.join(dir, f));
      }
      fs.rmdirSync(sub);
    }
  }
}

function waitForEnter(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, () => { rl.close(); resolve(); });
  });
}

// ── Drive interaction helpers ─────────────────────────────────────────────────

/** Navigate into a Drive folder and wait for the file list to settle. */
async function goToFolder(page, folderId) {
  await page.goto(`https://drive.google.com/drive/folders/${folderId}`, {
    waitUntil: 'networkidle',
    timeout: 30_000,
  });
  // Give Drive's React tree time to render the file list
  await page.waitForTimeout(2500);
}

/** Select all items in the current Drive folder view. */
async function selectAll(page) {
  // Click inside the file-list area first so the keyboard target is correct
  const listArea = page.locator('[role="main"]');
  await listArea.click();
  await page.keyboard.press('Control+a');
  await page.waitForTimeout(800);
}

/**
 * Click the Download action in the selection toolbar.
 * Drive renders the toolbar differently depending on what's selected, so we
 * try several selectors in order.
 */
async function clickDownload(page) {
  const candidates = [
    '[aria-label="Download"]',
    '[data-tooltip="Download"]',
    'button:has-text("Download")',
  ];

  for (const sel of candidates) {
    const btn = page.locator(sel).first();
    if (await btn.isVisible({ timeout: 2500 }).catch(() => false)) {
      await btn.click();
      return;
    }
  }

  // Fallback: "More actions" (⋮) menu → Download
  const moreBtn = page.locator('[aria-label="More actions"], [data-tooltip="More actions"]').first();
  if (await moreBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await moreBtn.click();
    await page.waitForTimeout(500);
    const menuItem = page.locator('[role="menuitem"]:has-text("Download")').first();
    await menuItem.click({ timeout: 5000 });
    return;
  }

  throw new Error('Could not locate a Download button. Drive UI may have changed.');
}

/**
 * Download all files in the given Drive folder.
 * Returns the local path of the saved zip.
 */
async function downloadDriveFolder(page, folderId, label) {
  log(`Navigating to "${label}" folder…`);
  await goToFolder(page, folderId);
  await selectAll(page);

  log(`  Starting download…`);
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 120_000 }),
    clickDownload(page),
  ]);

  // Drive shows a "Preparing download…" toast — wait for the actual file
  const zipPath = path.join(TMP_DIR, `${label}.zip`);
  await download.saveAs(zipPath);
  ok(`  Saved → ${path.relative(ROOT, zipPath)}`);
  return zipPath;
}

/**
 * Navigate into a named subfolder inside the current folder view.
 * Returns the subfolder's Drive folder ID (from the URL after navigation).
 */
async function enterSubfolder(page, parentFolderId, folderName) {
  await goToFolder(page, parentFolderId);

  // Try to find the folder item by name and double-click to navigate into it
  const item = page.locator(`[aria-label="${folderName}"], :text-is("${folderName}")`).first();
  if (!(await item.isVisible({ timeout: 5000 }).catch(() => false))) {
    throw new Error(`Subfolder "${folderName}" not found in folder ${parentFolderId}`);
  }
  await item.dblclick();
  await page.waitForTimeout(3000);

  // Extract the subfolder ID from the current URL
  const url = page.url();
  const match = url.match(/\/folders\/([^?/]+)/);
  if (!match) throw new Error(`Could not determine subfolder ID after entering "${folderName}"`);
  return match[1];
}

// ── Session management ────────────────────────────────────────────────────────

async function saveSession() {
  log('Launching browser for manual login…');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://accounts.google.com/signin');
  console.log('\n─────────────────────────────────────────────────────');
  console.log('  Log in to the Google account that has access to the');
  console.log('  Motherlight Drive folders, then come back here and');
  console.log('  press Enter to save the session.');
  console.log('─────────────────────────────────────────────────────\n');
  await waitForEnter('Press Enter after logging in… ');

  await context.storageState({ path: SESSION_FILE });
  ok(`Session saved → ${path.relative(ROOT, SESSION_FILE)}`);
  await browser.close();
}

// ── Main sync ─────────────────────────────────────────────────────────────────

async function syncGallery() {
  if (!fs.existsSync(SESSION_FILE)) {
    err('No saved session found. Run with --login first:\n  node scripts/sync-gallery.js --login');
    process.exit(1);
  }

  ensureDir(TMP_DIR);
  ensureDir(THUMBS_DIR);

  const browser = await chromium.launch({
    headless: isHeadless,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const context = await browser.newContext({
    storageState: SESSION_FILE,
    acceptDownloads: true,
  });
  const page = await context.newPage();

  try {
    // ── Thumbnails ─────────────────────────────────────────────────────────
    if (!albumsOnly) {
      log('── Downloading thumbnails ──');
      const zipPath = await downloadDriveFolder(page, THUMBNAIL_FOLDER_ID, 'thumbnails');
      const extractDir = path.join(TMP_DIR, 'thumbnails-extracted');
      extractZip(zipPath, extractDir);
      flattenExtracted(extractDir);

      let copied = 0;
      for (const [original, slugName] of Object.entries(THUMBNAIL_MAP)) {
        const src = path.join(extractDir, original);
        const dest = path.join(THUMBS_DIR, slugName);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          copied++;
        } else {
          warn(`  Thumbnail not found in zip: "${original}"`);
        }
      }
      ok(`Thumbnails placed: ${copied}/${Object.keys(THUMBNAIL_MAP).length}`);
    }

    // ── Album photos ───────────────────────────────────────────────────────
    if (!thumbsOnly) {
      log('── Downloading album photos ──');

      for (const [folderName, slug] of Object.entries(ALBUM_SLUG_MAP)) {
        log(`Album: ${folderName}`);

        let subFolderId;
        try {
          subFolderId = await enterSubfolder(page, PHOTOS_FOLDER_ID, folderName);
        } catch (e) {
          warn(`  Skipping "${folderName}": ${e.message}`);
          continue;
        }

        let zipPath;
        try {
          zipPath = await downloadDriveFolder(page, subFolderId, slug);
        } catch (e) {
          warn(`  Download failed for "${folderName}": ${e.message}`);
          continue;
        }

        const destDir = path.join(GALERI_DIR, slug);
        ensureDir(destDir);
        const extractDir = path.join(TMP_DIR, `${slug}-extracted`);
        extractZip(zipPath, extractDir);
        flattenExtracted(extractDir);

        // Copy all image files
        const imageExts = /\.(png|jpg|jpeg|webp|gif)$/i;
        const files = fs.readdirSync(extractDir).filter(f => imageExts.test(f)).sort();
        for (const f of files) {
          fs.copyFileSync(path.join(extractDir, f), path.join(destDir, f));
        }
        ok(`  ${files.length} photos → public/images/galeri/${slug}/`);
      }
    }

    // ── Rewrite gallery.js ─────────────────────────────────────────────────
    log('Updating src/data/gallery.js…');
    rewriteGalleryData();
    ok('gallery.js updated');

  } finally {
    await browser.close();
    // Clean up temp downloads
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
    log('Temp files cleaned up');
  }
}

// ── Rewrite gallery.js ────────────────────────────────────────────────────────

function rewriteGalleryData() {
  const imageExts = /\.(png|jpg|jpeg|webp|gif)$/i;

  const albumEntries = Object.entries(ALBUM_SLUG_MAP).map(([name, slug]) => {
    const thumbExists = fs.existsSync(path.join(THUMBS_DIR, `${slug}.png`));
    const thumbnailVal = thumbExists
      ? `'/images/galeri/thumbnails/${slug}.png'`
      : 'null';

    const albumDir = path.join(GALERI_DIR, slug);
    const photos = fs.existsSync(albumDir)
      ? fs.readdirSync(albumDir).filter(f => imageExts.test(f)).sort()
      : [];

    const photosLines = photos.length === 0
      ? '[]'
      : `[\n${photos.map(f => `    { src: '/images/galeri/${slug}/${f}', alt: '${name}' },`).join('\n')}\n  ]`;

    return `  {
    slug: '${slug}',
    name: '${name}',
    thumbnail: ${thumbnailVal},
    photos: ${photosLines},
  }`;
  });

  const content = `/*
  Gallery data — auto-generated by scripts/sync-gallery.js
  To refresh: node scripts/sync-gallery.js
*/

export const albums = [
${albumEntries.join(',\n')}
];
`;

  fs.writeFileSync(GALLERY_DATA, content, 'utf8');
}

// ── Entry point ───────────────────────────────────────────────────────────────

(async () => {
  try {
    if (isLogin) {
      await saveSession();
    } else {
      await syncGallery();
    }
  } catch (e) {
    err(e.message);
    process.exit(1);
  }
})();
