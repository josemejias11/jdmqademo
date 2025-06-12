import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByLabel('Username');
    this.passwordField = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: /login/i });
  }

  async goto() {
    await this.page.goto('http://localhost:3000/login');
  }

  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.submitButton.click();
  }

  async submitEmptyForm() {
    await this.submitButton.click();
  }

  getAlert(): Locator {
    return this.page.locator('.alert');
  }
}