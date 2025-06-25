import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    try {
      await this.page.goto('/');
      await this.page.waitForLoadState('networkidle');
      await this.verifyOnLoginPage();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to navigate to login page: ${message}`);
    }
  }

  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.page.getByRole('heading', { name: /login/i })).toBeVisible();
    await this.verifyLoginFormState();
  }

  async verifyLoginFormState() {
    // Use name attribute selectors for Formik fields
    const usernameInput = this.page.locator('input[name="username"]');
    const passwordInput = this.page.locator('input[name="password"]');
    const loginButton = this.page.getByRole('button', { name: /login/i });

    await expect(usernameInput).toBeVisible();
    await expect(usernameInput).toBeEnabled();
    await expect(usernameInput).toHaveAttribute('type', 'text');

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  }

  async verifyFormValidation() {
    // Verify form validation messages
    await expect(this.page.getByText('Username is required')).not.toBeVisible();
    await expect(this.page.getByText('Password is required')).not.toBeVisible();
  }

  async login(username: string, password: string) {
    try {
      await this.page.locator('input[name="username"]').waitFor({ state: 'visible' });
      await this.page.locator('input[name="username"]').fill(username);
      await this.page.locator('input[name="password"]').fill(password);
      await this.page.getByRole('button', { name: /login/i }).click();
      await this.page.waitForLoadState('networkidle');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Login failed: ${message}`);
    }
  }

  async verifyLoginError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
    await expect(this.page).toHaveURL(/login/); // Should stay on login page
  }

  async verifySuccessfulLogin() {
    await expect(this.page).toHaveURL(/dashboard/);
    await expect(this.page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  }
}
