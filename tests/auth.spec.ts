import { test, expect } from '@playwright/test';

// Tests the authentication flow with the Express backend on port 3001 and React frontend on port 3000
test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/');
    
    // Assuming there's a login form on the homepage
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
  
  test('should handle login with correct credentials', async ({ page }) => {
    await page.goto('/');
    
    // Fill in the credentials from environment variables
    await page.getByLabel(/username/i).fill(process.env.MOCK_USER || 'admin');
    await page.getByLabel(/password/i).fill(process.env.MOCK_PASSWORD || 'changeme');
    
    // Submit the form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for successful login (adjust selector based on your UI)
    await expect(page.getByText(/welcome/i)).toBeVisible({ timeout: 2000 });
  });
  
  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/');
    
    // Fill in invalid credentials
    await page.getByLabel(/username/i).fill('wrong_user');
    await page.getByLabel(/password/i).fill('wrong_password');
    
    // Submit the form
    await page.getByRole('button', { name: /login/i }).click();
    
    // Check for error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({ timeout: 2000 });
  });
});

