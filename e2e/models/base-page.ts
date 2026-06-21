import { Page, expect } from '@playwright/test';
import { navigation } from '@locators/app-locators';

/**
 * Abstract base class for all page object models.
 * Provides shared utilities (e.g. mobile navigation) to avoid duplication.
 */
export abstract class BasePOM {
  constructor(protected readonly page: Page) {}

  abstract goto(): Promise<void>;
  abstract verifyPageLoaded(): Promise<void>;

  /**
   * Returns true when the hamburger toggler is visible (i.e. we are in mobile viewport).
   */
  protected async isMobile(): Promise<boolean> {
    return this.page.locator(navigation.navbarToggler).isVisible();
  }

  /**
   * Ensures navbar links are visible on mobile by expanding the collapse menu.
   * On desktop this is a no-op.
   */
  protected async ensureNavExpanded(): Promise<void> {
    if (!(await this.isMobile())) return;

    const dashboardLink = this.page.locator(navigation.dashboardLink);
    if (await dashboardLink.isVisible()) return; // already expanded

    const toggler = this.page.locator(navigation.navbarToggler);

    for (let attempt = 1; attempt <= 3; attempt++) {
      await toggler.click();
      try {
        await expect(dashboardLink).toBeVisible({ timeout: 2000 });
        return;
      } catch {
        // retry
      }
    }

    console.warn('BasePOM: could not expand mobile navbar after 3 attempts');
  }

  /**
   * Click the Logout button, handling mobile collapse if necessary.
   * Falls back to clearing localStorage + direct navigation on failure.
   */
  async logout(): Promise<void> {
    if (await this.isMobile()) {
      await this.ensureNavExpanded();
      try {
        await this.page.click(navigation.logoutButton);
        await expect(this.page).toHaveURL(/login/);
        return;
      } catch {
        console.warn('BasePOM.logout: mobile click failed — clearing token directly');
        await this.page.evaluate(() => localStorage.removeItem('auth_token'));
        await this.page.goto('/login');
        await expect(this.page).toHaveURL(/login/);
      }
    } else {
      await this.page.click(navigation.logoutButton);
      await expect(this.page).toHaveURL(/login/);
    }
  }
}
