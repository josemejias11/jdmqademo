import { APIRequestContext } from '@playwright/test';
import { config } from '@config/config';

/**
 * API-based test data cleanup.
 * Deletes tasks whose title contains "Test" via the REST API — faster and
 * more reliable than driving the delete modal through the browser.
 */
export class TestDataCleanup {
  private token: string | null = null;

  constructor(private readonly request: APIRequestContext) {}

  /**
   * Authenticate with the API using the default admin credentials.
   * Must be called before cleanupTasks().
   */
  async authenticate(): Promise<void> {
    const res = await this.request.post(`${config.apiUrl}/api/auth/login`, {
      data: { username: config.users.admin.username, password: config.users.admin.password }
    });
    if (!res.ok()) {
      console.warn('TestDataCleanup.authenticate: login failed, cleanup will be skipped');
      return;
    }
    this.token = (await res.json()).token ?? null;
  }

  /**
   * Delete all tasks whose title contains "Test".
   */
  async cleanupTasks(): Promise<void> {
    if (!this.token) await this.authenticate();
    if (!this.token) return;

    const headers = {
      Authorization: `Bearer ${this.token}`,
      ...(process.env.TEST_SESSION_ID
        ? { 'x-test-session-id': process.env.TEST_SESSION_ID }
        : {})
    };

    const listRes = await this.request.get(`${config.apiUrl}/api/tasks`, { headers });
    if (!listRes.ok()) {
      console.warn('TestDataCleanup.cleanupTasks: could not fetch tasks');
      return;
    }

    const tasks: Array<{ id: string; title: string }> = (await listRes.json()).data ?? [];
    const testTasks = tasks.filter(t => /Test/.test(t.title));

    if (testTasks.length === 0) {
      console.log('TestDataCleanup: no test tasks to remove');
      return;
    }

    console.log(`TestDataCleanup: removing ${testTasks.length} test task(s)`);
    for (const task of testTasks) {
      await this.request.delete(`${config.apiUrl}/api/tasks/${task.id}`, { headers });
    }
  }
}
