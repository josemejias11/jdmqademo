# E2E Test Framework

This directory contains the end-to-end tests using Playwright.

## Directory Structure

```
playwright/
├── pages/          # Page Object Models
├── fixtures/       # Test fixtures and data
├── specs/          # Test specifications
├── utils/          # Helper functions
└── screenshots/    # Test failure screenshots
```

## Running Tests

```bash
# Install dependencies
npm install

# Install browsers
npm run playwright:install

# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
HEADED=true npm test
```

## Framework Components

### Page Objects
- `basePage.ts`: Base class with common functionality
- `loginPage.ts`: Login page interactions
- `dashboardPage.ts`: Dashboard page interactions

### Fixtures
- `test-fixture.ts`: Custom test fixtures
- `testData.json`: Test data

### Utils
- `helpers.ts`: Utility functions for tests

## Best Practices

1. Use Page Object Model pattern
2. Keep tests independent
3. Use fixtures for common setup
4. Use helper functions for common operations
5. Take screenshots on test failures
6. Use proper waiting strategies
7. Handle flaky tests with retry logic

## Writing Tests

```typescript
import { test } from '../fixtures/test-fixture';
import { retry } from '../utils/helpers';

test('example test', async ({ loginPage }) => {
    await retry(async () => {
        await loginPage.login('user@example.com', 'password');
    });
});
``` 