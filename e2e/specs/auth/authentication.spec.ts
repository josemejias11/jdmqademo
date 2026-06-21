import { test, expect } from '../../fixtures/test-fixtures';
import { config } from '../../config/config';

/**
 * Authentication test suite
 */
test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should display login page with correct elements', async ({ loginPage, page }) => {
    await loginPage.verifyPageLoaded();
    // Additional assertion for ESLint
    await expect(page).toHaveURL(/login/);
  });

  test('should login successfully with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(config.users.admin.username, config.users.admin.password);

    await loginPage.verifySuccessfulLogin();
    // Additional assertion for ESLint
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid username', async ({ loginPage, page }) => {
    await loginPage.attemptLogin('invaliduser', config.users.admin.password);

    await loginPage.verifyLoginError();
    // Additional assertion for ESLint - Check for modal error message
    await expect(page.locator('.modal.show .text-danger, .alert-danger, .error')).toBeVisible();
  });

  test('should show error with invalid password', async ({ loginPage, page }) => {
    await loginPage.attemptLogin(config.users.admin.username, 'wrongpassword');

    await loginPage.verifyLoginError();
    // Additional assertion for ESLint - Check for modal error message
    await expect(page.locator('.modal.show .text-danger, .alert-danger, .error')).toBeVisible();
  });

  test('should show error with empty credentials', async ({ loginPage, page }) => {
    await loginPage.attemptLogin('', '');

    // For empty credentials, check for client-side validation errors first
    const validationErrors = page.locator('.invalid-feedback');
    const modalError = page.locator('.modal.show .text-danger, .alert-danger, .error');

    // Should show either client-side validation errors or server error
    await expect(
      Promise.race([
        validationErrors.first().waitFor({ state: 'visible', timeout: 3000 }),
        modalError.waitFor({ state: 'visible', timeout: 3000 })
      ])
    ).resolves.not.toThrow();
  });
});

/**
 * Authentication retention test suite
 */
test.describe('Authentication Retention', () => {
  test('should remain logged in when navigating between pages', async ({
    loginPage,
    dashboardPage,
    tasksPage
  }) => {
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();

    // Navigate to tasks page using dashboard navigation
    await dashboardPage.navigateToAllTasks();
    await tasksPage.verifyPageLoaded();

    // Go back to dashboard
    await dashboardPage.goto();
    await dashboardPage.verifyPageLoaded();

    // Verify user is still logged in
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(config.users.admin.username);
  });

  test('should redirect to login after logout', async ({ loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();

    // Verify we're on dashboard
    await dashboardPage.verifyPageLoaded();

    // Log out
    await dashboardPage.logout();

    // Verify redirect to login (logout() already checks for /login/ URL)
    await loginPage.verifyLoggedOut();
  });
});
