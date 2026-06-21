import { test, expect, withLogin } from '../../fixtures/test-fixtures';
import { generateUnique } from '../../utils/helpers';
import { TaskData } from '../../models/models';

/**
 * Task management test suite
 */
test.describe('Task Management', () => {
  // Use authentication fixture for all tests in this group
  const authenticatedTest = withLogin;

  authenticatedTest.beforeEach(
    async ({ dashboardPage, tasksPage, authenticated: _authenticated }) => {
      // Start from dashboard and navigate to tasks page using UI navigation
      await dashboardPage.goto();
      await dashboardPage.navigateToTasksViaNavbar();
      await tasksPage.verifyPageLoaded();
    }
  );

  authenticatedTest(
    'should create a new task successfully',
    async ({ tasksPage, dashboardPage: _dashboardPage, authenticated: _authenticated }) => {
      // Generate unique task title to avoid conflicts
      const uniqueTaskTitle = `Test Task ${generateUnique()}`;
      const taskDescription = 'Task created by automated test';

      // Create task
      await tasksPage.createTask({
        title: uniqueTaskTitle,
        description: taskDescription
      });

      // Verify task was created
      await tasksPage.verifyTaskExists(uniqueTaskTitle);
    }
  );

  authenticatedTest(
    'should toggle task completion status',
    async ({ tasksPage, dashboardPage: _dashboardPage, authenticated: _authenticated }) => {
      // Create a task first
      const uniqueTaskTitle = `Test Task ${generateUnique()}`;
      await tasksPage.createTask({
        title: uniqueTaskTitle,
        description: 'Task to test completion status'
      });

      // Verify initial state is not completed
      let isCompleted = await tasksPage.isTaskCompleted(uniqueTaskTitle);
      expect(isCompleted).toBeFalsy();

      // Toggle completion status
      await tasksPage.toggleTaskCompletion(uniqueTaskTitle);

      // Verify task is now completed
      isCompleted = await tasksPage.isTaskCompleted(uniqueTaskTitle);
      expect(isCompleted).toBeTruthy();

      // Toggle again
      await tasksPage.toggleTaskCompletion(uniqueTaskTitle);

      // Verify task is now uncompleted
      isCompleted = await tasksPage.isTaskCompleted(uniqueTaskTitle);
      expect(isCompleted).toBeFalsy();
    }
  );

  authenticatedTest(
    'should delete a task successfully',
    async ({ tasksPage, dashboardPage: _dashboardPage, authenticated: _authenticated }) => {
      // Create a task first
      const uniqueTaskTitle = `Test Task ${generateUnique()}`;
      await tasksPage.createTask({
        title: uniqueTaskTitle,
        description: 'Task to test deletion'
      });

      // Verify task exists
      await tasksPage.verifyTaskExists(uniqueTaskTitle);

      // Delete the task
      await tasksPage.deleteTask(uniqueTaskTitle);

      // Verify task no longer exists
      await tasksPage.verifyTaskDoesNotExist(uniqueTaskTitle);
    }
  );

  authenticatedTest(
    'should filter tasks by completion status',
    async ({
      tasksPage,
      cleanup,
      dashboardPage: _dashboardPage,
      authenticated: _authenticated
    }) => {
      // Create two tasks with different completion states
      const pendingTaskTitle = `Test Pending ${generateUnique()}`;
      const completedTaskTitle = `Test Completed ${generateUnique()}`;

      // Create pending task
      await tasksPage.createTask({
        title: pendingTaskTitle,
        description: 'Task that will remain pending'
      });

      // Create task that will be completed
      await tasksPage.createTask({
        title: completedTaskTitle,
        description: 'Task that will be marked as completed'
      });

      // Mark second task as completed
      await tasksPage.toggleTaskCompletion(completedTaskTitle);

      // Filter by completed tasks
      await tasksPage.filterTasks('completed');

      // Verify only completed task is visible
      await tasksPage.verifyTaskExists(completedTaskTitle);
      await tasksPage.verifyTaskDoesNotExist(pendingTaskTitle);

      // Filter by pending tasks
      await tasksPage.filterTasks('pending');

      // Verify only pending task is visible
      await tasksPage.verifyTaskExists(pendingTaskTitle);
      await tasksPage.verifyTaskDoesNotExist(completedTaskTitle);

      // Filter by all tasks
      await tasksPage.filterTasks('all');

      // Verify both tasks are visible
      await tasksPage.verifyTaskExists(pendingTaskTitle);
      await tasksPage.verifyTaskExists(completedTaskTitle);

      // Clean up both tasks to avoid test data pollution
      await cleanup.cleanupTasks();
    }
  );

  authenticatedTest(
    'should create task with maximum length values',
    async ({ tasksPage, dashboardPage: _dashboardPage, authenticated: _authenticated }) => {
      // Generate long title and description
      const longTitle = `Test Long Title ${generateUnique()} ${'A'.repeat(50)}`;
      const longDescription = 'Test Description\n' + 'A'.repeat(1000); // Intentionally over 500 chars

      // Create task with long values - this should fail validation
      const taskData: TaskData = {
        title: longTitle.substring(0, 100), // Trim to max allowed length
        description: longDescription
      };

      // Expect the task creation to fail with validation error
      await expect(async () => {
        await tasksPage.createTask(taskData);
      }).rejects.toThrow(/Description must be at most 500 characters/);
    }
  );
});
