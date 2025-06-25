import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { LoginPage } from '../pages/loginPage';
import { TestDataCleanup } from '../utils/testDataCleanup';
import { generateUniqueTask } from '../utils/helpers';

test.describe('Dashboard - Add Task', () => {
  let dashboard: DashboardPage;
  let loginPage: LoginPage;
  let cleanup: TestDataCleanup;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboard = new DashboardPage(page);
    cleanup = new TestDataCleanup(page);
    await loginPage.goto();
    await loginPage.login('admin', 'changeme');
    await dashboard.goto();
    await cleanup.cleanupTasks();
  });

  test.afterEach(async () => {
    await cleanup.cleanupTasks();
  });

  test('should add a new task and display it in the list', async ({ page }) => {
    const taskTitle = generateUniqueTask('Test task');
    const taskDescription = 'This is a test.';
    await dashboard.addTask(taskTitle, taskDescription);
    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByText(taskDescription)).toBeVisible();
    const taskElement = page.getByText(taskTitle).locator('..');
    await expect(taskElement).not.toHaveClass(/completed/);
    // Optionally: check for delete and complete controls
    await expect(taskElement.getByRole('button', { name: /delete/i })).toBeVisible();
    await expect(taskElement.getByRole('checkbox')).toBeVisible();
  });
});
