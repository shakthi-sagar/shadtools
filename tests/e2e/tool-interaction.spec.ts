import { test, expect } from '@playwright/test';

test.describe('ShadTools Key User Interactions', () => {
  test('Homepage loads and displays category cards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShadTools/);
    await expect(page.locator('main h1').first()).toContainText(
      'Everyday tools, ready when you are.',
    );
  });

  test('JSON Formatter formats input correctly', async ({ page }) => {
    await page.goto('/json/formatter', { waitUntil: 'networkidle' });
    await expect(page.locator('main h1').first()).toContainText('JSON Formatter');

    const tool = page.locator('main');
    const textarea = tool.locator('textarea').first();
    await textarea.fill('{"key":"value"}');

    await tool.getByRole('button', { name: 'Format', exact: true }).click();
    const outputTextarea = tool.locator('textarea').nth(1);
    await expect(outputTextarea).toHaveValue(/{\n  "key": "value"\n}/);
  });
});
