import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout = 10000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Click element with retry logic
   */
  async clickElement(locator: Locator, options = { timeout: 10000 }) {
    await locator.waitFor({ state: 'visible', timeout: options.timeout });
    await locator.click();
  }

  /**
   * Type text into element
   */
  async typeText(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  /**
   * Get text from element
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return locator.textContent() as Promise<string>;
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Wait for URL to contain specific path
   */
  async waitForUrl(urlPath: string, options = { timeout: 10000 }) {
    await expect(this.page).toHaveURL(new RegExp(urlPath), { timeout: options.timeout });
  }
}
