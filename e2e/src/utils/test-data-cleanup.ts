import { Page, expect } from '@playwright/test';
import { config } from '../config/config';
import { retry } from './helpers';

/**
 * Data cleanup utility for removing test data
 */
export class TestDataCleanup {
  constructor(private page: Page) {}
  
  /**
   * Clean up tasks created during tests
   */
  async cleanupTasks(): Promise<void> {
    try {
      // Navigate to tasks page
      await this.page.goto(`${config.baseUrl}/tasks`);
      
      // Check if we're authenticated and on the tasks page
      if (!this.page.url().includes('/tasks')) {
        console.log('Not on tasks page, skipping task cleanup');
        return;
      }
      
      // Look for tasks with "Test" in the name (assuming test tasks have this marker)
      const testTasks = this.page.getByText(/Test.*-[0-9]+/);
      
      if (await testTasks.count() === 0) {
        console.log('No test tasks found to clean up');
        return;
      }
      
      console.log(`Found ${await testTasks.count()} test tasks to clean up`);
      
      // Get all delete buttons for test tasks
      const deleteButtons = this.page.getByRole('button', { name: /delete/i });
      const count = await deleteButtons.count();
      
      // Click each delete button and confirm deletion
      for (let i = 0; i < count; i++) {
        try {
          // Always get the first delete button since the list shifts after each deletion
          const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();
          await deleteButton.click();
          
          // Handle confirmation if there is one
          const confirmButton = this.page.getByRole('button', { name: /confirm|yes|ok/i });
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
          }
          
          // Wait for UI to update
          await this.page.waitForTimeout(500);
        } catch (err) {
          console.error(`Error during task cleanup: ${err}`);
        }
      }
      
      console.log('Task cleanup complete');
    } catch (error) {
      console.log(`Could not clean up tasks: ${error}`);
    }
  }
  
  /**
   * Clean up user's auth state if needed
   */
  async resetAuthState(): Promise<void> {
    try {
      await retry(async () => {
        await this.page.goto(`${config.baseUrl}/dashboard`);
        
        // Check if we're authenticated 
        if (this.page.url().includes('/dashboard')) {
          // Look for logout button
          const logoutButton = this.page.getByRole('button', { name: /logout/i });
          if (await logoutButton.isVisible()) {
            await logoutButton.click();
            await this.page.waitForURL(/login/);
          }
        }
      });
      console.log('Auth state reset complete');
    } catch (error) {
      console.log(`Could not reset auth state: ${error}`);
    }
  }
}
