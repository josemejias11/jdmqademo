import { Page, Locator, expect } from '@playwright/test';

/**
 * Generate a random email address for testing
 */
export function generateRandomEmail(): string {
  const timestamp = new Date().getTime();
  return `test.user.${timestamp}@example.com`;
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Wait for network requests to complete
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Check if an element exists
 */
export async function elementExists(locator: Locator): Promise<boolean> {
  const count = await locator.count();
  return count > 0;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format date string to locale format
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

/**
 * Take screenshot with timestamp
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `./screenshots/${name}-${timestamp}.png` });
}

/**
 * Wait for element to be stable (no movement)
 */
export async function waitForElementStable(locator: Locator, timeout = 5000): Promise<void> {
  await expect(async () => {
    const box1 = await locator.boundingBox();
    await locator.page().waitForTimeout(100);
    const box2 = await locator.boundingBox();

    if (!box1 || !box2) return false;
    return Math.abs(box1.x - box2.x) < 1 && Math.abs(box1.y - box2.y) < 1;
  }).toPass({ timeout });
}

/**
 * Retry an action with exponential backoff
 */
export async function retry<T>(
  action: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxAttempts) break;

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Parse table data from a table element
 */
export async function parseTableData(tableLocator: Locator): Promise<Record<string, string>[]> {
  const rows = tableLocator.locator('tr');
  const headers = await rows.first().locator('th').allTextContents();
  const dataRows = await rows.filter({ has: rows.locator('td') }).all();

  const tableData: Record<string, string>[] = [];

  for (const row of dataRows) {
    const cells = await row.locator('td').allTextContents();
    const rowData: Record<string, string> = {};

    headers.forEach((header, index) => {
      rowData[header.trim()] = cells[index]?.trim() || '';
    });

    tableData.push(rowData);
  }

  return tableData;
}

/**
 * Check if element is in viewport
 */
export async function isElementInViewport(locator: Locator): Promise<boolean> {
  const box = await locator.boundingBox();
  if (!box) return false;

  const viewportSize = await locator.page().viewportSize();
  if (!viewportSize) return false;

  return (
    box.y >= 0 &&
    box.x >= 0 &&
    box.y + box.height <= viewportSize.height &&
    box.x + box.width <= viewportSize.width
  );
}

/**
 * Scroll element into view if not visible
 */
export async function scrollIntoViewIfNeeded(locator: Locator): Promise<void> {
  if (!(await isElementInViewport(locator))) {
    await locator.scrollIntoViewIfNeeded();
    // Wait for scroll to complete
    await locator.page().waitForTimeout(500);
  }
}
