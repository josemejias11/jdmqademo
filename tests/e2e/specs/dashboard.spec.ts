import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';

test.describe('Dashboard Task Management', () => {
  test.beforeEach(async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.navigate();
  });

  test('Add a new task successfully', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const title = `Task ${Date.now()}`;
    const description = 'A test description';

    await dashboard.addTask(title, description);
    await dashboard.assertTaskExists(title);
  });

  test('Display multiple tasks', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.addTask('Task 1', 'Description 1');
    await dashboard.addTask('Task 2', 'Description 2');

    const taskCount = await dashboard.getTaskRowsCount();
    expect(taskCount).toBeGreaterThanOrEqual(2);
  });

  test('Remove all tasks', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.addTask('Cleanup 1', 'Remove test');
    await dashboard.removeAllTasks();

    const remaining = await dashboard.getTaskRowsCount();
    expect(remaining).toBe(0);
  });

  test('Validate empty inputs', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.clickElement(dashboard.addButton);

    await expect(dashboard.taskInput).toHaveClass(/is-invalid/);
    await expect(dashboard.descriptionInput).toHaveClass(/is-invalid/);
  });
});