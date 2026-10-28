import { expect, test } from '@playwright/test';

const routes = ['/', '/about', '/gallery', '/news', '/news/2026-10-12-team-named-for-the-national-open', '/contact'];

for (const route of routes) {
  test(`${route} returns 200 with one h1 and no failed requests`, async ({ page }) => {
    const failed: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
    });
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await page.waitForLoadState('networkidle');
    expect(failed).toEqual([]);
  });
}

test('an unknown path returns 404 and shows the not-found page', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/page not found/i);
  await expect(page.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
});

test('no route scrolls horizontally at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, route).toBe(false);
  }
});

test('desktop navigation reaches the gallery', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Gallery' }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/gallery/i);
});

test('lightbox opens, ArrowRight advances, Escape closes and focus returns', async ({ page }) => {
  await page.goto('/gallery');
  const thumb = page.getByRole('button', { name: /^View larger/ }).nth(1);
  await thumb.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('p[aria-live]')).toHaveText(/^2 \//);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('p[aria-live]')).toHaveText(/^3 \//);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(thumb).toBeFocused();
});

test('mobile menu opens full-screen with its links inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav).toBeVisible();
  for (const name of ['About', 'Events', 'Gallery', 'News', 'Join a club']) {
    const box = await nav.getByRole('link', { name }).boundingBox();
    expect(box, name).not.toBeNull();
    expect(box!.y).toBeGreaterThan(80);
    expect(box!.y + box!.height).toBeLessThan(844);
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});

test('contact page offers an email link when no form endpoint is configured', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: 'info@kumasa.ph' }).first()).toHaveAttribute(
    'href',
    'mailto:info@kumasa.ph',
  );
});

test('the name writer on the home page writes a typed name in Baybayin', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name in Baybayin, as on our badge').fill('Ana');
  await expect(page.locator('[lang="tl-Tglg"]')).toHaveText('ᜀᜈ');
});

test('the home page lists the coming events', async ({ page }) => {
  await page.goto('/');
  const events = page.getByRole('region', { name: 'Coming up' });
  // Past events drop off at each build: the section shows either the list or its empty sentence.
  await expect(
    events.getByRole('listitem').first().or(events.getByText('No events announced yet.')),
  ).toBeVisible();
});

test('the Events link from another page lands on the events section', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Events' }).click();
  await expect(page).toHaveURL(/\/#events$/);
  await expect(page.locator('#events')).toBeInViewport();
});

for (const [width, height] of [[390, 900], [1440, 900], [844, 390]]) {
  test(`no page title sits under the header at ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await page.goto(route);
      const header = await page.getByRole('banner').first().boundingBox();
      const h1 = await page.locator('h1').boundingBox();
      expect(h1!.y, route).toBeGreaterThanOrEqual(header!.y + header!.height);
    }
  });
}

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the hero letters are all visible at once', async ({ page }) => {
    await page.goto('/');
    const opacities = await page
      .locator('#hero-title span')
      .evaluateAll((spans) => spans.map((span) => getComputedStyle(span).opacity));
    expect(opacities).toEqual(['1', '1', '1', '1', '1', '1']);
  });
});

test('the skip link is not covered by the header when focused', async ({ page }) => {
  await page.goto('/about');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  const box = (await skip.boundingBox())!;
  const onTop = await page.evaluate(
    ([x, y]) => document.elementFromPoint(x, y)?.closest('a')?.textContent,
    [box.x + box.width - 6, box.y + box.height / 2],
  );
  expect(onTop).toBe('Skip to content');
});

test('a long article title stays within two lines on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/news/2026-10-12-team-named-for-the-national-open');
  const lines = await page.locator('h1').evaluate((h1) => {
    h1.textContent = 'KUMASA fighters take five golds at the Visayas Open';
    return Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
  });
  expect(lines).toBeLessThanOrEqual(2);
});

test('the officers strip spans the page width on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const items = page.getByRole('region', { name: 'Our officers' }).getByRole('listitem');
  const last = (await items.last().boundingBox())!;
  expect(last.x + last.width).toBeGreaterThan(1440 - 40 - 4);
});
