import { test, expect } from '../../fixtures/test-fixtures';
import { AppLocators, login, dashboard, taskForm } from '../../locators/app-locators';
import { config } from '../../config/config';

/**
 * Demo test suite showing how to use centralized locators
 * This demonstrates the benefit of having all locators in one place
 */
test.describe('Centralized Locators Demo', () => {
  test('should demonstrate login page locators usage', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Using centralized locators for login page
    await expect(page.locator(login.usernameInput)).toBeVisible();
    await expect(page.locator(login.passwordInput)).toBeVisible();
    await expect(page.locator(login.loginButton)).toBeVisible();

    // Fill form using centralized locators
    await page.fill(login.usernameInput, config.users.admin.username);
    await page.fill(login.passwordInput, config.users.admin.password);

    // Alternative selector strategies available
    await page.fill(login.usernameInputById, config.users.admin.username); // Using ID selector

    // Submit form
    await page.click(login.loginButton);

    // Verify navigation to dashboard
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should demonstrate dashboard locators usage', async ({ loginPage, page }) => {
    // Login first using page object
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();

    // Now use centralized locators for dashboard
    await expect(page.locator(dashboard.welcomeMessage)).toBeVisible();
    await expect(page.locator(dashboard.welcomeMessage)).toContainText('Welcome');

    // Check statistics cards using centralized locators
    await expect(page.locator(dashboard.totalTasksCard)).toBeVisible();
    await expect(page.locator(dashboard.completedTasksCard)).toBeVisible();
    await expect(page.locator(dashboard.pendingTasksCard)).toBeVisible();

    // Click on action buttons using centralized locators
    const createTaskButton = page.locator(dashboard.createNewTaskButton);
    await expect(createTaskButton).toBeVisible();
  });

  test('should demonstrate task form locators usage', async ({ loginPage, page }) => {
    // Login and navigate to task creation
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await page.goto('/tasks/new');

    // Use centralized locators for task form
    await expect(page.locator(taskForm.titleInput)).toBeVisible();
    await expect(page.locator(taskForm.descriptionTextarea)).toBeVisible();
    await expect(page.locator(taskForm.completedCheckbox)).toBeVisible();

    // Fill form using centralized locators
    await page.fill(taskForm.titleInput, 'Demo Task from Centralized Locators');
    await page.fill(
      taskForm.descriptionTextarea,
      'This task was created using centralized locators!'
    );

    // Alternative selector strategies
    await page.fill(taskForm.titleInputById, 'Demo Task'); // Using ID selector

    // Submit form
    await page.click(taskForm.submitButton);

    // Verify redirect
    await expect(page).toHaveURL(/tasks$/);
  });

  test('should demonstrate common locators usage', async ({ page }) => {
    await page.goto('/login');

    // Using common locators that work across pages
    await expect(page.locator(AppLocators.common.formControl)).toHaveCount(2); // username + password
    await expect(page.locator(AppLocators.common.primaryButton)).toBeVisible(); // login button

    // Using accessibility selectors
    // const usernameField = page.locator(AppLocators.accessibility.testId('username')); // If we add data-testid
    // const mainContent = page.locator(AppLocators.accessibility.main); // If we add role="main"

    // These would work if data-testid attributes were added to the application
    // await expect(usernameField).toBeVisible();
  });

  test('should show locator flexibility and alternatives', async ({ page }) => {
    await page.goto('/login');

    // Multiple strategies for the same element
    const usernameSelectors = [
      login.usernameInput, // 'input[name="username"]'
      login.usernameInputById, // '#username'
      login.usernameByLabel // 'input[id="username"]'
    ];

    // Test that all selectors find the same element
    for (const selector of usernameSelectors) {
      await expect(page.locator(selector)).toBeVisible();
    }

    // Use the most reliable selector
    await page.fill(login.usernameInput, 'test');

    // Verify all selectors show the same value
    for (const selector of usernameSelectors) {
      await expect(page.locator(selector)).toHaveValue('test');
    }
  });
});

/**
 * Benefits of Centralized Locators demonstrated above:
 *
 * 1. **Single Source of Truth**: All selectors in one place
 * 2. **Easy Maintenance**: Change selector once, updates everywhere
 * 3. **Multiple Strategies**: Fallback selectors for reliability
 * 4. **Consistency**: Same naming conventions across all tests
 * 5. **Discoverability**: Easy to find available selectors
 * 6. **Type Safety**: TypeScript support with autocomplete
 * 7. **Reusability**: Can be used in page objects and direct tests
 * 8. **Documentation**: Self-documenting selector strategies
 */
