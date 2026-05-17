import { test, expect } from '@playwright/test';

const BASE    = 'http://localhost:3001';
const VITE    = 'http://localhost:5173';
const USER    = 'admin';
const PASS    = 'motherlight2025';

// ── Helpers ────────────────────────────────────────────────────────────────────

async function apiLogin(request) {
  const res = await request.post(`${BASE}/api/auth/login`, {
    data: { username: USER, password: PASS },
  });
  expect(res.ok(), `Login failed: ${await res.text()}`).toBeTruthy();
  const { token } = await res.json();
  return token;
}

async function uiLogin(page) {
  await page.goto(`${VITE}/admin/login`);
  await page.waitForLoadState('domcontentloaded');
  await page.locator('input[type="text"]').fill(USER);
  await page.locator('input[type="password"]').fill(PASS);
  await page.locator('button[type="submit"]').click();
  // After login the app navigates to /admin/gallery; AdminLayout then verifies
  // the token before rendering — wait for the sidebar to confirm it's rendered.
  await page.waitForSelector('.admin-sidebar', { timeout: 15000 });
  await page.waitForSelector('.albums-grid-admin', { timeout: 15000 });
}

// ── API-level tests (fast, no browser needed) ──────────────────────────────────

test.describe('API – rename endpoint', () => {
  test('GET /api/gallery returns albums', async ({ request }) => {
    const res = await request.get(`${BASE}/api/gallery`);
    expect(res.ok()).toBeTruthy();
    const { albums } = await res.json();
    expect(Array.isArray(albums)).toBeTruthy();
    expect(albums.length).toBeGreaterThan(0);
    console.log('Albums:', albums.map(a => a.slug).join(', '));
  });

  test('POST /api/gallery/albums/:slug/rename renames the album', async ({ request }) => {
    const token = await apiLogin(request);

    // get first album
    const { albums } = await (await request.get(`${BASE}/api/gallery`)).json();
    const album = albums[0];
    const original = album.name;
    const renamed  = `${original} (test)`;

    // rename
    const res = await request.post(`${BASE}/api/gallery/albums/${album.slug}/rename`, {
      data: { name: renamed },
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    console.log(`Rename response [${res.status()}]:`, JSON.stringify(body));
    expect(res.ok(), `Rename failed: ${JSON.stringify(body)}`).toBeTruthy();
    expect(body.name).toBe(renamed);

    // restore
    await request.post(`${BASE}/api/gallery/albums/${album.slug}/rename`, {
      data: { name: original },
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  test('rename without auth returns 401', async ({ request }) => {
    const { albums } = await (await request.get(`${BASE}/api/gallery`)).json();
    const res = await request.post(`${BASE}/api/gallery/albums/${albums[0].slug}/rename`, {
      data: { name: 'hacked' },
    });
    expect(res.status()).toBe(401);
  });
});

// ── UI tests ───────────────────────────────────────────────────────────────────

test.describe('CMS UI – rename album', () => {
  test('rename from card list via button', async ({ page }) => {
    await uiLogin(page);

    const card = page.locator('.album-card-admin').first();
    const originalName = (await card.locator('.album-card-name').innerText()).trim();
    const newName = `${originalName} (ui test)`;

    await card.locator('button[title="Ubah nama"]').click();
    await expect(card.locator('input')).toBeVisible();
    await card.locator('input').fill(newName);
    await card.locator('button[title="Ubah nama"]').or(
      card.locator('button[type="button"]').last()
    ).first();
    // click the check/save button (last button inside the edit div)
    await card.locator('div > button[type="button"]').last().click();

    await expect(page.locator('.admin-toast.success')).toBeVisible({ timeout: 6000 });
    await expect(card.locator('.album-card-name')).toHaveText(newName);

    // restore
    await card.locator('button[title="Ubah nama"]').click();
    await card.locator('input').fill(originalName);
    await card.locator('div > button[type="button"]').last().click();
    await page.locator('.admin-toast.success').waitFor({ timeout: 6000 });
  });

  test('rename via Enter key cancels with Escape', async ({ page }) => {
    await uiLogin(page);

    const card = page.locator('.album-card-admin').first();
    const originalName = (await card.locator('.album-card-name').innerText()).trim();

    // Escape should NOT save
    await card.locator('button[title="Ubah nama"]').click();
    await card.locator('input').fill('should not save');
    await card.locator('input').press('Escape');
    await expect(card.locator('input')).not.toBeVisible();
    await expect(card.locator('.album-card-name')).toHaveText(originalName);

    // Enter should save
    const newName = `${originalName} (enter)`;
    await card.locator('button[title="Ubah nama"]').click();
    await card.locator('input').fill(newName);
    await card.locator('input').press('Enter');
    await expect(page.locator('.admin-toast.success')).toBeVisible({ timeout: 6000 });
    await expect(card.locator('.album-card-name')).toHaveText(newName);

    // Wait for toast to fully dismiss before triggering another rename
    await page.locator('.admin-toast.success').waitFor({ state: 'hidden', timeout: 5000 });

    // restore
    await card.locator('button[title="Ubah nama"]').click();
    await card.locator('input').fill(originalName);
    await card.locator('input').press('Enter');
    await expect(page.locator('.admin-toast.success')).toBeVisible({ timeout: 6000 });
  });
});
