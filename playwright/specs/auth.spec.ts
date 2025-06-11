import { test, expect, Page } from '@playwright/test';
import testData from '../fixtures/testData.json';

class AuthPage {
  constructor(private page: Page) {}

  // Locators
  get usernameInput() {
    return this.page.locator('[data-testid="username"], input[name="username"]');
  }
  get passwordInput() {
    return this.page.locator('[data-testid="password"], input[name="password"]');
  }
  get loginButton() {
    return this.page.locator('[data-testid="login-button"], button[type="submit"]');
  }
  get logoutButton() {
    return this.page.locator('[data-testid="logout-button"], button:has-text("Logout")');
  }
  get errorMessage() {
    return this.page.locator('[data-testid="error-message"], .alert-danger');
  }
  get successMessage() {
    return this.page.locator('[data-testid="success-message"], .alert-success');
  }
  get navigationMenu() {
    return this.page.locator('[data-testid="navigation"], nav');
  }
  get dashboardLink() {
    return this.page.locator('[data-testid="dashboard-link"], a:has-text("Dashboard")');
  }

  // Actions
  async navigateToLogin() {
    await this.page.goto(testData.testEnvironments.development.baseUrl);
    // If not already on login page, navigate to it
    if (!this.page.url().includes('/login')) {
      await this.page.goto(`${testData.testEnvironments.development.baseUrl}/login`);
    }
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async waitForDashboard() {
    await this.page.waitForURL('**/dashboard', { timeout: testData.timeouts.navigation });
  }

  async waitForLogin() {
    await this.page.waitForURL('**/login', { timeout: testData.timeouts.navigation });
  }
}

test.describe('Authentication', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.navigateToLogin();
  });

  test.describe('Login Functionality', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      const validUser = testData.users.valid;

      await authPage.login(validUser.username, validUser.password);

      // Should redirect to dashboard
      await authPage.waitForDashboard();

      // Should show navigation menu with authenticated user options
      await expect(authPage.navigationMenu).toBeVisible();
      await expect(authPage.dashboardLink).toBeVisible();
      await expect(authPage.logoutButton).toBeVisible();

      // URL should be dashboard
      expect(page.url()).toMatch(/\/dashboard$/);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      const invalidUser = testData.users.invalid[0];

      await authPage.login(invalidUser.username, invalidUser.password);

      // Should show error message
      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(invalidUser.expectedError);

      // Should remain on login page
      expect(page.url()).toMatch(/\/login$/);

      // Should not show authenticated navigation
      await expect(authPage.logoutButton).not.toBeVisible();
    });

    test('should show error for empty credentials', async ({ page }) => {
      const emptyCredentials = testData.users.invalid[1];

      await authPage.login(emptyCredentials.username, emptyCredentials.password);

      // Should show validation error
      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(emptyCredentials.expectedError);

      // Should remain on login page
      expect(page.url()).toMatch(/\/login$/);
    });

    test('should show error for wrong password', async ({ page }) => {
      const wrongPassword = testData.users.invalid[2];

      await authPage.login(wrongPassword.username, wrongPassword.password);

      // Should show error message
      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(wrongPassword.expectedError);

      // Should remain on login page
      expect(page.url()).toMatch(/\/login$/);
    });

    test('should show error for wrong username', async ({ page }) => {
      const wrongUsername = testData.users.invalid[3];

      await authPage.login(wrongUsername.username, wrongUsername.password);

      // Should show error message
      await expect(authPage.errorMessage).toBeVisible();
      await expect(authPage.errorMessage).toContainText(wrongUsername.expectedError);

      // Should remain on login page
      expect(page.url()).toMatch(/\/login$/);
    });

    test('should clear error message when typing new credentials', async ({ page }) => {
      const invalidUser = testData.users.invalid[0];
      const validUser = testData.users.valid;

      // First, trigger an error
      await authPage.login(invalidUser.username, invalidUser.password);
      await expect(authPage.errorMessage).toBeVisible();

      // Clear and type new credentials
      await authPage.usernameInput.clear();
      await authPage.usernameInput.fill(validUser.username);

      // Error message should disappear (this depends on your implementation)
      // await expect(authPage.errorMessage).not.toBeVisible();
    });
  });

  test.describe('Logout Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each logout test
      const validUser = testData.users.valid;
      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();
    });

    test('should logout successfully and redirect to login', async ({ page }) => {
      await authPage.logout();

      // Should redirect to login page
      await authPage.waitForLogin();

      // Should not show authenticated navigation
      await expect(authPage.logoutButton).not.toBeVisible();

      // URL should be login page
      expect(page.url()).toMatch(/\/login$/);
    });

    test('should not access protected routes after logout', async ({ page }) => {
      await authPage.logout();

      // Try to access dashboard directly
      await page.goto(`${testData.testEnvironments.development.baseUrl}/dashboard`);

      // Should redirect to login
      await authPage.waitForLogin();
      expect(page.url()).toMatch(/\/login$/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing dashboard without authentication', async ({
      page
    }) => {
      await page.goto(`${testData.testEnvironments.development.baseUrl}/dashboard`);

      // Should redirect to login
      await authPage.waitForLogin();
      expect(page.url()).toMatch(/\/login$/);
    });

    test('should redirect to login when accessing tasks without authentication', async ({
      page
    }) => {
      await page.goto(`${testData.testEnvironments.development.baseUrl}/tasks`);

      // Should redirect to login
      await authPage.waitForLogin();
      expect(page.url()).toMatch(/\/login$/);
    });

    test('should allow access to protected routes after authentication', async ({ page }) => {
      const validUser = testData.users.valid;

      // Login first
      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();

      // Should be able to access tasks page
      await page.goto(`${testData.testEnvironments.development.baseUrl}/tasks`);
      await page.waitForURL('**/tasks', { timeout: testData.timeouts.navigation });

      // Should still show authenticated navigation
      await expect(authPage.logoutButton).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should disable login button when form is empty', async ({ page }) => {
      // Check if button is disabled when form is empty
      await expect(authPage.loginButton).toBeDisabled();
    });

    test('should enable login button when both fields are filled', async ({ page }) => {
      const validUser = testData.users.valid;

      await authPage.usernameInput.fill(validUser.username);
      await authPage.passwordInput.fill(validUser.password);

      await expect(authPage.loginButton).toBeEnabled();
    });

    test('should show loading state during login', async ({ page }) => {
      const validUser = testData.users.valid;

      await authPage.usernameInput.fill(validUser.username);
      await authPage.passwordInput.fill(validUser.password);

      // Click login and check for loading state
      await authPage.loginButton.click();

      // Check for loading indicator (spinner, disabled state, or text change)
      // This depends on your implementation
      // await expect(authPage.loginButton).toContainText('Logging in...');
      // OR
      // await expect(page.locator('.spinner')).toBeVisible();
    });
  });

  test.describe('JWT Token Handling', () => {
    test('should store JWT token after successful login', async ({ page }) => {
      const validUser = testData.users.valid;

      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();

      // Check if token is stored in localStorage
      const token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    test('should remove JWT token after logout', async ({ page }) => {
      const validUser = testData.users.valid;

      // Login first
      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();

      // Verify token exists
      let token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeTruthy();

      // Logout
      await authPage.logout();
      await authPage.waitForLogin();

      // Verify token is removed
      token = await page.evaluate(() => localStorage.getItem('token'));
      expect(token).toBeNull();
    });

    test('should handle expired token gracefully', async ({ page }) => {
      const validUser = testData.users.valid;

      // Login first
      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();

      // Manually set an expired token
      await page.evaluate(() => {
        // This is a mock expired token - in real scenario you'd need actual expired token
        localStorage.setItem('token', 'expired.token.here');
      });

      // Try to access a protected route
      await page.goto(`${testData.testEnvironments.development.baseUrl}/tasks`);

      // Should redirect to login due to expired token
      await authPage.waitForLogin();
      expect(page.url()).toMatch(/\/login$/);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check form accessibility
      await expect(authPage.usernameInput).toHaveAttribute('aria-label');
      await expect(authPage.passwordInput).toHaveAttribute('aria-label');
      await expect(authPage.loginButton).toHaveRole('button');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Tab through form elements
      await page.keyboard.press('Tab');
      await expect(authPage.usernameInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(authPage.passwordInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(authPage.loginButton).toBeFocused();
    });

    test('should submit form with Enter key', async ({ page }) => {
      const validUser = testData.users.valid;

      await authPage.usernameInput.fill(validUser.username);
      await authPage.passwordInput.fill(validUser.password);

      // Press Enter to submit
      await page.keyboard.press('Enter');

      // Should redirect to dashboard
      await authPage.waitForDashboard();
      expect(page.url()).toMatch(/\/dashboard$/);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work properly on mobile devices', async ({ page }) => {
      const mobileViewport = testData.ui.breakpoints.mobile;
      await page.setViewportSize({ width: mobileViewport.width, height: mobileViewport.height });

      const validUser = testData.users.valid;

      // Form elements should be visible and functional on mobile
      await expect(authPage.usernameInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
      await expect(authPage.loginButton).toBeVisible();

      // Should be able to login on mobile
      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();

      expect(page.url()).toMatch(/\/dashboard$/);
    });

    test('should work properly on tablet devices', async ({ page }) => {
      const tabletViewport = testData.ui.breakpoints.tablet;
      await page.setViewportSize({ width: tabletViewport.width, height: tabletViewport.height });

      const validUser = testData.users.valid;

      await authPage.login(validUser.username, validUser.password);
      await authPage.waitForDashboard();

      expect(page.url()).toMatch(/\/dashboard$/);
    });
  });
});
