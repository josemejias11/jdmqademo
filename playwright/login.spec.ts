import { test, expect } from '@playwright/test';

test('Login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('changeme');
    await page.getByRole('button', { name: /login/i }).click();

    // Expect to be redirected or see a dashboard heading
    await expect(page).toHaveURL(/\/dashboard/);  // adjust path as needed
    await expect(page.getByRole('heading', { name: /welcome, admin/i })).toBeVisible();
});