import { Page } from '@playwright/test';

/**
 * Helper function to retry an action a specified number of times
 *
 * @param action The function to retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @param delay Delay between retries in ms (default: 1000)
 */
export async function retry<T>(action: () => Promise<T>, maxRetries = 3, delay = 1000): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      console.log(`Attempt ${attempt + 1} failed: ${lastError.message}`);

      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Wait for a condition to be true with timeout
 *
 * @param condition Function that returns a boolean promise
 * @param timeout Timeout in ms
 * @param interval Check interval in ms
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout = 10000,
  interval = 500
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(r => setTimeout(r, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Wait for an element to be stable (no position changes) before interacting with it
 *
 * @param page Playwright page
 * @param selector Element selector
 * @param timeout Timeout in ms
 */
export async function waitForStableElement(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  const startTime = Date.now();
  let lastRect: { x: number; y: number } | null = null;

  while (Date.now() - startTime < timeout) {
    const element = page.locator(selector);
    const isVisible = await element.isVisible();

    if (!isVisible) {
      await page.waitForTimeout(100);
      continue;
    }

    const boundingBox = await element.boundingBox();

    if (!boundingBox) {
      await page.waitForTimeout(100);
      continue;
    }

    const currentRect = { x: boundingBox.x, y: boundingBox.y };

    if (lastRect && currentRect.x === lastRect.x && currentRect.y === lastRect.y) {
      return;
    }

    lastRect = currentRect;
    await page.waitForTimeout(100);
  }

  throw new Error(`Element ${selector} was not stable within ${timeout}ms`);
}

/**
 * Generate a unique string for test data
 *
 * @param prefix Prefix for the unique string
 * @returns Prefixed string with timestamp and random digits
 */
export function generateUnique(prefix = ''): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}-${random}`;
}
