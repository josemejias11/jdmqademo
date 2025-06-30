import { test, expect } from '@playwright/test';

test('Debug login form fields', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check if form fields exist and are visible
  console.log('=== Checking form fields ===');
  
  // Try different selector strategies
  const usernameField1 = page.locator('input[name="username"]');
  const usernameField2 = page.locator('#username');
  const usernameField3 = page.getByLabel('Username');
  const usernameField4 = page.getByRole('textbox', { name: /username/i });
  
  console.log('Username field by name:', await usernameField1.count());
  console.log('Username field by id:', await usernameField2.count());
  console.log('Username field by label:', await usernameField3.count());
  console.log('Username field by role:', await usernameField4.count());
  
  const passwordField1 = page.locator('input[name="password"]');
  const passwordField2 = page.locator('#password');
  const passwordField3 = page.getByLabel('Password');
  
  console.log('Password field by name:', await passwordField1.count());
  console.log('Password field by id:', await passwordField2.count());
  console.log('Password field by label:', await passwordField3.count());
  
  const submitButton1 = page.locator('button[type="submit"]');
  const submitButton2 = page.getByRole('button', { name: /login/i });
  
  console.log('Submit button by type:', await submitButton1.count());
  console.log('Submit button by role:', await submitButton2.count());
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-login-form.png', fullPage: true });
  
  // Try to fill the form and see what happens
  console.log('=== Attempting to fill form ===');
  
  try {
    await page.fill('#username', 'admin');
    console.log('✓ Filled username field');
  } catch (e) {
    console.log('✗ Failed to fill username:', e.message);
  }
  
  try {
    await page.fill('#password', 'changeme');
    console.log('✓ Filled password field');
  } catch (e) {
    console.log('✗ Failed to fill password:', e.message);
  }
  
  // Check if values were actually filled
  const usernameValue = await page.inputValue('#username');
  const passwordValue = await page.inputValue('#password');
  
  console.log('Username value:', usernameValue);
  console.log('Password value:', passwordValue);
  
  // Try to click submit and see what happens
  try {
    await page.click('button[type="submit"]');
    console.log('✓ Clicked submit button');
    
    // Wait a bit and check URL
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    console.log('Current URL after submit:', currentUrl);
    
    // Check what's actually on the dashboard page
    if (currentUrl.includes('dashboard')) {
      console.log('=== Dashboard page content ===');
      
      // Check all headings
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      const headingCount = await headings.count();
      console.log('Number of headings found:', headingCount);
      
      for (let i = 0; i < headingCount; i++) {
        const headingText = await headings.nth(i).textContent();
        console.log(`Heading ${i + 1}:`, headingText);
      }
      
      // Try the specific Welcome selector
      const welcomeHeading = page.getByRole('heading', { name: /Welcome.*!/ });
      const welcomeCount = await welcomeHeading.count();
      console.log('Welcome heading count:', welcomeCount);
      
      if (welcomeCount > 0) {
        const welcomeText = await welcomeHeading.textContent();
        console.log('Welcome heading text:', welcomeText);
      }
      
      // Also try a more general Welcome selector
      const welcomeGeneral = page.locator('text=Welcome');
      const welcomeGeneralCount = await welcomeGeneral.count();
      console.log('General Welcome text count:', welcomeGeneralCount);
    }
    
    // Check for any error messages
    const errorModal = page.locator('.modal');
    if (await errorModal.isVisible()) {
      const errorText = await errorModal.textContent();
      console.log('Error modal visible:', errorText);
    }
    
  } catch (e) {
    console.log('✗ Failed to click submit:', e.message);
  }
});
