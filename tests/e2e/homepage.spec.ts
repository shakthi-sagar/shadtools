import { test, expect } from '@playwright/test';

test('homepage renders main hero and tools list', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ShadTools/);
  await expect(page.locator('main h1').first()).toContainText(
    'Everyday tools, ready when you are.',
  );
  await expect(page.getByPlaceholder('What do you want to do?')).toBeVisible();
  await expect(page.getByPlaceholder('Search tools...')).toHaveCount(0);
});

test('homepage keeps search and reorder controls accessible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByPlaceholder('What do you want to do?')).toBeVisible();

  await page.getByRole('button', { name: 'Customize', exact: true }).click();
  await expect(page.getByRole('button', { name: /Move .* down/ }).first()).toBeVisible();
});
