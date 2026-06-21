import { expect } from '@playwright/test';
import { BasePOM } from '@models/base-page';
import { BasePage, TaskData } from '@models/models';
import { config } from '@config/config';
import { retry, waitForStableElement } from '@utils/helpers';
import { taskForm as taskFormLocators, navigation } from '@locators/app-locators';

// Task-page–specific selectors (kept local — not generic enough for the shared locators file)
const sel = {
  pageTitle: 'h2:has-text("My Tasks")',
  createTaskButton: 'a:has-text("New Task")',
  taskRows: 'tbody tr',
  completeButton: 'button[title*="Mark as"]',
  deleteButton: 'button[title="Delete task"]',
  confirmDeleteButton: '.modal-footer button:has-text("Delete")',
  filterAll: 'button:has-text("All")',
  filterCompleted: 'button:has-text("Completed")',
  filterPending: 'button:has-text("Pending")',
  noTasksMessage: 'text=No tasks found'
} as const;

/**
 * Page object model for the Tasks list page.
 */
export class TasksPage extends BasePOM implements BasePage {
  // ─── Navigation ──────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/tasks`);
    await this.verifyPageLoaded();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  async verifyPageLoaded(): Promise<void> {
    await retry(async () => {
      await expect(this.page).toHaveURL(/tasks$/);
      await expect(this.page.locator(sel.pageTitle)).toBeVisible();
      await expect(this.page.locator(sel.createTaskButton)).toBeVisible();
    });
  }

  async verifyTaskExists(title: string): Promise<void> {
    await expect(this.page.getByText(title)).toBeVisible();
  }

  async verifyTaskDoesNotExist(title: string): Promise<void> {
    await expect(this.page.getByText(title)).toBeHidden({ timeout: config.timeouts.medium });
  }

  // ─── Data ─────────────────────────────────────────────────────────────────

  async getTaskCount(): Promise<number> {
    return this.page.locator(sel.taskRows).count();
  }

  async isTaskCompleted(title: string): Promise<boolean> {
    const row = this._rowByTitle(title);
    const btn = row.locator(sel.completeButton);
    await expect(btn).toBeVisible();
    const cls = (await btn.getAttribute('class')) ?? '';
    return cls.includes('btn-success');
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  async navigateToCreateTask(): Promise<void> {
    await this.page.click(sel.createTaskButton);
    await expect(this.page).toHaveURL(/tasks\/new/);
    await expect(this.page.locator(taskFormLocators.titleInput)).toBeVisible();
  }

  /**
   * Create a task via the form UI. Throws if a validation error appears.
   */
  async createTask(taskData: TaskData): Promise<void> {
    if (!this.page.url().includes('/new')) {
      await this.navigateToCreateTask();
    }

    await waitForStableElement(this.page, taskFormLocators.titleInput);
    await this.page.fill(taskFormLocators.titleInput, taskData.title);
    await this.page.fill(taskFormLocators.descriptionTextarea, taskData.description);

    try {
      await Promise.all([
        this.page.waitForURL(/tasks$/, { timeout: config.timeouts.long }),
        this.page.click(taskFormLocators.submitButton)
      ]);
    } catch {
      if (this.page.url().includes('/new')) {
        const errEl = this.page.locator('.invalid-feedback').first();
        if (await errEl.isVisible()) {
          throw new Error(`Task creation failed: ${await errEl.textContent()}`);
        }
      }
      throw new Error('Task creation: unexpected navigation failure');
    }

    await this.verifyTaskExists(taskData.title);
  }

  async toggleTaskCompletion(title: string): Promise<void> {
    const btn = this._rowByTitle(title).locator(sel.completeButton);
    const wasCompleted = ((await btn.getAttribute('class')) ?? '').includes('btn-success');

    await btn.click();

    await expect(btn).toHaveClass(wasCompleted ? /btn-outline-secondary/ : /btn-success/, {
      timeout: config.timeouts.long
    });
  }

  async deleteTask(title: string): Promise<void> {
    // Use the specific delete button by title attribute in the correct row
    const deleteBtn = this._rowByTitle(title).locator(sel.deleteButton);
    await deleteBtn.click();

    const modal = this.page.locator('.modal.show');
    await modal.waitFor({ state: 'visible', timeout: config.timeouts.long });
    await expect(modal.locator('.modal-title')).toContainText('Confirm Delete');

    const confirmBtn = this.page.locator(sel.confirmDeleteButton);
    await confirmBtn.waitFor({ state: 'visible', timeout: config.timeouts.medium });
    await confirmBtn.click();

    await expect(modal).toBeHidden({ timeout: config.timeouts.long });
    await expect(this._rowByTitle(title)).toHaveCount(0, { timeout: config.timeouts.long });
  }

  async filterTasks(filter: 'all' | 'completed' | 'pending'): Promise<void> {
    const map = { all: sel.filterAll, completed: sel.filterCompleted, pending: sel.filterPending };
    await this.page.click(map[filter]);
  }

  /**
   * Navigate to Dashboard via navbar, with mobile-aware direct fallback.
   */
  async navigateToDashboard(): Promise<void> {
    if (await this.isMobile()) {
      await this.page.goto(`${config.baseUrl}/dashboard`);
      await expect(this.page).toHaveURL(/dashboard/);
      return;
    }
    try {
      await this.page.click(navigation.dashboardLink);
      await expect(this.page).toHaveURL(/dashboard/);
    } catch {
      console.warn('TasksPage.navigateToDashboard: navbar click failed, falling back');
      await this.page.goto(`${config.baseUrl}/dashboard`);
      await expect(this.page).toHaveURL(/dashboard/);
    }
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private _rowByTitle(title: string) {
    return this.page.locator(sel.taskRows).filter({ hasText: title });
  }
}
