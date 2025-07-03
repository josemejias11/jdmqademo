import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Read from environment or .env file
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Directory where tests are located
  testDir: './src/specs',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry tests on CI
  retries: 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [['html', { open: 'never' }], ['list']],

  // Global setup for the entire test suite
  globalSetup: './src/config/global-setup.ts',

  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // Capture screenshot only on failure
    screenshot: 'only-on-failure',

    // Record video only on failure
    video: 'on-first-retry',

    // Record trace only on failure
    trace: 'on-first-retry',

    // Set actionability checks
    actionTimeout: 10 * 1000,

    // Browser viewport size
    viewport: { width: 1280, height: 720 }
  },

  // Test projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13']
      }
    },
    {
      name: 'smoke',
      testMatch: /.*smoke\.spec\.ts/,
      retries: 0
    },
    {
      name: 'visual',
      testMatch: /.*visual\.spec\.ts/
    },
    {
      name: 'api',
      testMatch: /.*api\.spec\.ts/,
      use: {
        baseURL: process.env.API_URL || 'http://localhost:3001',
        screenshot: 'off',
        video: 'off'
      }
    }
  ],

  // Folders to keep as test artifacts
  outputDir: 'test-results/'
});
