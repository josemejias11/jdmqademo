import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';

test.describe('Visual Regression Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('Login page visual comparison', async ({ page }) => {
    await loginPage.goto();
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('Dashboard empty state visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');
    await expect(page).toHaveScreenshot('dashboard-empty.png');
  });

  test('Dashboard with tasks visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');

    // Add some tasks
    await dashboardPage.addTask('Task 1', 'First task');
    await dashboardPage.addTask('Task 2', 'Second task');

    // Take screenshot of the dashboard with tasks
    await expect(page).toHaveScreenshot('dashboard-with-tasks.png');
  });

  test('Task form visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');

    // Focus on the task form
    await page.getByLabel('Title').click();
    await expect(page.locator('[data-testid="task-form"]')).toHaveScreenshot('task-form.png');
  });

  test('Error state visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('wrong', 'wrong');
    await expect(page).toHaveScreenshot('login-error.png');
  });
});
