import { test, expect } from '@playwright/test';

test('JSON formatter page opens', async ({ page }) => {
  await page.goto('/json/formatter');
  await expect(page.locator('h1')).toContainText('JSON Formatter');
});
