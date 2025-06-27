import { Page, expect } from '@playwright/test';
import { TEST_CONFIG } from '../utils/testConfig';
import { waitForStableElement, retryAction } from '../utils/helpers';

/**
 * Page Object Model for Login functionality
 * Provides reusable methods for login page interactions
 */
export class LoginPage {
  constructor(private page: Page) {}

  /**
   * Navigate to login page and verify page is loaded
   */
  async goto(): Promise<void> {
    try {
      await this.page.goto(TEST_CONFIG.URLS.LOGIN);
      // Wait for the React app to load and stabilize
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.TIMEOUTS.LONG });
      // Wait for React to render by looking for the app root
      await this.page.waitForSelector('#root', { timeout: TEST_CONFIG.TIMEOUTS.MEDIUM });
      // Small additional wait for React components to mount
      await this.page.waitForTimeout(1000);
      await this.verifyOnLoginPage();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to navigate to login page: ${message}`);
    }
  }

  /**
   * Verify user is on the login page
   */
  async verifyOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/login/, { timeout: TEST_CONFIG.TIMEOUTS.MEDIUM });
    // Wait for React to render and look for the actual heading text
    await expect(this.page.getByRole('heading', { name: 'Task Manager' })).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.MEDIUM });
    await this.verifyLoginFormState();
  }

  /**
   * Verify login form elements are in correct state
   */
  async verifyLoginFormState(): Promise<void> {
    const usernameInput = this.page.locator(TEST_CONFIG.SELECTORS.USERNAME_INPUT);
    const passwordInput = this.page.locator(TEST_CONFIG.SELECTORS.PASSWORD_INPUT);
    const loginButton = this.page.locator(TEST_CONFIG.SELECTORS.LOGIN_BUTTON);

    // Verify form elements are visible and enabled
    await expect(usernameInput).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.MEDIUM });
    await expect(usernameInput).toBeEnabled();
    await expect(usernameInput).toHaveAttribute('type', 'text');

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toBeEnabled();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  }

  /**
   * Verify form validation messages are not visible
   */
  async verifyFormValidation(): Promise<void> {
    await expect(this.page.getByText('Username is required')).not.toBeVisible();
    await expect(this.page.getByText('Password is required')).not.toBeVisible();
  }

  /**
   * Perform login action with retry logic
   */
  async login(username: string, password: string): Promise<void> {
    await retryAction(async () => {
      await waitForStableElement(this.page, TEST_CONFIG.SELECTORS.USERNAME_INPUT);
      
      await this.page.locator(TEST_CONFIG.SELECTORS.USERNAME_INPUT).fill(username);
      await this.page.locator(TEST_CONFIG.SELECTORS.PASSWORD_INPUT).fill(password);
      await this.page.locator(TEST_CONFIG.SELECTORS.LOGIN_BUTTON).click();
      
      await this.page.waitForLoadState('networkidle', { timeout: TEST_CONFIG.TIMEOUTS.MEDIUM });
    });
  }

  /**
   * Login with default test credentials
   */
  async loginWithDefaults(): Promise<void> {
    await this.login(TEST_CONFIG.DEFAULT_USER.username, TEST_CONFIG.DEFAULT_USER.password);
  }

  /**
   * Verify login error message is displayed
   */
  async verifyLoginError(message: string): Promise<void> {
    await expect(this.page.getByText(message)).toBeVisible({ timeout: TEST_CONFIG.TIMEOUTS.MEDIUM });
    await expect(this.page).toHaveURL(/login/); // Should stay on login page
  }

  /**
   * Verify successful login by checking redirect to dashboard
   */
  async verifySuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/dashboard/, { timeout: TEST_CONFIG.TIMEOUTS.LONG });
    // Look for the welcome message heading that contains the username
    await expect(this.page.getByRole('heading', { name: /Welcome.*!/ })).toBeVisible();
  }

  /**
   * Verify accessibility of login form
   */
  async verifyAccessibility(): Promise<void> {
    await expect(this.page.getByLabel(/username/i)).toBeVisible();
    await expect(this.page.getByLabel(/password/i)).toBeVisible();
    await expect(this.page.getByRole('button', { name: /login/i })).toBeVisible();
    
    // Check for proper ARIA labels and roles
    const form = this.page.locator('form');
    await expect(form).toBeVisible();
  }
}
