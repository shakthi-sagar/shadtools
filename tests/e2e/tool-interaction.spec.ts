import { test, expect } from '@playwright/test';

test.describe('ShadTools Key User Interactions', () => {
  test('Homepage loads and displays category cards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShadTools/);
    await expect(page.locator('h1')).toContainText('Free In-Browser Utility Tools');
  });

  test('JSON Formatter formats input correctly', async ({ page }) => {
    await page.goto('/developer-tools/json-formatter');
    await expect(page.locator('h1')).toContainText('JSON Formatter');

    const textarea = page.locator('textarea').first();
    await textarea.fill('{"key":"value"}');

    await page.click('button:has-text("Format JSON")');
    const outputTextarea = page.locator('textarea').nth(1);
    await expect(outputTextarea).toHaveValue(/{\n  "key": "value"\n}/);
  });
});
