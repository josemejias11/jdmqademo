import { APIRequestContext, request } from '@playwright/test';
import { config } from '../config/config';

/**
 * API client for interacting with the backend API
 */
export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(private apiContext?: APIRequestContext) {
    this.baseUrl = config.apiUrl;
  }

  /**
   * Login via API and get authentication token
   * @param username Username for login
   * @param password Password for login
   * @returns Authentication token
   */
  async login(username: string, password: string): Promise<string | null> {
    const apiContext =
      this.apiContext ||
      (await request.newContext({
        baseURL: this.baseUrl
      }));

    const response = await apiContext.post('/auth/login', {
      data: {
        username,
        password
      }
    });

    if (!response.ok()) {
      throw new Error(`Login failed with status ${response.status()}: ${await response.text()}`);
    }

    const data = await response.json();
    this.token = data.token;

    return this.token;
  }

  /**
   * Create a task via API
   * @param title Task title
   * @param description Task description
   * @returns Created task data
   */
  async createTask(title: string, description: string): Promise<any> {
    if (!this.token) {
      throw new Error('Must be authenticated to create tasks. Call login() first.');
    }

    const apiContext =
      this.apiContext ||
      (await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      }));

    const response = await apiContext.post('/tasks', {
      data: {
        title,
        description,
        completed: false
      }
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create task with status ${response.status()}: ${await response.text()}`
      );
    }

    return await response.json();
  }

  /**
   * Get all tasks via API
   * @returns Array of tasks
   */
  async getTasks(): Promise<any[]> {
    if (!this.token) {
      throw new Error('Must be authenticated to get tasks. Call login() first.');
    }

    const apiContext =
      this.apiContext ||
      (await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      }));

    const response = await apiContext.get('/tasks');

    if (!response.ok()) {
      throw new Error(
        `Failed to get tasks with status ${response.status()}: ${await response.text()}`
      );
    }

    return await response.json();
  }

  /**
   * Delete all test tasks via API
   * @returns Number of tasks deleted
   */
  async cleanupTestTasks(): Promise<number> {
    if (!this.token) {
      throw new Error('Must be authenticated to delete tasks. Call login() first.');
    }

    const apiContext =
      this.apiContext ||
      (await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      }));

    const tasks = await this.getTasks();
    const testTasks = tasks.filter(task => task.title.includes('Test'));
    let deleted = 0;

    for (const task of testTasks) {
      const response = await apiContext.delete(`/tasks/${task.id}`);

      if (response.ok()) {
        deleted++;
      }
    }

    return deleted;
  }
}
