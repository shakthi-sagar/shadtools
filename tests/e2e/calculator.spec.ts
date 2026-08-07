import { test, expect } from '@playwright/test';

test('Percentage calculator page opens', async ({ page }) => {
  await page.goto('/percentage/calculator');
  await expect(page.locator('h1')).toContainText('Percentage Calculator');
});
