import { Page, expect } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    try {
      await this.page.goto('/dashboard');
      await this.page.waitForLoadState('networkidle');
      await this.verifyOnDashboard();
    } catch (error: any) {
      throw new Error(`Failed to navigate to dashboard: ${error.message}`);
    }
  }

  async verifyOnDashboard() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    await this.verifyDashboardComponents();
  }

  async verifyDashboardComponents() {
    // Verify task form components
    const titleInput = this.page.getByLabel('Title');
    const descriptionInput = this.page.getByLabel('Description');
    const addButton = this.page.getByRole('button', { name: /add task/i });

    await expect(titleInput).toBeVisible();
    await expect(titleInput).toBeEnabled();
    await expect(descriptionInput).toBeVisible();
    await expect(descriptionInput).toBeEnabled();
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();

    // Verify task list container
    await expect(this.page.locator('[data-testid="task-list"]')).toBeVisible();
  }

  async verifyTaskListState(expectedTasks: { title: string; description: string }[]) {
    const taskList = this.page.locator('[data-testid="task-list"]');
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
    const taskList = this.page.locator('[data-testid="task-list"]');
    await expect(taskList).toBeVisible();
    await expect(taskList).toHaveText(/no tasks/i);
  }

  async addTask(title: string, description: string) {
    try {
      await this.page.getByLabel('Title').waitFor({ state: 'visible' });
      await this.page.getByLabel('Title').fill(title);
      await this.page.getByLabel('Description').fill(description);
      await this.page.getByRole('button', { name: /add task/i }).click();
      await this.page.waitForLoadState('networkidle');
      await this.verifyTaskAdded(title);
    } catch (error: any) {
      throw new Error(`Failed to add task: ${error.message}`);
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
    } catch (error: any) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  async completeTask(title: string) {
    try {
      const taskElement = this.page.getByText(title).locator('..');
      await taskElement.getByRole('checkbox').check();
      await this.page.waitForLoadState('networkidle');
      await this.verifyTaskCompleted(title);
    } catch (error: any) {
      throw new Error(`Failed to complete task: ${error.message}`);
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
