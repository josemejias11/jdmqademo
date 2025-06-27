import { Page, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { TEST_CONFIG } from './testConfig';
import { retryAction } from './helpers';

/**
 * Comprehensive test data cleanup utility
 * Handles cleanup of tasks, user sessions, and browser state
 */
export class TestDataCleanup {
  constructor(private page: Page) {}

  /**
   * Clean up all tasks from the dashboard
   */
  async cleanupTasks(): Promise<void> {
    try {
      // First clear storage to ensure we start fresh
      await this.cleanupUserSession();
      
      // Then try to navigate to dashboard - but it might redirect to login if not authenticated
      const dashboard = new DashboardPage(this.page);
      
      try {
        await dashboard.goto();
      } catch (authError) {
        // If we can't reach dashboard (likely due to auth), that's fine for cleanup
        // The tasks will be cleaned when the app restarts anyway
        console.log('Could not access dashboard for task cleanup (likely not authenticated)');
        return;
      }

      // Wait for tasks to load
      await this.page.waitForLoadState('networkidle');
      
      // Get all task elements with retry logic
      const taskElements = await retryAction(async () => {
        const elements = await this.page.$$(TEST_CONFIG.SELECTORS.TASK_ITEM);
        return elements;
      });

      if (taskElements.length === 0) {
        return; // No tasks to clean up
      }

      // Delete each task with error handling
      for (const taskElement of taskElements) {
        try {
          const titleElement = await taskElement.$('h5, .task-title, [data-testid="task-title"]');
          const title = titleElement ? await titleElement.textContent() : null;
          
          if (title?.trim()) {
            await dashboard.deleteTask(title.trim());
            // Small delay to prevent rapid-fire deletions
            await this.page.waitForTimeout(500);
          }
        } catch (error) {
          // Log but don't fail the entire cleanup for individual task failures
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Failed to delete individual task: ${error}`);
          }
        }
      }

      // Verify all tasks are deleted
      await expect(this.page.locator(TEST_CONFIG.SELECTORS.TASK_ITEM)).toHaveCount(0, { timeout: 10000 });
      
    } catch (error) {
      // Non-critical failure - log but don't throw
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Task cleanup encountered errors:', error);
      }
    }
  }

  /**
   * Clean up user session data
   */
  async cleanupUserSession(): Promise<void> {
    try {
      // Clear browser storage - wrap in try/catch to handle destroyed contexts
      try {
        await this.page.evaluate(() => {
          localStorage.clear();
          sessionStorage.clear();
        });
      } catch (evalError) {
        // Context might be destroyed due to navigation, that's ok
        console.log('Storage cleanup skipped (context destroyed)');
      }

      // Clear cookies
      try {
        const context = this.page.context();
        await context.clearCookies();
      } catch (cookieError) {
        console.log('Cookie cleanup failed:', cookieError);
      }

    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Session cleanup failed:', error);
      }
    }
  }

  /**
   * Clean up user data via API (if available)
   */
  async cleanupUserData(): Promise<void> {
    try {
      const response = await this.page.request.delete('/api/test/cleanup', {
        timeout: TEST_CONFIG.TIMEOUTS.MEDIUM
      });
      
      if (!response.ok()) {
        throw new Error(`API cleanup failed with status: ${response.status()}`);
      }
    } catch (error) {
      // API cleanup is optional - many test environments won't have this endpoint
      if (process.env.NODE_ENV !== 'production') {
        console.warn('API cleanup not available or failed:', error);
      }
    }
  }

  /**
   * Comprehensive cleanup - runs all cleanup methods
   */
  async cleanupAll(): Promise<void> {
    await Promise.allSettled([
      this.cleanupTasks(),
      this.cleanupUserSession(),
      this.cleanupUserData()
    ]);
  }

  /**
   * Reset page to known good state
   */
  async resetPageState(): Promise<void> {
    try {
      // Navigate to login page to ensure clean state
      await this.page.goto(TEST_CONFIG.URLS.LOGIN);
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to reset page state:', error);
      }
    }
  }
}
