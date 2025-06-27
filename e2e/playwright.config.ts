import { defineConfig, devices } from '@playwright/test';

/**
 * Comprehensive Playwright configuration for E2E testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './specs',
  timeout: 30000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2
    }
  },
  retries: process.env.CI ? 2 : 0,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 2 : 4,
  
  // Reporting configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    process.env.CI ? ['github'] : ['list']
  ],

  // Global test settings
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: process.env.HEADED !== 'true',
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },

  // Test projects for different browsers and devices
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      }
    },

    // Mobile devices
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 14'],
        // Mobile-specific test settings
        hasTouch: true
      }
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 7'],
        hasTouch: true
      }
    }
  ],

  // Web server configuration for local development
  ...(process.env.CI ? {} : {
    webServer: {
      command: 'npm run dev',
      port: 3000,
      cwd: '..',
      reuseExistingServer: true,
      timeout: 120000
    }
  })
});
