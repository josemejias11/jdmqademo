import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login-page';
import { DashboardPage } from '@pages/dashboard-page';
import { TasksPage } from '@pages/tasks-page';
import { TestDataCleanup } from '@utils/test-data-cleanup';

/**
 * Extended test fixture with page objects and per-test data cleanup.
 */
export const test = base.extend<{
  sessionId: string;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  tasksPage: TasksPage;
  cleanup: TestDataCleanup;
}>({
  // Unique session ID per test worker — keeps server-side task state isolated
  sessionId: async ({}, use) => {
    const id = `session-${Math.random().toString(36).substring(2, 9)}`;
    process.env.TEST_SESSION_ID = id;
    await use(id);
  },

  // Inject x-test-session-id into every browser request
  page: async ({ browser, sessionId }, use) => {
    const context = await browser.newContext({
      extraHTTPHeaders: { 'x-test-session-id': sessionId }
    });
    const page = await context.newPage();
    await use(page);
    await page.close();
    await context.close();
  },

  // Inject x-test-session-id into every API request context
  request: async ({ playwright, sessionId }, use) => {
    const ctx = await playwright.request.newContext({
      extraHTTPHeaders: { 'x-test-session-id': sessionId }
    });
    await use(ctx);
    await ctx.dispose();
  },

  // Page object fixtures
  loginPage: async ({ page }, use) => await use(new LoginPage(page)),
  dashboardPage: async ({ page }, use) => await use(new DashboardPage(page)),
  tasksPage: async ({ page }, use) => await use(new TasksPage(page)),

  // API-based cleanup — authenticates once, then deletes test tasks after the test
  cleanup: async ({ request }, use) => {
    const cleanup = new TestDataCleanup(request);
    await use(cleanup);
    await cleanup.cleanupTasks();
  }
});

export { expect } from '@playwright/test';

/**
 * Pre-authenticated fixture — logs in as admin before each test.
 */
export const withLogin = test.extend<{ authenticated: void }>({
  authenticated: async ({ loginPage }, use) => {
    await loginPage.goto();
    await loginPage.loginWithDefaultUser();
    await loginPage.verifySuccessfulLogin();
    await use();
  }
});
