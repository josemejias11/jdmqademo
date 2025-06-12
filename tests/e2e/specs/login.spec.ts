import { test, expect } from '@playwright/test';
import testData from '../fixtures/testData.json';


type LoginCase = {
  name: string;
  data: { username: string; password: string };
  expectSuccess: boolean;
};

const loginCases: LoginCase[] = [
  { name: 'Valid credentials', data: testData.valid, expectSuccess: true },
  { name: 'Invalid password', data: testData.invalid, expectSuccess: false },
  {
    name: 'Whitespace in credentials',
    data: testData.whitespace,
    expectSuccess: true,
  },
  {
    name: 'Special characters in credentials',
    data: testData.specialChars,
    expectSuccess: false,
  },
];

test.describe('Login Scenarios', () => {
  for (const { name, data, expectSuccess } of loginCases) {
    test(name, async ({ page }) => {

      await page.goto('http://localhost:3000/login');
      await page.getByLabel('Username').fill(data.username);
      await page.getByLabel('Password').fill(data.password);
      await page.getByRole('button', { name: /login/i }).click();

      if (expectSuccess) {
        await expect(page).toHaveURL(/\/dashboard/);
      } else {
        await expect(page.getByRole('alert')).toContainText(
            /401|failed|invalid/i,
        );
      }
    });
  }

  test('Shows required field validation', async ({ page }) => {

    await page.goto('http://localhost:3000/login');
    await page.getByRole('button', { name: /login/i }).click();

    await expect(page.getByLabel('Username')).toHaveClass(/is-invalid/);
    await expect(page.getByLabel('Password')).toHaveClass(/is-invalid/);
  });
});
