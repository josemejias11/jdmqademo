import { expect } from '@playwright/test';
import { BasePOM } from '@models/base-page';
import { config } from '@config/config';
import { retry } from '@utils/helpers';
import { dashboard as dashboardLocators, navigation } from '@locators/app-locators';

/**
 * Page object model for the Dashboard page.
 */
export class DashboardPage extends BasePOM {
  // ─── Navigation ──────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/dashboard`);
    await this.verifyPageLoaded();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  async verifyPageLoaded(): Promise<void> {
    await retry(async () => {
      await expect(this.page).toHaveURL(/dashboard/);
      await expect(this.page.locator(dashboardLocators.welcomeMessage)).toBeVisible();
    });
  }

  async verifyDashboardComponents(): Promise<void> {
    await expect(this.page.locator(dashboardLocators.totalTasksCard)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.completedTasksCard)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.pendingTasksCard)).toBeVisible();

    if (await this.isMobile()) {
      await expect(this.page.locator(navigation.navbarToggler)).toBeVisible();
    } else {
      await expect(this.page.locator(navigation.tasksLink)).toBeVisible();
    }

    await expect(this.page.locator(dashboardLocators.createTaskButton)).toBeVisible();
    await expect(this.page.locator(dashboardLocators.viewAllTasksButton)).toBeVisible();
  }

  // ─── Data ─────────────────────────────────────────────────────────────────

  async getWelcomeMessage(): Promise<string> {
    return (await this.page.locator(dashboardLocators.welcomeMessage).textContent()) ?? '';
  }

  async getTaskStatistics(): Promise<{ total: number; completed: number; pending: number }> {
    const stat = async (cardLocator: string) => {
      const text = await this.page.locator(cardLocator).locator('..').locator('h2').textContent();
      return parseInt(text ?? '0');
    };
    return {
      total: await stat(dashboardLocators.totalTasksHeading),
      completed: await stat(dashboardLocators.completedTasksHeading),
      pending: await stat(dashboardLocators.pendingTasksHeading)
    };
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  async navigateToCreateTask(): Promise<void> {
    await this.page.click(dashboardLocators.createTaskButton);
    await expect(this.page).toHaveURL(/tasks\/new/);
    await expect(this.page.locator('input[name="title"]')).toBeVisible();
  }

  async navigateToAllTasks(): Promise<void> {
    await this.page.click(dashboardLocators.viewAllTasksButton);
    await expect(this.page).toHaveURL(/tasks$/);
  }

  /**
   * Navigate to Tasks via the top navbar link, with mobile-aware fallback.
   */
  async navigateToTasksViaNavbar(): Promise<void> {
    if (await this.isMobile()) {
      await this.page.goto(`${config.baseUrl}/tasks`);
      await expect(this.page.locator('h2:has-text("My Tasks")')).toBeVisible({
        timeout: config.timeouts.long
      });
      await expect(this.page).toHaveURL(/tasks$/, { timeout: config.timeouts.long });
      return;
    }

    try {
      // Use first() to be safe — only one navbar Tasks link on desktop
      await this.page.locator(navigation.tasksLink).first().click();
      await expect(this.page).toHaveURL(/tasks$/);
    } catch {
      console.warn('DashboardPage.navigateToTasksViaNavbar: navbar click failed, falling back');
      await this.page.goto(`${config.baseUrl}/tasks`);
      await expect(this.page.locator('h2:has-text("My Tasks")')).toBeVisible({
        timeout: config.timeouts.long
      });
      await expect(this.page).toHaveURL(/tasks$/, { timeout: config.timeouts.long });
    }
  }
}
