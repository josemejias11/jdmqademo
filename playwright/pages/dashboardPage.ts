import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class DashboardPage extends BasePage {
  // Locators
  readonly taskList: Locator;
  readonly addTaskButton: Locator;
  readonly taskInput: Locator;
  readonly userProfile: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.taskList = page.getByRole('list');
    this.addTaskButton = page.getByRole('button', { name: 'Add Task' });
    this.taskInput = page.getByPlaceholder('Enter new task');
    this.userProfile = page.getByRole('button', { name: 'User Profile' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  /**
   * Add a new task
   */
  async addTask(taskText: string) {
    await this.clickElement(this.addTaskButton);
    await this.typeText(this.taskInput, taskText);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Get all tasks
   */
  async getTasks(): Promise<string[]> {
    const tasks = this.taskList.getByRole('listitem');
    return tasks.allTextContents();
  }

  /**
   * Logout from dashboard
   */
  async logout() {
    await this.clickElement(this.userProfile);
    await this.clickElement(this.logoutButton);
  }

  /**
   * Navigate to dashboard
   */
  async goto() {
    await this.page.goto('/dashboard');
  }
}
