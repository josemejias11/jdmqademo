import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { TestDataCleanup } from '../utils/testDataCleanup';
import { generateUniqueTask } from '../utils/helpers';

test.describe('Visual Regression Tests', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let cleanup: TestDataCleanup;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cleanup = new TestDataCleanup(page);
    await cleanup.cleanupTasks();
  });

  test('Login page visual comparison', async ({ page }) => {
    await loginPage.goto();
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('Dashboard empty state visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');
    await dashboardPage.goto();
    await cleanup.cleanupTasks();
    await expect(page).toHaveScreenshot('dashboard-empty.png');
  });

  test('Dashboard with tasks visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');
    await dashboardPage.goto();
    const task1 = generateUniqueTask('Task 1');
    const task2 = generateUniqueTask('Task 2');
    await dashboardPage.addTask(task1, 'First task');
    await dashboardPage.addTask(task2, 'Second task');
    // Wait for tasks to appear
    await expect(page.getByText(task1)).toBeVisible();
    await expect(page.getByText(task2)).toBeVisible();
    await expect(page).toHaveScreenshot('dashboard-with-tasks.png');
  });

  test('Task form visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');
    await dashboardPage.goto();
    await page.getByLabel('Title').click();
    await expect(page.locator('[data-testid="task-form"]')).toHaveScreenshot('task-form.png');
  });

  test('Error state visual comparison', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login('wrong', 'wrong');
    await expect(page).toHaveScreenshot('login-error.png');
  });
});
