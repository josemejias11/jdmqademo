import { Page } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';

export class TestDataCleanup {
  constructor(private page: Page) {}

  async cleanupTasks() {
    const dashboard = new DashboardPage(this.page);
    await dashboard.goto();

    // Get all task elements
    const taskElements = await this.page.$$('[data-testid="task-item"]');
    
    // Delete each task
    for (const taskElement of taskElements) {
      const title = await taskElement.textContent();
      if (title) {
        await dashboard.deleteTask(title.trim());
      }
    }
  }

  async cleanupUserData() {
    // Add API call to cleanup user data if needed
    // This would typically be a call to your backend API
    try {
      await this.page.request.delete('/api/test/cleanup');
    } catch (error) {
      console.warn('Failed to cleanup user data:', error);
    }
  }
} 