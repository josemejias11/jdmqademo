import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';

test('Add a new task', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await dashboard.addTask('Test task', 'This is a test.');
  await expect(page.getByText('Test task')).toBeVisible();
});
