import { test, expect } from '../fixtures/test-fixtures';
import { ApiClient } from '../api/api-client';
import { generateUnique } from '../utils/helpers';
import { config } from '../config/config';

/**
 * API Test Suite
 */
test.describe('API Tests', () => {
  let apiClient: ApiClient;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    apiClient = new ApiClient(request);

    try {
      // Get auth token for subsequent requests
      authToken = await apiClient.login(
        config.users.standard.username,
        config.users.standard.password
      );

      console.log('Successfully authenticated for API tests');
    } catch (error) {
      console.error('Failed to authenticate for API tests:', error);
    }
  });

  test.afterAll(async () => {
    try {
      // Clean up test tasks
      await apiClient.cleanupTestTasks();
    } catch (error) {
      console.error('Error cleaning up test tasks:', error);
    }
  });

  test('should authenticate and get JWT token', async () => {
    expect(authToken).toBeDefined();
    expect(authToken.length).toBeGreaterThan(10);
  });

  test('should create a task via API', async () => {
    const title = `API Test Task ${generateUnique()}`;
    const description = 'Task created via API test';

    const task = await apiClient.createTask(title, description);

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.title).toBe(title);
    expect(task.description).toBe(description);
    expect(task.completed).toBe(false);
  });

  test('should retrieve tasks via API', async () => {
    // Create a task first
    const title = `API Test Task ${generateUnique()}`;
    await apiClient.createTask(title, 'Task created for retrieval test');

    // Retrieve tasks
    const tasks = await apiClient.getTasks();

    // Verify tasks array
    expect(Array.isArray(tasks)).toBe(true);

    // Find our test task
    const testTask = tasks.find(task => task.title === title);
    expect(testTask).toBeDefined();
    expect(testTask.completed).toBe(false);
  });
});
