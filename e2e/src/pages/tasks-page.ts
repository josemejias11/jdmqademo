import { Page, expect } from '@playwright/test';
import { BasePage, TaskData } from '../models/models';
import { config } from '../config/config';
import { retry, waitForStableElement } from '../utils/helpers';
// import { taskForm, tasksList } from '../locators/app-locators'; // TODO: Implement centralized locators

/**
 * Page object model for the tasks page
 */
export class TasksPage implements BasePage {
  private selectors = {
    pageTitle: 'h2:has-text("My Tasks")',
    createTaskButton: 'a:has-text("New Task")',
    taskTitleInput: 'input[name="title"]',
    taskDescriptionInput: 'textarea[name="description"]',
    taskSubmitButton: 'button[type="submit"]',
    taskItems: 'tbody tr',
    taskTitle: '.task-title',
    completeCheckbox: 'button[title*="Mark as"]', // Button with title containing "Mark as"
    deleteButton: 'button[title="Delete task"]',
    confirmDeleteButton: '.modal-footer button:has-text("Delete")',
    filterAllButton: 'button:has-text("All")',
    filterCompletedButton: 'button:has-text("Completed")',
    filterPendingButton: 'button:has-text("Pending")',
    noTasksMessage: 'text=No tasks found'
  };

  constructor(private page: Page) {}

