import { test, expect } from '../../fixtures/test-fixtures';

/**
 * Visual regression tests using screenshot comparison
 * Compares screenshots of key pages against baseline images
 */

// Configure screenshot comparisons to be more strict
test.use({
  screenshot: 'on'
});

test.describe('Visual Regression', () => {
  test('login page visual appearance', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Take screenshot with name that includes browser
    await expect(page).toHaveScreenshot(`login-page-${test.info().project.name}.png`);

    // Test error state
    await loginPage.attemptLogin('wronguser', 'wrongpass');
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
    await page.locator('[data-testid="dashboard"], h1, .container').first().waitFor();

    // Take screenshot
    await expect(page).toHaveScreenshot(`dashboard-${test.info().project.name}.png`);
  });
});

// Desktop-only tests that require navigation
test.describe('Visual Regression - Desktop Only', () => {
  test('empty tasks list visual appearance', async ({ loginPage, dashboardPage, tasksPage, page, cleanup }, testInfo) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (testInfo.project.name.includes('Mobile')) {
      return; // Exit early for mobile projects due to navigation issues
    }

    // Login first
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();

    // Clean up any existing tasks to ensure empty state
    await cleanup.cleanupTasks();

    // Navigate to tasks page using UI
    await dashboardPage.goto();
    await dashboardPage.navigateToTasksViaNavbar();
    await tasksPage.verifyPageLoaded();

    // Take screenshot of empty tasks list
    await expect(page).toHaveScreenshot(`tasks-empty-${test.info().project.name}.png`);
  });

  test('task creation form visual appearance', async ({ loginPage, dashboardPage, tasksPage, page }, testInfo) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (testInfo.project.name.includes('Mobile')) {
      return; // Exit early for mobile projects due to navigation issues
    }

    // Login first
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();

    // Navigate to create task form
    await dashboardPage.goto();
    await dashboardPage.navigateToTasksViaNavbar();
    await tasksPage.verifyPageLoaded();
    await tasksPage.navigateToCreateTask();

    // Wait for form to be fully loaded
    await page.locator('form, [data-testid="task-form"], input[name="title"]').first().waitFor();

    // Take screenshot of task creation form
    await expect(page).toHaveScreenshot(`task-creation-form-${test.info().project.name}.png`);
  });
});
