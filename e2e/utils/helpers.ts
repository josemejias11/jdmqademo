import { Page } from '@playwright/test';
import { TEST_CONFIG } from './testConfig';

/**
 * Generate a unique task title with timestamp
 */
export function generateUniqueTask(title = 'Task'): string {
  return `${title}-${Date.now()}`;
}

/**
 * Generate random string for test data
 */
export function generateRandomString(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Wait for element to be in stable state (not moving/changing)
 */
export async function waitForStableElement(page: Page, selector: string, timeout = TEST_CONFIG.TIMEOUTS.MEDIUM): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout });
  
  // Wait for element to be stable (not animating)
  let previousBox = await element.boundingBox();
  await page.waitForTimeout(100);
  
  for (let i = 0; i < 10; i++) {
    const currentBox = await element.boundingBox();
    if (JSON.stringify(previousBox) === JSON.stringify(currentBox)) {
      break;
    }
    previousBox = currentBox;
    await page.waitForTimeout(100);
  }
}

/**
 * Retry an action with exponential backoff
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxRetries = TEST_CONFIG.RETRIES.FLAKY_ACTION,
  initialDelay = 1000
): Promise<T> {
  let lastError: Error = new Error('No attempts made');
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        break;
      }
      
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true
  });
}

/**
 * Get current test environment information
 */
export function getTestEnvironment(): {
  isCI: boolean;
  browserName: string;
  baseURL: string;
} {
  return {
    isCI: !!process.env.CI,
    browserName: process.env.BROWSER_NAME || 'unknown',
    baseURL: process.env.BASE_URL || TEST_CONFIG.URLS.DASHBOARD
  };
}
