import { Page, expect } from '@playwright/test';
import { BasePage } from '../models/models';
import { config } from '../config/config';
import { retry, waitForStableElement } from '../utils/helpers';

/**
 * Page object model for the dashboard page
 */
export class DashboardPage implements BasePage {
  private selectors = {
    welcomeHeading: 'h2.card-title',
    totalTasks: '.card:has-text("Total Tasks") h5:has-text("Total Tasks")',
    completedTasks: '.card:has-text("Completed") h5:has-text("Completed")',
    pendingTasks: '.card:has-text("Pending") h5:has-text("Pending")',
    tasksNavLink: 'a.nav-link:has-text("Tasks")',
    createTaskBtn: 'a:has-text("Create Task")',
    viewAllTasksBtn: 'a:has-text("View All Tasks")',
    recentTasksList: '.list-group-item',
    taskCompletionProgress: '.progress-bar',
    logoutButton: 'button:has-text("Logout")',
    navbarToggler: '.navbar-toggler',
    navbarCollapse: '#navbarNav'
  };

  constructor(private page: Page) {}

  /**
   * Navigate to the dashboard page
   */
  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/dashboard`);
    await this.verifyPageLoaded();
  }

  /**
   * Verify dashboard page is loaded with all expected elements
   */
  async verifyPageLoaded(): Promise<void> {
    await retry(async () => {
      await expect(this.page).toHaveURL(/dashboard/);
      await expect(this.page.locator(this.selectors.welcomeHeading)).toBeVisible();
    });
  }

  /**
   * Helper method to handle mobile navigation
   */
  private async handleMobileNavigation(): Promise<void> {
    const navbarToggler = this.page.locator(this.selectors.navbarToggler);
    
    if (await navbarToggler.isVisible()) {
      const navbarCollapse = this.page.locator(this.selectors.navbarCollapse);
      
      // Check if navbar is already expanded by checking the classes
      const collapseClass = await navbarCollapse.getAttribute('class') || '';
      const isExpanded = collapseClass.includes('show');
      
      if (!isExpanded) {
        await navbarToggler.click();
        
        // Wait for the collapse to get the 'show' class or become visible
        try {
          await expect(navbarCollapse).toHaveClass(/show/, { timeout: 5000 });
        } catch {
          // Fallback: try checking for nav items visibility or click toggler again
          try {
            await expect(this.page.locator(this.selectors.tasksNavLink)).toBeVisible({ timeout: 2000 });
          } catch {
            // Try clicking the toggler one more time
            await navbarToggler.click();
            await expect(this.page.locator(this.selectors.tasksNavLink)).toBeVisible({ timeout: 2000 });
          }
        }
      }
    }
  }

  /**
   * Verify all dashboard components are visible
   */
  async verifyDashboardComponents(): Promise<void> {
    // Check for statistics cards
    await expect(this.page.locator(this.selectors.totalTasks)).toBeVisible();
    await expect(this.page.locator(this.selectors.completedTasks)).toBeVisible();
    await expect(this.page.locator(this.selectors.pendingTasks)).toBeVisible();

    // Check for navigation elements
    await this.handleMobileNavigation();
    
    await expect(this.page.locator(this.selectors.tasksNavLink)).toBeVisible();
    await expect(this.page.locator(this.selectors.createTaskBtn)).toBeVisible();
    await expect(this.page.locator(this.selectors.viewAllTasksBtn)).toBeVisible();
  }

  /**
   * Get the welcome message text
   * @returns The welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    const welcomeText = await this.page.locator(this.selectors.welcomeHeading).textContent();
    return welcomeText || '';
  }

  /**
   * Get task statistics from the dashboard
   * @returns Object containing total, completed, and pending task counts
   */
  async getTaskStatistics(): Promise<{ total: number; completed: number; pending: number }> {
    const totalTasksText = await this.page
      .locator(this.selectors.totalTasks)
      .locator('..')
      .locator('h2')
      .textContent();
    const completedTasksText = await this.page
      .locator(this.selectors.completedTasks)
      .locator('..')
      .locator('h2')
      .textContent();
    const pendingTasksText = await this.page
      .locator(this.selectors.pendingTasks)
      .locator('..')
      .locator('h2')
      .textContent();

    return {
      total: parseInt(totalTasksText || '0'),
      completed: parseInt(completedTasksText || '0'),
      pending: parseInt(pendingTasksText || '0')
    };
  }

  /**
   * Navigate to task creation page from dashboard
   */
  async navigateToCreateTask(): Promise<void> {
    await waitForStableElement(this.page, this.selectors.createTaskBtn);
    await this.page.click(this.selectors.createTaskBtn);
    await expect(this.page).toHaveURL(/tasks\/new/);

    // Wait for form to be visible
    await expect(this.page.locator('input[name="title"]')).toBeVisible();
  }

  /**
   * Navigate to all tasks page from dashboard
   */
  async navigateToAllTasks(): Promise<void> {
    await this.handleMobileNavigation();
    await this.page.click(this.selectors.viewAllTasksBtn);
    await expect(this.page).toHaveURL(/tasks$/);
  }

  /**
   * Navigate to tasks page using navbar link
   */
  async navigateToTasksViaNavbar(): Promise<void> {
    await this.handleMobileNavigation();
    await this.page.click(this.selectors.tasksNavLink);
    await expect(this.page).toHaveURL(/tasks$/);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.handleMobileNavigation();
    await this.page.click(this.selectors.logoutButton);
    await expect(this.page).toHaveURL(/login/);
  }
}
