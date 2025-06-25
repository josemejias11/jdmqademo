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
    await loginPage.login('admin', 'changeme');
    await dashboardPage.goto();
    await cleanup.cleanupTasks();
  });

  test.afterEach(async () => {
    await cleanup.cleanupTasks();
  });

  test('should add a new task', async ({ page }) => {
    const taskTitle = generateUniqueTask('Test task');
    const taskDescription = 'This is a test task';
    await dashboardPage.addTask(taskTitle, taskDescription);
    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByText(taskDescription)).toBeVisible();
  });

  test('should complete a task', async ({ page }) => {
    const taskTitle = generateUniqueTask('Task to complete');
    await dashboardPage.addTask(taskTitle, 'Description');
    await dashboardPage.completeTask(taskTitle);
    // Optionally: check completed state
    const taskElement = page.getByText(taskTitle).locator('..');
    await expect(taskElement).toHaveClass(/completed/);
    await expect(taskElement.getByRole('checkbox')).toBeChecked();
  });

  test('should delete a task', async ({ page }) => {
    const taskTitle = generateUniqueTask('Task to delete');
    await dashboardPage.addTask(taskTitle, 'Description');
    await dashboardPage.deleteTask(taskTitle);
    await expect(page.getByText(taskTitle)).not.toBeVisible();
  });

  test('should handle empty task title', async ({ page }) => {
    await dashboardPage.addTask('', 'Description');
    await expect(page.getByText('Title is required')).toBeVisible();
  });

  test('should handle multiple tasks', async ({ page }) => {
    const tasks = [
      { title: generateUniqueTask('Task 1'), description: 'First task' },
      { title: generateUniqueTask('Task 2'), description: 'Second task' },
      { title: generateUniqueTask('Task 3'), description: 'Third task' }
    ];
    for (const task of tasks) {
      await dashboardPage.addTask(task.title, task.description);
    }
    for (const task of tasks) {
      await expect(page.getByText(task.title)).toBeVisible();
      await expect(page.getByText(task.description)).toBeVisible();
    }
  });
});
