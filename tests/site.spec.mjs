import { test, expect } from '@playwright/test';

// These exercise the rendered app: the unit suites already own shelf geometry
// and rich-text parsing, but cannot detect hydration or CSS migration failures.
test.beforeEach(async ({ page }) => {
  page.on('pageerror', error => { throw error; });
});

for (const width of [390, 1280]) {
  test(`homepage and thoughts layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: "How's it going? While you're here..." })).toBeVisible();
    await page.getByRole('img', { name: 'stamp of my name' }).evaluate(image => image.decode());
    if (process.env.VISUAL_CHECK) await expect(page).toHaveScreenshot(`home-${width}.png`, { fullPage: true });
    await page.getByRole('link', { name: 'thoughts', exact: true }).click();
    await expect(page).toHaveURL('/thoughts');
    await expect(page.getByRole('link', { name: 'beijing travel notes', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'japan travel notes', exact: true })).toBeVisible();
    if (process.env.VISUAL_CHECK) await expect(page).toHaveScreenshot(`thoughts-${width}.png`, { fullPage: true });
  });
}

test('legacy URLs retain permanent redirects', async ({ request }) => {
  for (const [from, to] of [
    ['/blogs/japan', '/thoughts/japan'], ['/blog/beijing', '/thoughts/beijing'],
    ['/beijing', '/thoughts/beijing'], ['/library', '/thoughts/library'],
    ['/resume', '/resume.pdf'], ['/a2gs', 'https://matthewlee626.notion.site/a2gs'],
    ['/travels', 'https://matthewlee626.notion.site/travels'],
  ]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(308);
    expect(response.headers().location, from).toBe(to);
  }
});

test('bookshelf buttons and page-wide arrow keys select the neighboring book', async ({ page }) => {
  await page.goto('/thoughts/library');
  const selected = page.getByRole('button', { pressed: true });
  await expect(selected).toHaveCount(1);
  const first = await selected.getAttribute('aria-label');
  await page.getByRole('button', { name: 'Next book', exact: true }).click();
  await expect(selected).not.toHaveAttribute('aria-label', first);
  const next = await selected.getAttribute('aria-label');
  await page.getByRole('button', { name: 'Previous book', exact: true }).click();
  await expect(selected).toHaveAttribute('aria-label', first);
  await page.keyboard.press('ArrowRight');
  await expect(selected).toHaveAttribute('aria-label', next);
  await page.keyboard.press('ArrowLeft');
  await expect(selected).toHaveAttribute('aria-label', first);
  await expect(page.getByRole('link', { name: 'request', exact: true })).toHaveAttribute('href', /^https:\/\/x.com\//);
});

test('touch swipe advances one book and a reverse swipe restores it', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('pageerror', error => { throw error; });
  await page.goto('/thoughts/library');
  const selected = page.getByRole('button', { pressed: true });
  await expect(selected).toHaveCount(1);
  const first = await selected.getAttribute('aria-label');
  const cdp = await context.newCDPSession(page);
  async function swipe(from, to) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from, y: 400 }] });
    for (let step = 1; step <= 10; step++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from + (to - from) * step / 10, y: 400 }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await swipe(300, 100);
  await expect(selected).not.toHaveAttribute('aria-label', first);
  // Let the physical motion settle before starting an independent gesture.
  await page.waitForTimeout(1000);
  await swipe(100, 300);
  await expect(selected).toHaveAttribute('aria-label', first);
  await context.close();
});

for (const city of ['beijing', 'japan']) {
  test(`${city} map loads its worker and follows a place selected in the article`, async ({ page }) => {
    // Only the remote basemap is fixed; MapLibre, its worker, the GeoJSON sources,
    // React effects and real map controls still run. No third-party network is needed.
    await page.route('https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', route => route.fulfill({
      json: { version: 8, glyphs: 'https://maps.example.test/{fontstack}/{range}.pbf', sources: {}, layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#e8edf2' } }] },
    }));
    await page.route('https://maps.example.test/**', route => route.fulfill({ body: Buffer.alloc(0), contentType: 'application/x-protobuf' }));
    const worker = page.waitForResponse(response => response.url().endsWith('/maplibre/maplibre-gl-worker.mjs'));
    await page.goto(`/thoughts/${city}`);
    expect((await worker).status()).toBe(200);
    await expect(page.getByRole('button', { name: 'Zoom in', exact: true })).toBeVisible();
    const place = page.locator('article button[data-inline-location], article button[data-map-location]').first();
    await place.click();
    await expect(place).toHaveAttribute('aria-pressed', 'true');
    const link = page.getByRole('link', { name: /^Open .+ in (Amap|Google Maps)$/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', city === 'beijing' ? /^https:\/\/uri.amap.com\/marker\?/ : /^https:\/\/www.google.com\/maps\/search\/\?/);
    await page.keyboard.press('Escape');
    await expect(link).toHaveCount(0);
    await expect(page.locator('[data-theme="atlas"]').getByRole('alert')).toHaveCount(0);
  });
}
