import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { TestDataCleanup } from '../utils/testDataCleanup';
import { TEST_CONFIG } from '../utils/testConfig';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let cleanup: TestDataCleanup;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    cleanup = new TestDataCleanup(page);
    await cleanup.cleanupAll(); // Comprehensive cleanup
    await loginPage.goto();
  });

  test.afterEach(async () => {
    await cleanup.cleanupUserSession(); // Clean session after test
  });

  test('Valid login works with default credentials', async () => {
    await loginPage.loginWithDefaults();
    await loginPage.verifySuccessfulLogin();
  });

  test('Valid login works with explicit credentials', async () => {
    await loginPage.login(TEST_CONFIG.DEFAULT_USER.username, TEST_CONFIG.DEFAULT_USER.password);
    await loginPage.verifySuccessfulLogin();
  });

  test('Invalid credentials show error message', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.verifyLoginError('Invalid username or password');
  });

  test('Empty username shows validation error', async ({ page }) => {
    await loginPage.login('', TEST_CONFIG.DEFAULT_USER.password);
    await expect(page.getByText('Username is required')).toBeVisible({ 
      timeout: TEST_CONFIG.TIMEOUTS.MEDIUM 
    });
  });

  test('Empty password shows validation error', async ({ page }) => {
    await loginPage.login(TEST_CONFIG.DEFAULT_USER.username, '');
    await expect(page.getByText('Password is required')).toBeVisible({
      timeout: TEST_CONFIG.TIMEOUTS.MEDIUM
    });
  });

  test('Login form is accessible and properly structured', async () => {
    await loginPage.verifyAccessibility();
  });

  test('Form validation state is correct on load', async () => {
    await loginPage.verifyFormValidation();
  });

  test('Login page elements are stable and ready for interaction', async ({ page }) => {
    await loginPage.verifyLoginFormState();
    
    // Verify no loading spinners are present
    await expect(page.locator(TEST_CONFIG.SELECTORS.LOADING_SPINNER)).not.toBeVisible();
  });
});
