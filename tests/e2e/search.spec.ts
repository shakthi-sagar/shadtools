import { test, expect } from '@playwright/test';

test('search page renders query input', async ({ page }) => {
  await page.goto('/search');
  await expect(page).toHaveTitle(/Search/);
});
