import { test, expect, withLogin } from '../../fixtures/test-fixtures';
import { generateUnique } from '../../utils/helpers';

/**
 * Smoke test suite
 */
test.describe('Smoke Tests', () => {
  // Critical path tests for the application

  test('should load the login page', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.verifyPageLoaded();

    // Add explicit assertion for the URL
    await expect(page).toHaveURL(/login/);
  });

  test('should login successfully', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();

    // Add explicit assertion for successful login
    await expect(page).toHaveURL(/dashboard/);
  });

  const authenticatedTest = withLogin;

  authenticatedTest(
    'should display dashboard after login',
    async ({ dashboardPage, authenticated: _authenticated }) => {
      await dashboardPage.verifyPageLoaded();
      await dashboardPage.verifyDashboardComponents();
    }
  );

  authenticatedTest(
    'should navigate to tasks page',
    async ({ dashboardPage, tasksPage }) => {
      await dashboardPage.goto();
      // Use direct navigation for mobile-friendly approach
      await tasksPage.goto();
      await tasksPage.verifyPageLoaded();
    }
  );

  authenticatedTest(
    'should create and delete a task',
    async ({ dashboardPage, tasksPage }) => {
      await dashboardPage.goto();
      // Use direct navigation for mobile-friendly approach
      await tasksPage.goto();
      await tasksPage.verifyPageLoaded();

      const uniqueTaskTitle = `Smoke Test Task ${generateUnique()}`;

      // Create task
      await tasksPage.createTask({
        title: uniqueTaskTitle,
        description: 'Task created by smoke test'
      });

      // Verify task exists
      await tasksPage.verifyTaskExists(uniqueTaskTitle);

      // Delete task
      await tasksPage.deleteTask(uniqueTaskTitle);

      // Verify task was deleted
      await tasksPage.verifyTaskDoesNotExist(uniqueTaskTitle);
    }
  );

  // Complete user journey test
  test('should complete critical user journey', async ({ loginPage, dashboardPage, tasksPage }) => {
    // 1. Login
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();

    // 2. View dashboard
    await dashboardPage.verifyDashboardComponents();
    const initialStats = await dashboardPage.getTaskStatistics();

    // 3. Create a task
    await dashboardPage.navigateToCreateTask();
    const uniqueTaskTitle = `Journey Test ${generateUnique()}`;
    await tasksPage.createTask({
      title: uniqueTaskTitle,
      description: 'Task created during critical user journey'
    });

    // 4. Verify task appears in list
    await tasksPage.verifyTaskExists(uniqueTaskTitle);

    // 5. Mark task as completed
    await tasksPage.toggleTaskCompletion(uniqueTaskTitle);
    const isCompleted = await tasksPage.isTaskCompleted(uniqueTaskTitle);
    expect(isCompleted).toBeTruthy();

    // 6. Return to dashboard and verify stats updated
    await tasksPage.navigateToDashboard();
    await dashboardPage.verifyPageLoaded();
    const updatedStats = await dashboardPage.getTaskStatistics();

    expect(updatedStats.total).toBeGreaterThanOrEqual(initialStats.total + 1);
    expect(updatedStats.completed).toBeGreaterThanOrEqual(initialStats.completed + 1);

    // 7. Logout
    await dashboardPage.logout();
    await loginPage.verifyLoggedOut();
  });
});
