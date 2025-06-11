import { test, expect } from '@playwright/test';

test.describe('UI Elements – Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
  });

  test('Page loads with login form and all required fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('Login button is disabled during loading', async ({ page }) => {
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('changeme');

    // Start login and immediately check if the button is disabled
    const loginButton = page.getByRole('button', { name: /login/i });
    await loginButton.click();
    await expect(loginButton).toBeDisabled();
  });

  test('Validation messages appear on blur', async ({ page }) => {
    await page.getByLabel('Username').click();
    await page.getByLabel('Password').click(); // triggers blur on Username
    await expect(page.getByText('Username is required')).toBeVisible();

    await page.getByLabel('Password').click();
    await page.getByLabel('Username').click(); // triggers blur on Password
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('Displays hint for default credentials', async ({ page }) => {
    await expect(page.getByText('Default: admin / changeme')).toBeVisible();
  });
});
