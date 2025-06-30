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
    await loginPage.login(config.users.standard.username, config.users.standard.password);

    await loginPage.verifySuccessfulLogin();
    // Additional assertion for ESLint
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should show error with invalid username', async ({ loginPage, page }) => {
    await loginPage.login('invaliduser', config.users.standard.password);

    await loginPage.verifyLoginError();
    // Additional assertion for ESLint
    await expect(page.locator('.alert-danger, .error')).toBeVisible();
  });

  test('should show error with invalid password', async ({ loginPage, page }) => {
    await loginPage.login(config.users.standard.username, 'wrongpassword');

    await loginPage.verifyLoginError();
    // Additional assertion for ESLint
    await expect(page.locator('.alert-danger, .error')).toBeVisible();
  });

  test('should show error with empty credentials', async ({ loginPage, page }) => {
    await loginPage.login('', '');

    await loginPage.verifyLoginError();
    // Additional assertion for ESLint
    await expect(page.locator('.alert-danger, .error')).toBeVisible();
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

    // Navigate to tasks page
    await tasksPage.goto();
    await tasksPage.verifyPageLoaded();

    // Go back to dashboard
    await dashboardPage.goto();
    await dashboardPage.verifyPageLoaded();

    // Verify user is still logged in
    const welcomeMessage = await dashboardPage.getWelcomeMessage();
    expect(welcomeMessage).toContain(config.users.standard.username);
  });

  test('should redirect to login after logout', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();

    // Log out
    await dashboardPage.logout();

    // Verify redirect to login
    await loginPage.verifyLoggedOut();

    // Try to access dashboard again - should redirect to login
    await dashboardPage.goto();
    await loginPage.verifyLoggedOut();
    // Additional assertion for ESLint
    await expect(page).toHaveURL(/login/);
  });
});
