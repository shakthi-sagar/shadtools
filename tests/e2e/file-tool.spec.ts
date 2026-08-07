import { test, expect } from '@playwright/test';

test('Image compressor page opens', async ({ page }) => {
  await page.goto('/images/compress');
  await expect(page.locator('h1')).toContainText('Image Compressor');
});
