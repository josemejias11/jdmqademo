import { test, expect, withLogin } from '../../fixtures/test-fixtures';
import { generateUnique } from '../../utils/helpers';

/**
 * Dashboard test suite
 */
test.describe('Dashboard', () => {
  // Use authentication fixture for all tests in this group
  const authenticatedTest = withLogin;

  authenticatedTest(
    'should display dashboard with correct components',
    async ({ dashboardPage }) => {
      await dashboardPage.goto();
      await dashboardPage.verifyDashboardComponents();
    }
  );

  authenticatedTest('should show correct statistics data', async ({ dashboardPage }) => {
    await dashboardPage.goto();

    const stats = await dashboardPage.getTaskStatistics();

    // Verify the stats object has the right structure
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('completed');
    expect(stats).toHaveProperty('pending');

    // Math should add up
    expect(stats.completed + stats.pending).toBe(stats.total);
  });

  authenticatedTest('should navigate to tasks page', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.navigateToAllTasks();

    // Verify we're on tasks page
    await expect(page).toHaveURL(/tasks$/);
  });

  authenticatedTest('should navigate to create task page', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.navigateToCreateTask();

    // Verify we're on task creation page
    await expect(page).toHaveURL(/tasks\/new/);
  });
});

/**
 * Dashboard task workflow integration test
 */
test.describe('Dashboard - Task Management', () => {
  // Use authentication fixture for all tests in this group
  const authenticatedTest = withLogin;

  authenticatedTest(
    'should create a task and see it reflected in dashboard stats',
    async ({ dashboardPage, tasksPage }) => {
      // Get initial stats
      await dashboardPage.goto();
      const initialStats = await dashboardPage.getTaskStatistics();

      // Create a new task
      await dashboardPage.navigateToCreateTask();
      const uniqueTaskTitle = `Test Task ${generateUnique()}`;

      await tasksPage.createTask({
        title: uniqueTaskTitle,
        description: 'Task created during dashboard test'
      });

      // Return to dashboard
      await dashboardPage.goto();

      // Check updated stats
      const updatedStats = await dashboardPage.getTaskStatistics();

      // Verify total increased by 1
      expect(updatedStats.total).toBe(initialStats.total + 1);

      // Verify pending increased by 1
      expect(updatedStats.pending).toBe(initialStats.pending + 1);

      // Completed should remain the same
      expect(updatedStats.completed).toBe(initialStats.completed);
    }
  );
});
