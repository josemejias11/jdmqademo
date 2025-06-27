import { Page, expect } from '@playwright/test';
import { BasePage, TaskData } from '../models/models';
import { config } from '../config/config';
import { retry, waitForStableElement } from '../utils/helpers';

/**
 * Page object model for the tasks page
 */
export class TasksPage implements BasePage {
  private selectors = {
    pageTitle: 'h2:has-text("Tasks")',
    createTaskButton: 'a:has-text("Create Task")',
    taskTitleInput: 'input[name="title"]',
    taskDescriptionInput: 'textarea[name="description"]',
    taskSubmitButton: 'button[type="submit"]',
    taskItems: '.task-item',
    taskTitle: '.task-title',
    completeCheckbox: 'input[type="checkbox"]',
    deleteButton: 'button:has-text("Delete")',
    confirmDeleteButton: 'button:has-text("Confirm")',
    filterAllButton: 'button:has-text("All")',
    filterCompletedButton: 'button:has-text("Completed")',
    filterPendingButton: 'button:has-text("Pending")',
    noTasksMessage: 'text=No tasks found',
    backToDashboardButton: 'a:has-text("Back to Dashboard")'
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
    await this.page.click(this.selectors.taskSubmitButton);
    
    // Wait for redirect back to tasks list
    await expect(this.page).toHaveURL(/tasks$/);
    
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
   * Toggle the completion status of a task
   * @param title Task title to toggle
   */
  async toggleTaskCompletion(title: string): Promise<void> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });
    await taskRow.locator(this.selectors.completeCheckbox).click();
    
    // Wait for UI update
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if a task is completed
   * @param title Task title to check
   * @returns True if the task is completed, false otherwise
   */
  async isTaskCompleted(title: string): Promise<boolean> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });
    const checkbox = taskRow.locator(this.selectors.completeCheckbox);
    return await checkbox.isChecked();
  }

  /**
   * Delete a task
   * @param title Task title to delete
   */
  async deleteTask(title: string): Promise<void> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });
    
    // Click delete button
    await taskRow.locator(this.selectors.deleteButton).click();
    
    // Handle confirmation dialog if it appears
    const confirmButton = this.page.locator(this.selectors.confirmDeleteButton);
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Wait for UI update
    await this.page.waitForTimeout(500);
    
    // Verify task was deleted
    await expect(this.page.getByText(title)).not.toBeVisible();
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
    
    // Wait for UI update
    await this.page.waitForTimeout(500);
  }

  /**
   * Navigate back to dashboard
   */
  async navigateToDashboard(): Promise<void> {
    await this.page.click(this.selectors.backToDashboardButton);
    await expect(this.page).toHaveURL(/dashboard/);
  }

  /**
   * Get the count of tasks displayed
   * @returns Number of tasks displayed
   */
  async getTaskCount(): Promise<number> {
    return await this.page.locator(this.selectors.taskItems).count();
  }
}
