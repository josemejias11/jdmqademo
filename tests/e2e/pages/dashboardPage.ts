import { Locator, Page, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly taskInput: Locator;
  readonly descriptionInput: Locator;
  readonly addButton: Locator;
  readonly taskTableRows: Locator;
  readonly removeAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskInput = page.locator('#task');
    this.descriptionInput = page.locator('#description');
    this.addButton = page.locator('button:has-text("Add Task")');
    this.taskTableRows = page.locator('table tbody tr');
    this.removeAllButton = page.locator('button:has-text("Remove All")');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }

  async addTask(title: string, description: string) {
    await this.taskInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.addButton.click();
  }

  async assertTaskExists(title: string) {
    const taskRow = this.page.locator(`tr:has-text("${title}")`);
    await expect(taskRow).toBeVisible();
  }

  async getTaskRowsCount(): Promise<number> {
    return this.taskTableRows.count();
  }

  async removeAllTasks() {
    await this.removeAllButton.click();
    await this.page.waitForTimeout(500); // Adjust if confirmation or transition applies
  }

  async clickElement(locator: Locator) {
    await locator.click();
  }
}