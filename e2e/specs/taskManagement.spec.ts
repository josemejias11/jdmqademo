import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { TestDataCleanup } from '../utils/testDataCleanup';
import { generateUniqueTask } from '../utils/helpers';

test.describe('Task Management', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let cleanup: TestDataCleanup;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    cleanup = new TestDataCleanup(page);
    
    await loginPage.goto();
    await loginPage.loginWithDefaults();
    // Verify login was successful before proceeding
    await loginPage.verifySuccessfulLogin();
    await cleanup.cleanupTasks();
  });

  test.afterEach(async () => {
    await cleanup.cleanupTasks();
  });

  test('should add a new task successfully', async ({ page }) => {
    // Ensure we're on the dashboard
    await dashboardPage.verifyOnDashboard();
    
    const uniqueTitle = generateUniqueTask('Test task');
    const description = 'This is a test task';
    
    await dashboardPage.addTask(uniqueTitle, description);
    
    await expect(page.getByText(uniqueTitle)).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
  });

  test('should complete a task and verify status', async ({ page }) => {
    // Ensure we're on the dashboard
    await dashboardPage.verifyOnDashboard();
    
    const uniqueTitle = generateUniqueTask('Task to complete');
    
    await dashboardPage.addTask(uniqueTitle, 'Description');
    await dashboardPage.completeTask(uniqueTitle);
    
    const taskElement = page.getByText(uniqueTitle).locator('..');
    await expect(taskElement).toHaveClass(/completed/);
    await expect(taskElement.getByRole('checkbox')).toBeChecked();
  });

  test('should delete a task successfully', async ({ page }) => {
    // Ensure we're on the dashboard
    await dashboardPage.verifyOnDashboard();
    
    const uniqueTitle = generateUniqueTask('Task to delete');
    
    await dashboardPage.addTask(uniqueTitle, 'Description');
    await expect(page.getByText(uniqueTitle)).toBeVisible();
    
    await dashboardPage.deleteTask(uniqueTitle);
    await expect(page.getByText(uniqueTitle)).not.toBeVisible();
  });
});
