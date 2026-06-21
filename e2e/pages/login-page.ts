import { expect } from '@playwright/test';
import { BasePOM } from '@models/base-page';
import { config } from '@config/config';
import { retry, waitForStableElement } from '@utils/helpers';
import { login as loginLocators } from '@locators/app-locators';

/**
 * Page object model for the Login page.
 */
export class LoginPage extends BasePOM {
  // ─── Navigation ──────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto(`${config.baseUrl}/login`);
    await this.verifyPageLoaded();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.page.locator(loginLocators.usernameInput)).toBeVisible();
    await expect(this.page.locator(loginLocators.passwordInput)).toBeVisible();
    await expect(this.page.locator(loginLocators.loginButton)).toBeVisible();
    await expect(this.page.getByText('Task Manager')).toBeVisible();
  }

  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/, { timeout: config.timeouts.long });
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByRole('heading', { name: /Welcome.*!/ })).toBeVisible({
      timeout: config.timeouts.long
    });
  }

  /**
   * Verify login error modal is visible. Optionally assert its message.
   */
  async verifyLoginError(errorMessage?: string): Promise<void> {
    await expect(this.page.locator(loginLocators.errorMessage)).toBeVisible();
    if (errorMessage) {
      await expect(this.page.locator(loginLocators.errorMessage)).toContainText(errorMessage);
    }
    await expect(this.page).toHaveURL(/login/);
  }

  async verifyLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await this.verifyPageLoaded();
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  /**
   * Fill credentials and wait for successful dashboard redirect.
   */
  async login(username: string, password: string): Promise<void> {
    await retry(async () => {
      await this._dismissModalIfOpen();
      await this._fillCredentials(username, password);
      await this.page.click(loginLocators.loginButton);
      await this.page.waitForURL(/dashboard/, { timeout: config.timeouts.long });
    });
  }

  /**
   * Fill credentials and submit without waiting for navigation (may succeed or fail).
   */
  async attemptLogin(username: string, password: string): Promise<void> {
    await retry(async () => {
      await this._dismissModalIfOpen();
      await this._fillCredentials(username, password);
      await this.page.click(loginLocators.loginButton);

      // Wait for either dashboard redirect or error modal
      await Promise.race([
        this.page.waitForURL(/dashboard/, { timeout: 2000 }).catch(() => {}),
        this.page
          .locator(loginLocators.errorMessage)
          .waitFor({ timeout: 2000 })
          .catch(() => {})
      ]);
    });
  }

  async loginWithDefaultUser(): Promise<void> {
    await this.login(config.users.admin.username, config.users.admin.password);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  private async _fillCredentials(username: string, password: string): Promise<void> {
    await waitForStableElement(this.page, loginLocators.usernameInput);
    await waitForStableElement(this.page, loginLocators.passwordInput);
    await this.page.fill(loginLocators.usernameInput, username);
    await this.page.fill(loginLocators.passwordInput, password);
  }

  private async _dismissModalIfOpen(): Promise<void> {
    const modal = this.page.locator('.modal.show');
    if (await modal.isVisible()) {
      const closeBtn = modal.locator('button:has-text("Close")');
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await modal.waitFor({ state: 'hidden', timeout: 2000 });
      }
    }
  }
}
