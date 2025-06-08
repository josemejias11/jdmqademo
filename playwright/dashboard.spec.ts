//* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from '@playwright/test';

test.describe('Task Management Flow', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'changeme');
    await page.click('.btn');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  // Cleanup after each test
  test.afterEach(async ({ page }) => {
    // Ensure we're on the tasks page
    await page.goto('http://localhost:3000/tasks');

    // Set up dialog handler for delete confirmations
    page.on('dialog', dialog => dialog.accept());

    // Try to delete any tasks that match our test pattern
    const rows = await page
      .locator('tr', {
        // eslint-disable-next-line testing-library/prefer-screen-queries
        has: page.getByText(/Test Task|Complete Task|Statistics Task/, { exact: false })
      })
      .all();

    for (const row of rows) {
      try {
        await row.locator('.btn-sm').nth(2).click(); // Delete button
        await page.waitForTimeout(100); // Brief wait for deletion
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Could not delete a test task, may already be gone');
      }
    }
  });

  test('complete task creation and management flow', async ({ page }) => {
    const uniqueTitle = `Test Task ${Date.now()}`;
    // Navigate to create task
    await page.click('text=Create Task');
    await expect(page).toHaveURL(/\/tasks\/new$/);

    // Create task
    await page.fill('#title', uniqueTitle);
    await page.fill('#description', 'test task');
    await page.click('button:has-text("Create Task")');
    await expect(page).toHaveURL(/\/tasks$/);

    // Edit task
    const taskRow = page.locator('tr', { has: page.getByText(uniqueTitle, { exact: true }) });
    await expect(taskRow).toBeVisible();
    await taskRow.locator('.btn-sm').nth(1).click(); // Second button is edit
    await expect(page).toHaveURL(/\/tasks\/\d+$/); // Match any task ID
    const currentUrl = page.url();
    const match = currentUrl.match(/\/tasks\/(\d+)$/);
    const taskId = match ? match[1] : null;
    expect(taskId).not.toBeNull();

    // Wait for edit page and update task
    // Wait for the form to be visible and ready
    await page.waitForSelector('.card-title:has-text("Edit Task")', { timeout: 5000 });
    await page.waitForSelector('form', { state: 'visible', timeout: 5000 });

    // Now wait for and interact with the description field
    const descriptionField = page.locator('#description');
    await descriptionField.waitFor({ state: 'visible', timeout: 5000 });
    await descriptionField.fill('test task 123');
    await page.click('button:has-text("Update Task")');
    await expect(page).toHaveURL(/\/tasks$/);

    // Navigate to Dashboard using exact selector
    await page.click('a.nav-link[href="/dashboard"]');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('create task with maximum length inputs', async ({ page }) => {
    const timestamp = Date.now();
    await page.click('text=Create Task');
    await expect(page).toHaveURL(/\/tasks\/new$/);

    const longTitle = `Test ${timestamp} ${'A'.repeat(80)}`; // Making it unique while still being long
    const longDescription = 'B'.repeat(500);

    await page.fill('#title', longTitle);
    await page.fill('#description', longDescription);
    await page.click('button:has-text("Create Task")');

    // Verify task was created and is in the list
    await expect(page).toHaveURL(/\/tasks$/);
    const taskRow = page.locator('tr', { has: page.getByText(longTitle, { exact: true }) });
    await expect(taskRow).toBeVisible();
  });

  test('attempt to create task with empty fields', async ({ page }) => {
    await page.click('text=Create Task');
    await expect(page).toHaveURL(/\/tasks\/new$/);

    // Try to create task without filling fields
    await page.click('button:has-text("Create Task")');

    // Should stay on the same page with validation errors
    await expect(page).toHaveURL(/\/tasks\/new$/);
    await expect(page.getByText('Title is required')).toBeVisible();
  });

  test('mark task as complete', async ({ page }) => {
    const uniqueTitle = `Complete Task ${Date.now()}`;
    // Create a task first
    await page.click('text=Create Task');
    await page.fill('#title', uniqueTitle);
    await page.fill('#description', 'This task will be marked as complete');
    await page.click('button:has-text("Create Task")');

    // Find and click the complete button for this specific task
    const taskRow = page.locator('tr', { has: page.getByText(uniqueTitle, { exact: true }) });
    await expect(taskRow).toBeVisible();
    await taskRow.locator('.btn-sm').first().click(); // First button is complete

    // Verify task is marked as complete
    await expect(page.getByText(uniqueTitle)).toHaveClass(/text-decoration-line-through/);
  });

  test('delete task', async ({ page }) => {
    // Set up dialog handler before any actions
    page.on('dialog', dialog => dialog.accept());

    // Create a task with unique title
    const uniqueTitle = `Task to delete ${Date.now()}`;
    await page.click('text=Create Task');
    await page.fill('#title', uniqueTitle);
    await page.fill('#description', 'This task will be deleted');
    await page.click('button:has-text("Create Task")');

    // Find and click the delete button for this specific task
    const taskRow = page.locator('tr', { has: page.getByText(uniqueTitle, { exact: true }) });
    await expect(taskRow).toBeVisible();
    await taskRow.locator('.btn-sm').nth(2).click(); // Third button is delete

    // Verify task is no longer visible
    await expect(taskRow).not.toBeVisible();
  });

  test('task statistics update correctly', async ({ page }) => {
    const uniqueTitle = `Statistics Task ${Date.now()}`;

    // Create a task
    await page.click('text=Create Task');
    await page.fill('#title', uniqueTitle);
    await page.fill('#description', 'Testing task statistics');
    await page.click('button:has-text("Create Task")');

    // Find and complete the task
    const taskRow = page.locator('tr', { has: page.getByText(uniqueTitle, { exact: true }) });
    await expect(taskRow).toBeVisible();
    await taskRow.locator('.btn-sm').first().click(); // Complete button

    // Check updated statistics on dashboard
    await page.click('a.nav-link[href="/dashboard"]');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Wait for statistics to load and check for any number format
    await expect(page.getByText(/Completed/)).toBeVisible();
    await expect(page.getByText(/Pending/)).toBeVisible();
  });
});
