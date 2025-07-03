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
    pageTitle: 'h2:has-text("Tasks")',
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
    await taskRow.locator(this.selectors.completeCheckbox).click();
  }

  /**
   * Check if a task is completed
   * @param title Task title to check
   * @returns True if the task is completed, false otherwise
   */
  async isTaskCompleted(title: string): Promise<boolean> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });
    const completeButton = taskRow.locator(this.selectors.completeCheckbox);
    const buttonClass = await completeButton.getAttribute('class') || '';
    return buttonClass.includes('btn-success');
  }

  /**
   * Delete a task
   * @param title Task title to delete
   */
  async deleteTask(title: string): Promise<void> {
    const taskRow = this.page.locator(this.selectors.taskItems).filter({ hasText: title });

    // Click delete button
    await taskRow.locator(this.selectors.deleteButton).click();

    // Wait for modal to appear and handle confirmation dialog
    const confirmButton = this.page.locator(this.selectors.confirmDeleteButton);
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
    await confirmButton.click();

    // Wait for modal to disappear
    await this.page.locator('.modal').waitFor({ state: 'hidden', timeout: 5000 });

    // Verify task was deleted
    await expect(this.page.getByText(title)).toBeHidden({ timeout: 5000 });
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
