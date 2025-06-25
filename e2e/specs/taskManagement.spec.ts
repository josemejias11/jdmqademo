import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { TestDataCleanup } from '../utils/testDataCleanup';

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
  });

  test.afterEach(async ({ page }) => {
    await cleanup.cleanupTasks();
  });

  test('should add a new task', async ({ page }) => {
    const taskTitle = 'Test task';
    const taskDescription = 'This is a test task';

    await dashboardPage.addTask(taskTitle, taskDescription);
    await expect(page.getByText(taskTitle)).toBeVisible();
    await expect(page.getByText(taskDescription)).toBeVisible();
  });

  test('should complete a task', async ({ page }) => {
    const taskTitle = 'Task to complete';
    await dashboardPage.addTask(taskTitle, 'Description');
    await dashboardPage.completeTask(taskTitle);
  });

  test('should delete a task', async ({ page }) => {
    const taskTitle = 'Task to delete';
    await dashboardPage.addTask(taskTitle, 'Description');
    await dashboardPage.deleteTask(taskTitle);
  });

  test('should handle empty task title', async ({ page }) => {
    await dashboardPage.addTask('', 'Description');
    await expect(page.getByText('Title is required')).toBeVisible();
  });

  test('should handle multiple tasks', async ({ page }) => {
    const tasks = [
      { title: 'Task 1', description: 'First task' },
      { title: 'Task 2', description: 'Second task' },
      { title: 'Task 3', description: 'Third task' }
    ];

    for (const task of tasks) {
      await dashboardPage.addTask(task.title, task.description);
    }

    for (const task of tasks) {
      await expect(page.getByText(task.title)).toBeVisible();
    }
  });
});
