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
  for (const name of ['Home', 'About', 'Gallery', 'News', 'Contact']) {
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
  await expect(page.getByRole('link', { name: 'info@kumasa.example' }).first()).toHaveAttribute(
    'href',
    'mailto:info@kumasa.example',
  );
});
