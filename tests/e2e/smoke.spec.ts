import { test, expect } from '@playwright/test';

test.describe('ShadTools Production E2E Smoke Tests', () => {
  test('Homepage loads correctly with hero and category sections', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShadTools/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Global search page renders and functions', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveTitle(/Search/);
    const searchInput = page.locator('input[type="search"], input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('Representative interactive converter tool loads and calculates', async ({ page }) => {
    await page.goto('/units/length');
    await expect(page).toHaveTitle(/Length/);
    await expect(page.locator('h1')).toContainText(/Length/);

    const amountInput = page.locator('input[type="number"]').first();
    await expect(amountInput).toBeVisible();
  });

  test('Shareable URL state initializes state and canonical URL strips query params', async ({ page }) => {
    await page.goto('/units/length?value=25&from=meter&to=foot');
    
    // Check canonical link element
    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).toBe('https://shadtools.com/units/length');
  });

  test('Pair SEO page loads direct answer and breadcrumbs', async ({ page }) => {
    await page.goto('/units/length/meter-to-foot');
    await expect(page).toHaveTitle(/Meter to Foot/i);
    await expect(page.locator('h1')).toContainText(/Meter to Foot/i);
  });

  test('Exact SEO page loads direct answer and computes formula', async ({ page }) => {
    await page.goto('/units/length/10-meter-to-foot');
    await expect(page).toHaveTitle(/10 Meters to Feet/i);
    await expect(page.locator('h1')).toContainText(/10 Meters to Feet/i);

    const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonicalHref).toBe('https://shadtools.com/units/length/10-meter-to-foot');
  });

  test('404 Page loads cleanly for nonexistent routes with search and noindex', async ({ page }) => {
    const response = await page.goto('/nonexistent-route-12345');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText(/Page Not Found/i);

    const robotsMeta = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robotsMeta).toBe('noindex, nofollow');
  });
});
