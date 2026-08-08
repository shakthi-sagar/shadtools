import { test, expect } from '@playwright/test';

test('homepage renders main hero and tools list', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ShadTools/);
  await expect(page.locator('main h1').first()).toHaveText('Your toolbox');
  await expect(page.getByRole('heading', { name: 'Pinned tools' })).toBeVisible();
});
