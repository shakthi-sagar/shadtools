import { test, expect } from '@playwright/test';

test('homepage renders main hero and tools list', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ShadTools/);
  await expect(page.locator('main h1').first()).toContainText('Everything you need');
  await expect(page.getByRole('heading', { name: 'Quick access' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'All tools' })).toBeVisible();
});
