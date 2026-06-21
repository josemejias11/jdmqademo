import { Page, expect } from '@playwright/test';
import { BasePage } from '../models/models';
import { config } from '../config/config';
import { retry, waitForStableElement } from '../utils/helpers';
import { login as loginLocators } from '../locators/app-locators';

/**
 * Page object model for the login page
 */
export class LoginPage implements BasePage {
  constructor(private page: Page) {}

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/login`);
    await this.verifyPageLoaded();
  }

  /**
   * Verify login page is loaded with all expected elements
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.page.locator(loginLocators.usernameInput)).toBeVisible();
    await expect(this.page.locator(loginLocators.passwordInput)).toBeVisible();
    await expect(this.page.locator(loginLocators.loginButton)).toBeVisible();
    await expect(this.page.getByText('Task Manager')).toBeVisible();
  }

  /**
   * Login with provided username and password
   * @param username Username to use for login
   * @param password Password to use for login
   */
  async login(username: string, password: string): Promise<void> {
    await retry(async () => {
      // Wait for form to be ready
      await waitForStableElement(this.page, loginLocators.usernameInput);
      await waitForStableElement(this.page, loginLocators.passwordInput);

      // Clear and fill the form fields
      await this.page.fill(loginLocators.usernameInput, '');
      await this.page.fill(loginLocators.usernameInput, username);

      await this.page.fill(loginLocators.passwordInput, '');
      await this.page.fill(loginLocators.passwordInput, password);

      // Check if there's a modal blocking the form and close it
      const modal = this.page.locator('.modal.show');
      if (await modal.isVisible()) {
        const closeButton = modal.locator('button:has-text("Close")');
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await modal.waitFor({ state: 'hidden', timeout: 2000 });
        }
      }

      // Click submit button
      await this.page.click(loginLocators.loginButton);

      // Wait for navigation to dashboard
      await this.page.waitForURL(/dashboard/, { timeout: config.timeouts.long });
    });
  }

  /**
   * Attempt to login (may succeed or fail) - does not wait for navigation
   * @param username Username to use for login
   * @param password Password to use for login
   */
  async attemptLogin(username: string, password: string): Promise<void> {
    await retry(async () => {
      // Wait for form to be ready
      await waitForStableElement(this.page, loginLocators.usernameInput);
      await waitForStableElement(this.page, loginLocators.passwordInput);

      // Clear and fill the form fields
      await this.page.fill(loginLocators.usernameInput, '');
      await this.page.fill(loginLocators.usernameInput, username);

      await this.page.fill(loginLocators.passwordInput, '');
      await this.page.fill(loginLocators.passwordInput, password);

      // Check if there's a modal blocking the form and close it
      const modal = this.page.locator('.modal.show');
      if (await modal.isVisible()) {
        const closeButton = modal.locator('button:has-text("Close")');
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await modal.waitFor({ state: 'hidden', timeout: 2000 });
        }
      }

      // Click submit button
      await this.page.click(loginLocators.loginButton);

      // Wait a moment for the form submission to process
      // Wait for either success navigation or error message to appear
      await Promise.race([
        this.page.waitForURL(/dashboard/, { timeout: 2000 }).catch(() => {}),
        this.page
          .locator(loginLocators.errorMessage)
          .waitFor({ timeout: 2000 })
          .catch(() => {})
      ]);
    });
  }

  /**
   * Login with default test user credentials
   */
  async loginWithDefaultUser(): Promise<void> {
    await this.login(config.users.admin.username, config.users.admin.password);
  }

  /**
   * Login as admin user
   */
  async loginAsAdmin(): Promise<void> {
    await this.login(config.users.admin.username, config.users.admin.password);
  }

  /**
   * Verify login was successful by checking redirection to dashboard
   */
  async verifySuccessfulLogin(): Promise<void> {
    // Wait for navigation to dashboard
    await expect(this.page).toHaveURL(/dashboard/, { timeout: config.timeouts.long });

    // Wait for the dashboard content to load
    await this.page.waitForLoadState('domcontentloaded');

    // Welcome heading that contains the username should be visible
    await expect(this.page.getByRole('heading', { name: /Welcome.*!/ })).toBeVisible({
      timeout: config.timeouts.long
    });
  }

  /**
   * Verify login error is displayed
   * @param errorMessage Expected error message text (optional)
   */
  async verifyLoginError(errorMessage?: string): Promise<void> {
    await expect(this.page.locator(loginLocators.errorMessage)).toBeVisible();

    if (errorMessage) {
      await expect(this.page.locator(loginLocators.errorMessage)).toContainText(errorMessage);
    }

    // Should still be on login page
    await expect(this.page).toHaveURL(/login/);
  }

  /**
   * Verify user is logged out and on login page
   */
  async verifyLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await this.verifyPageLoaded();
  }
}
