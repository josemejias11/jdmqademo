import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Visual regression test suite
 * Compares screenshots of key pages against baseline images
 */
test.describe('Visual Regression', () => {
  // Configure screenshot comparisons to be more strict
  test.use({
    screenshot: 'on'
  });

  test('login page visual appearance', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Take screenshot with name that includes browser
    await expect(page).toHaveScreenshot(`login-page-${test.info().project.name}.png`);

    // Test error state
    await loginPage.login('wronguser', 'wrongpass');
    await expect(page).toHaveScreenshot(`login-error-${test.info().project.name}.png`);
  });

  test('dashboard page visual appearance', async ({ loginPage, dashboardPage, page }) => {
    // Login first
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();

    // Verify dashboard loaded
    await dashboardPage.verifyPageLoaded();

    // Wait for animations to finish
    await page.waitForTimeout(500);

    // Take screenshot
    await expect(page).toHaveScreenshot(`dashboard-${test.info().project.name}.png`);
  });

  test('empty tasks list visual appearance', async ({ loginPage, tasksPage, page, cleanup }) => {
    // Login first
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();

    // Clean up any existing tasks to ensure empty state
    await cleanup.cleanupTasks();

    // Go to tasks page
    await tasksPage.goto();

    // Wait for animations to finish
    await page.waitForTimeout(500);

    // Take screenshot of empty tasks list
    await expect(page).toHaveScreenshot(`tasks-empty-${test.info().project.name}.png`);
  });

  test('task creation form visual appearance', async ({ loginPage, tasksPage, page }) => {
    // Login first
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();

    // Go to tasks page and navigate to create task form
    await tasksPage.goto();
    await tasksPage.navigateToCreateTask();

    // Wait for animations to finish
    await page.waitForTimeout(500);

    // Take screenshot of task creation form
    await expect(page).toHaveScreenshot(`task-creation-form-${test.info().project.name}.png`);
  });
});
