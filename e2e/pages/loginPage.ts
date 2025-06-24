import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    try {
      await this.page.goto('/login');
      await this.page.waitForLoadState('networkidle');
      await this.verifyOnLoginPage();
    } catch (error: any) {
      throw new Error(`Failed to navigate to login page: ${error.message}`);
    }
  }

  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.page.getByRole('heading', { name: /login/i })).toBeVisible();
    await this.verifyLoginFormState();
  }

  async verifyLoginFormState() {
    // Verify form elements are present and in correct state
    const usernameInput = this.page.getByLabel('Username');
    const passwordInput = this.page.getByLabel('Password');
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
      await this.page.getByLabel('Username').waitFor({ state: 'visible' });
      await this.page.getByLabel('Username').fill(username);
      await this.page.getByLabel('Password').fill(password);
      await this.page.getByRole('button', { name: /login/i }).click();
      await this.page.waitForLoadState('networkidle');
    } catch (error: any) {
      throw new Error(`Login failed: ${error.message}`);
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
