import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    try {
      await this.page.goto('/dashboard');
      // Wait for React app to load
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForSelector('#root', { timeout: 10000 });
      // Small additional wait for React components to mount
      await this.page.waitForTimeout(1000);
      await this.verifyOnDashboard();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to navigate to dashboard: ${message}`);
    }
  }

  async verifyOnDashboard() {
    await expect(this.page).toHaveURL(/dashboard/);
    // Look for the welcome message heading that contains the username
    await expect(this.page.getByRole('heading', { name: /Welcome.*!/ })).toBeVisible();
    await this.verifyDashboardComponents();
  }

  async verifyDashboardComponents() {
    // Check for the key dashboard elements: statistics cards and navigation links
    
    // Statistics cards
    await expect(this.page.getByText('Total Tasks')).toBeVisible();
    await expect(this.page.getByText('Completed')).toBeVisible();
    await expect(this.page.getByText('Pending')).toBeVisible();
    
    // Navigation links - be more specific to avoid conflicts
    await expect(this.page.getByRole('link', { name: 'Tasks', exact: true })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Create Task', exact: true })).toBeVisible();
  }

  async verifyTaskListState(expectedTasks: { title: string; description: string }[]) {
    const taskList = this.page.locator('.list-group');
    await expect(taskList).toBeVisible();

    for (const task of expectedTasks) {
      const taskElement = this.page.getByText(task.title).locator('..');
      await expect(taskElement).toBeVisible();
      await expect(this.page.getByText(task.description)).toBeVisible();
      await expect(taskElement.getByRole('checkbox')).toBeVisible();
      await expect(taskElement.getByRole('button', { name: /delete/i })).toBeVisible();
    }
  }

  async verifyEmptyTaskList() {
    const taskList = this.page.locator('.list-group');
    await expect(taskList).toBeVisible();
    await expect(taskList).toHaveText(/no tasks/i);
  }

  async addTask(title: string, description: string) {
    try {
      // Navigate to task creation page from dashboard
      await this.page.getByRole('link', { name: 'Create Task', exact: true }).click();
      await this.page.waitForLoadState('networkidle');
      
      // Wait for task form to be visible
      await this.page.locator('input[name="title"]').waitFor({ state: 'visible' });
      await this.page.locator('input[name="title"]').fill(title);
      await this.page.locator('textarea[name="description"]').fill(description);
      await this.page.getByRole('button', { name: /add/i }).click();
      await this.page.waitForLoadState('networkidle');
      
      // Navigate back to dashboard to verify
      await this.goto();
      await this.verifyTaskAdded(title);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to add task: ${message}`);
    }
  }

  async verifyTaskAdded(title: string) {
    await expect(this.page.getByText(title)).toBeVisible();
    // Verify task is in correct state (not completed)
    const taskElement = this.page.getByText(title).locator('..');
    await expect(taskElement).not.toHaveClass(/completed/);
  }

  async deleteTask(title: string) {
    try {
      const taskElement = this.page.getByText(title).locator('..');
      await taskElement.getByRole('button', { name: /delete/i }).click();
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.getByText(title)).not.toBeVisible();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to delete task: ${message}`);
    }
  }

  async completeTask(title: string) {
    try {
      const taskElement = this.page.getByText(title).locator('..');
      await taskElement.getByRole('checkbox').check();
      await this.page.waitForLoadState('networkidle');
      await this.verifyTaskCompleted(title);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to complete task: ${message}`);
    }
  }

  async verifyTaskCompleted(title: string) {
    const taskElement = this.page.getByText(title).locator('..');
    await expect(taskElement).toHaveClass(/completed/);
    await expect(taskElement.getByRole('checkbox')).toBeChecked();
  }

  async verifyFormValidation() {
    await expect(this.page.getByText('Title is required')).not.toBeVisible();
    await expect(this.page.getByText('Description is required')).not.toBeVisible();
  }
}
