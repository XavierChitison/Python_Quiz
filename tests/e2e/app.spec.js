import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('opens dashboard and navigates to problem library', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Xavier's Python Challenge/);
  await expect(page.getByRole('heading', {name:/Welcome back/})).toBeVisible();
  await page.getByRole('link', {name:'Problem Library'}).click();
  await expect(page.getByRole('heading', {name:'Practice Problems'})).toBeVisible();
});

test('dashboard has no automatically detectable serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact));
  expect(serious).toEqual([]);
});

test('guest access and brand are visible without payment or authentication', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('100% free. Learn at your own pace.')).toBeVisible();
  await expect(page.getByLabel('Primary navigation')).toBeVisible();
  await expect(page.getByText(/Stripe|PayPal|Subscription|Upgrade|Premium/i)).toHaveCount(0);
});
