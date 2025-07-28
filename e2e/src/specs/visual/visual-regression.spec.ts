import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage visual comparison', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('login page visual comparison', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('dashboard visual comparison', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.MOCK_USER || 'admin');
    await page.fill('input[name="password"]', process.env.MOCK_PASSWORD || 'changeme');
    await page.click('button[type="submit"]');
    
    // Navigate to dashboard
    await page.waitForURL('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('dashboard.png');
  });

  test('tasks page visual comparison', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', process.env.MOCK_USER || 'admin');
    await page.fill('input[name="password"]', process.env.MOCK_PASSWORD || 'changeme');
    await page.click('button[type="submit"]');
    
    // Navigate to tasks page using direct navigation for mobile compatibility
    await page.goto('/tasks');
    await page.waitForLoadState('domcontentloaded');
    
    // Take a screenshot and compare with baseline
    await expect(page).toHaveScreenshot('tasks-page.png');
  });
});
