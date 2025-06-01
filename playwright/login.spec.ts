import { test, expect } from '@playwright/test';

test.describe('Login Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/login');
    });

    test('Login with valid credentials', async ({ page }) => {
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        // Expect to be redirected or see a dashboard heading
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /welcome, admin/i })).toBeVisible();
    });

    test('Login with invalid username', async ({ page }) => {
        await page.getByLabel('Username').fill('invaliduser');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page.getByText(/invalid username or password/i)).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

    test('Login with invalid password', async ({ page }) => {
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('wrongpassword');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page.getByText(/invalid username or password/i)).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

    test('Login with empty username', async ({ page }) => {
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page.getByText(/username is required/i)).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

    test('Login with empty password', async ({ page }) => {
        await page.getByLabel('Username').fill('admin');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page.getByText(/password is required/i)).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

    test('Login with both fields empty', async ({ page }) => {
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page.getByText(/username is required/i)).toBeVisible();
        await expect(page.getByText(/password is required/i)).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

    test('Login form validation - minimum username length', async ({ page }) => {
        await page.getByLabel('Username').fill('ab');
        await page.getByLabel('Password').fill('changeme');

        await expect(page.getByText(/username must be at least 3 characters/i)).toBeVisible();
    });

    test('Login with special characters in username', async ({ page }) => {
        await page.getByLabel('Username').fill('admin@test.com');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        // Assuming email format usernames are valid
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('Case sensitivity - username with different case', async ({ page }) => {
        await page.getByLabel('Username').fill('ADMIN');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        // Test whether username is case-sensitive
        // Adjust expectation based on your app's behavior
        await expect(page.getByText(/invalid username or password/i)).toBeVisible();
    });

    test('Login with whitespace in credentials', async ({ page }) => {
        await page.getByLabel('Username').fill(' admin ');
        await page.getByLabel('Password').fill(' changeme ');
        await page.getByRole('button', { name: /login/i }).click();

        // Test if whitespace is trimmed or causes validation error
        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('Multiple failed login attempts', async ({ page }) => {
        // First failed attempt
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('wrong1');
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page.getByText(/invalid username or password/i)).toBeVisible();

        // Second failed attempt
        await page.getByLabel('Password').fill('wrong2');
        await page.getByRole('button', { name: /login/i }).click();
        await expect(page.getByText(/invalid username or password/i)).toBeVisible();

        // Third failed attempt - might trigger account lockout
        await page.getByLabel('Password').fill('wrong3');
        await page.getByRole('button', { name: /login/i }).click();

        // Check for account lockout message (adjust based on your app's behavior)
        await expect(page.getByText(/account locked|too many attempts/i)).toBeVisible();
    });

    test('Login button is disabled during submission', async ({ page }) => {
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('changeme');

        const loginButton = page.getByRole('button', { name: /login/i });
        await loginButton.click();

        // Check if button is disabled during request
        await expect(loginButton).toBeDisabled();
    });

    test('Password field type is password', async ({ page }) => {
        const passwordField = page.getByLabel('Password');
        await expect(passwordField).toHaveAttribute('type', 'password');
    });

    test('Show/hide password toggle functionality', async ({ page }) => {
        await page.getByLabel('Password').fill('testpassword');

        // Look for show/hide password button (adjust selector as needed)
        const toggleButton = page.getByRole('button', { name: /show password|hide password/i });

        if (await toggleButton.isVisible()) {
            await toggleButton.click();
            await expect(page.getByLabel('Password')).toHaveAttribute('type', 'text');

            await toggleButton.click();
            await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password');
        }
    });

    test('Remember me checkbox functionality', async ({ page }) => {
        const rememberCheckbox = page.getByLabel(/remember me/i);

        if (await rememberCheckbox.isVisible()) {
            await expect(rememberCheckbox).not.toBeChecked();
            await rememberCheckbox.check();
            await expect(rememberCheckbox).toBeChecked();
        }
    });

    test('Forgot password link navigation', async ({ page }) => {
        const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });

        if (await forgotPasswordLink.isVisible()) {
            await forgotPasswordLink.click();
            await expect(page).toHaveURL(/\/forgot-password|\/reset-password/);
        }
    });

    test('Sign up link navigation', async ({ page }) => {
        const signUpLink = page.getByRole('link', { name: /sign up|register/i });

        if (await signUpLink.isVisible()) {
            await signUpLink.click();
            await expect(page).toHaveURL(/\/register|\/signup/);
        }
    });

    test('Enter key submits login form', async ({ page }) => {
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('changeme');
        await page.getByLabel('Password').press('Enter');

        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /welcome, admin/i })).toBeVisible();
    });

    test('Tab navigation through form elements', async ({ page }) => {
        await page.keyboard.press('Tab');
        await expect(page.getByLabel('Username')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.getByLabel('Password')).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(page.getByRole('button', { name: /login/i })).toBeFocused();
    });

    test('Login form accessibility - ARIA labels', async ({ page }) => {
        await expect(page.getByLabel('Username')).toHaveAttribute('aria-label', /username/i);
        await expect(page.getByLabel('Password')).toHaveAttribute('aria-label', /password/i);
    });

    test('SQL injection attempt in username', async ({ page }) => {
        await page.getByLabel('Username').fill("admin'; DROP TABLE users; --");
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        // Should not cause any issues, should show invalid credentials
        await expect(page.getByText(/invalid username or password/i)).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

    test('XSS attempt in form fields', async ({ page }) => {
        await page.getByLabel('Username').fill('<script>alert("xss")</script>');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        // Script should not execute, should show invalid credentials
        await expect(page.getByText(/invalid username or password/i)).toBeVisible();
    });

    test('Login with very long username', async ({ page }) => {
        const longUsername = 'a'.repeat(1000);
        await page.getByLabel('Username').fill(longUsername);
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page.getByText(/username too long|invalid username/i)).toBeVisible();
    });

    test('Logout functionality after successful login', async ({ page }) => {
        // First login
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page).toHaveURL(/\/dashboard/);

        // Then logout
        await page.getByRole('button', { name: /logout|sign out/i }).click();
        await expect(page).toHaveURL(/\/login/);
    });

    test('Session persistence after browser refresh', async ({ page }) => {
        await page.getByLabel('Username').fill('admin');
        await page.getByLabel('Password').fill('changeme');
        await page.getByRole('button', { name: /login/i }).click();

        await expect(page).toHaveURL(/\/dashboard/);

        // Refresh the page
        await page.reload();

        // Should still be logged in
        await expect(page).toHaveURL(/\/dashboard/);
        await expect(page.getByRole('heading', { name: /welcome, admin/i })).toBeVisible();
    });
});