import { test, expect } from '@playwright/test';

test.describe('Task Management Flow', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000/login');
    await page.click('#username');
    await page.fill('#username', 'admin');
    await page.click('#password');
    await page.fill('#password', 'changeme');
    await page.click('.btn');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('complete task creation and management flow', async ({ page }) => {
    // Navigate to create task
    await page.click('text=Create Task');
    await expect(page).toHaveURL(/\/tasks\/new$/);
    await page.click('#title');
    await page.fill('#title', 'test 123');
    await page.click('#description');
    await page.fill('#description', 'test task');
    await page.click('button:has-text("Create Task")');

    // Edit task
    await page.click('.btn-sm:nth-child(2)');
    await page.click('#description');
    await page.fill('#description', 'test task 123');
    await page.click('button:has-text("Update Task")');

    // Navigate back to tasks list
    await page.click('a[href="/tasks"]');
    
    // Navigate to Dashboard using exact selector
    await page.click('a.nav-link[href="/dashboard"]');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('create task with maximum length inputs', async ({ page }) => {
    await page.click('text=Create Task');
    await expect(page).toHaveURL(/\/tasks\/new$/);
    
    const longTitle = 'A'.repeat(100);
    const longDescription = 'B'.repeat(500);
    
    await page.fill('#title', longTitle);
    await page.fill('#description', longDescription);
    await page.click('button:has-text("Create Task")');

    // Verify task was created
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.getByText(longTitle)).toBeVisible();
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
    // Create a task first
    await page.click('text=Create Task');
    await page.fill('#title', 'Task to complete');
    await page.fill('#description', 'This task will be marked as complete');
    await page.click('button:has-text("Create Task")');

    // Find and click the complete button
    await page.click('.btn-sm:nth-child(1)'); // Assuming first button is complete
    
    // Verify task is marked as complete
    await expect(page.getByText('Task to complete')).toHaveClass(/text-decoration-line-through/);
  });

  test('delete task', async ({ page }) => {
    // Create a task first
    await page.click('text=Create Task');
    await page.fill('#title', 'Task to delete');
    await page.fill('#description', 'This task will be deleted');
    await page.click('button:has-text("Create Task")');

    // Store the task text to verify deletion
    const taskText = 'Task to delete';

    // Find and click the delete button
    await page.click('.btn-sm:nth-child(3)'); // Assuming third button is delete
    
    // Accept the confirmation dialog if it appears
    page.on('dialog', dialog => dialog.accept());

    // Verify task is no longer visible
    await expect(page.getByText(taskText)).not.toBeVisible();
  });

  test('task statistics update correctly', async ({ page }) => {
    // Create a task
    await page.click('text=Create Task');
    await page.fill('#title', 'Statistics test task');
    await page.fill('#description', 'Testing task statistics');
    await page.click('button:has-text("Create Task")');

    // Go to dashboard
    await page.click('a.nav-link[href="/dashboard"]');

    // Check initial statistics
    await expect(page.getByText('Total Tasks')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Completed')).toBeVisible();

    // Go back to tasks and complete the task
    await page.click('a[href="/tasks"]');
    await page.click('.btn-sm:nth-child(1)'); // Complete button

    // Check updated statistics on dashboard
    await page.click('a.nav-link[href="/dashboard"]');
    await expect(page.locator('.progress-bar')).toBeVisible();
  });
});