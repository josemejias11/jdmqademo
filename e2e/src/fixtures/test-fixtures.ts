import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { DashboardPage } from '../pages/dashboard-page';
import { TasksPage } from '../pages/tasks-page';
import { TestDataCleanup } from '../utils/test-data-cleanup';

/**
 * Extended test fixture with page objects
 */
export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  tasksPage: TasksPage;
  cleanup: TestDataCleanup;
}>({
  // Define fixtures that will be passed to tests
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  
  tasksPage: async ({ page }, use) => {
    const tasksPage = new TasksPage(page);
    await use(tasksPage);
  },
  
  cleanup: async ({ page }, use) => {
    const cleanup = new TestDataCleanup(page);
    await use(cleanup);
    // After test completes, clean up tasks
    await cleanup.cleanupTasks();
  }
});

/**
 * Re-export expect from Playwright for convenience
 */
export { expect } from '@playwright/test';

/**
 * Authentication fixture for tests requiring login
 */
export const withLogin = test.extend<{
  authenticated: void;
}>({
  // Define authenticated fixture that logs in before each test
  authenticated: async ({ loginPage }, use) => {
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();
    
    await use();
  }
});