  /**
   * Navigate to the tasks page
   */
  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/tasks`);
    await this.verifyPageLoaded();
  }

  /**
   * Verify tasks page is loaded with all expected elements
   */
  async verifyPageLoaded(): Promise<void> {
    await retry(async () => {
      await expect(this.page).toHaveURL(/tasks$/);
      await expect(this.page.locator(this.selectors.pageTitle)).toBeVisible();
      await expect(this.page.locator(this.selectors.createTaskButton)).toBeVisible();
    });
  }

  /**
   * Navigate to task creation page
   */
  async navigateToCreateTask(): Promise<void> {
    await this.page.click(this.selectors.createTaskButton);
    await expect(this.page).toHaveURL(/tasks\/new/);
    await expect(this.page.locator(this.selectors.taskTitleInput)).toBeVisible();
  }

  /**
   * Create a new task
   * @param taskData Task data to create
   */
  async createTask(taskData: TaskData): Promise<void> {
    // Navigate to task creation if not already there
    if (!this.page.url().includes('/new')) {
      await this.navigateToCreateTask();
    }

    await waitForStableElement(this.page, this.selectors.taskTitleInput);
    await this.page.fill(this.selectors.taskTitleInput, taskData.title);
    await this.page.fill(this.selectors.taskDescriptionInput, taskData.description);

    // Submit the form and wait for navigation
    try {
      await Promise.all([
        this.page.waitForURL(/tasks$/, { timeout: 10000 }),
        this.page.click(this.selectors.taskSubmitButton)
      ]);
    } catch (error) {
      // If navigation fails, check if we're still on the form page (validation error)
      if (this.page.url().includes('/new')) {
        // Check for any error messages on the form
        const errorMessage = this.page.locator('.invalid-feedback').first();
        if (await errorMessage.isVisible()) {
          const errorText = await errorMessage.textContent();
          throw new Error(`Task creation failed with validation error: ${errorText}`);
        }
      }
      throw error;
    }

    // Verify the task was created successfully
    await this.verifyTaskExists(taskData.title);
  }

  /**
   * Verify a task exists in the list
   * @param title Task title to check
   */
  async verifyTaskExists(title: string): Promise<void> {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  /**
   * Verify a task does not exist
   * @param title Task title to verify
   */
  async verifyTaskDoesNotExist(title: string): Promise<void> {
    // Wait for a brief moment for UI to update and use toBeHidden instead of not.toBeVisible
    const taskElement = this.page.getByText(title);
    await expect(taskElement).toBeHidden({ timeout: 5000 });
  }

  /**
   * Toggle the completion status of a task
   * @param title Task title to toggle
   */
  async toggleTaskCompletion(title: string): Promise<void> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });
    const completeButton = taskRow.locator(this.selectors.completeCheckbox);

    // Get the current state before clicking
    const currentClass = (await completeButton.getAttribute('class')) || '';
    const wasCompleted = currentClass.includes('btn-success');

    // Click the button
    await completeButton.click();

    // Wait for the state to change by waiting for the opposite class
    if (wasCompleted) {
      // Was completed, now should be pending (btn-outline-secondary)
      await expect(completeButton).toHaveClass(/btn-outline-secondary/, { timeout: 10000 });
    } else {
      // Was pending, now should be completed (btn-success)
      await expect(completeButton).toHaveClass(/btn-success/, { timeout: 10000 });
    }
  }

  /**
   * Check if a task is completed
   * @param title Task title to check
   * @returns True if the task is completed, false otherwise
   */
  async isTaskCompleted(title: string): Promise<boolean> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });
    const completeButton = taskRow.locator(this.selectors.completeCheckbox);

    // Wait for the button to be stable and then check its class
    await expect(completeButton).toBeVisible();
    const buttonClass = (await completeButton.getAttribute('class')) || '';
    return buttonClass.includes('btn-success');
  }

  /**
   * Delete a task
   * @param title Task title to delete
   */
  async deleteTask(title: string): Promise<void> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });

    // Click delete button (3rd button in the button group)
    await taskRow.locator('td:last-child div button:nth-child(3)').click();

    // Wait for modal to appear - using the modal.show class selector
    const modal = this.page.locator('.modal.show');
    await modal.waitFor({ state: 'visible', timeout: 10000 });

    // Verify modal content is loaded
    await expect(modal.locator('.modal-title')).toContainText('Confirm Delete');

    // Click the delete confirmation button (2nd button in modal footer)
    const confirmButton = modal.locator('.modal-footer button:nth-child(2)');
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();

    // Wait for modal to disappear
    await expect(modal).toBeHidden({ timeout: 10000 });

    // Verify task was deleted by checking if it's no longer in the task list
    await expect(
      this.page.locator(this.selectors.taskItems).filter({ hasText: title })
    ).toHaveCount(0, { timeout: 10000 });
  }

  /**
   * Filter tasks by completion status
   * @param filter Filter to apply: 'all', 'completed', or 'pending'
   */
  async filterTasks(filter: 'all' | 'completed' | 'pending'): Promise<void> {
    switch (filter) {
      case 'all':
        await this.page.click(this.selectors.filterAllButton);
        break;
      case 'completed':
        await this.page.click(this.selectors.filterCompletedButton);
        break;
      case 'pending':
        await this.page.click(this.selectors.filterPendingButton);
        break;
    }
  }

  /**
   * Navigate back to dashboard using mobile-friendly approach
   */
  async navigateToDashboard(): Promise<void> {
    const navbarToggler = this.page.locator('.navbar-toggler');
    const isMobile = await navbarToggler.isVisible();

    if (isMobile) {
      // For mobile, use direct navigation to avoid Bootstrap collapse issues
      console.log('Mobile device detected, using direct navigation to dashboard');
      await this.page.goto(`${config.baseUrl}/dashboard`);
      await expect(this.page).toHaveURL(/dashboard/);

      // Wait for dashboard content to load
      await expect(this.page.locator('h1:has-text("Welcome"), h2:has-text("Welcome")')).toBeVisible(
        {
          timeout: 10000
        }
      );
      return;
    }

    // Desktop navigation - try navbar first
    try {
      await this.page.click('a.nav-link:has-text("Dashboard")');
      await expect(this.page).toHaveURL(/dashboard/);
    } catch (error) {
      console.warn('Desktop navbar navigation failed, using direct navigation fallback');
      await this.page.goto(`${config.baseUrl}/dashboard`);
      await expect(this.page).toHaveURL(/dashboard/);
    }
  }

  /**
   * Helper method to handle mobile navigation
   */
  private async handleMobileNavigation(): Promise<void> {
    const navbarToggler = this.page.locator('.navbar-toggler');

    if (await navbarToggler.isVisible()) {
      // Check if navigation links are already visible
      const dashboardNavLink = this.page.locator('a.nav-link:has-text("Dashboard")');

      if (await dashboardNavLink.isVisible()) {
        // Navigation is already expanded, no need to toggle
        return;
      }

      // Try to expand the navigation
      await navbarToggler.click();

      // Wait for navigation links to become visible with multiple attempts
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          await expect(dashboardNavLink).toBeVisible({ timeout: 3000 });
          return; // Success, navigation is now visible
        } catch {
          attempts++;
          if (attempts < maxAttempts) {
            // Try clicking the toggler again
            console.log(`Attempt ${attempts}: Retrying navbar toggle...`);
            await navbarToggler.click();
          }
        }
      }

      // Final attempt with a longer timeout
      try {
        await expect(dashboardNavLink).toBeVisible({ timeout: 5000 });
      } catch (error) {
        console.warn(
          'Mobile navigation failed to expand after multiple attempts. Continuing with test...'
        );
        // Don't throw error - let the test continue and fail naturally if navigation is needed
      }
    }
  }

  /**
   * Get the count of tasks displayed
   * @returns Number of tasks displayed
   */
  async getTaskCount(): Promise<number> {
    return await this.page.locator(this.selectors.taskItems).count();
  }
}
