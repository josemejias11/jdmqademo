import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { TestDataCleanup } from '../utils/testDataCleanup';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let cleanup: TestDataCleanup;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cleanup = new TestDataCleanup(page);
    await cleanup.cleanupUserData(); // Clean up before test
    await loginPage.goto();
  });

  test.afterEach(async ({ page }) => {
    cleanup = new TestDataCleanup(page);
    await cleanup.cleanupUserData(); // Clean up after test
  });

  test('Valid login works', async () => {
    await loginPage.login('admin', 'changeme');
    await loginPage.verifySuccessfulLogin();
  });

  test('Invalid credentials show error message', async () => {
    await loginPage.login('wrong', 'wrong');
    await loginPage.verifyLoginError('Invalid username or password');
  });

  test('Empty username shows validation error', async ({ page }) => {
    await loginPage.login('', 'changeme');
    await expect(page.getByText('Username is required')).toBeVisible();
  });

  test('Empty password shows validation error', async ({ page }) => {
    await loginPage.login('admin', '');
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('Login form is accessible', async ({ page }) => {
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });
});
