# End-to-End Testing Framework for Task Manager Application

This folder contains a comprehensive end-to-end testing framework for the Task Manager application using Playwright.

## Setup

```bash
# Install dependencies
npm install

# Install browsers
npm run install:browsers
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests in specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run tests on mobile browsers
npm run test:mobile

# Run specific test suites
npm run test:visual
npm run test:smoke
npm run test:api

# Generate and view HTML report
npm run report

# Type checking
npm run type-check

# Clean up test artifacts
npm run clean
```

## Project Structure

```
e2e/
├── src/                   # Source code
│   ├── api/               # API clients for direct backend interactions
│   ├── config/            # Configuration files
│   ├── fixtures/          # Test fixtures and utilities
│   ├── models/            # TypeScript interfaces and models
│   ├── pages/             # Page object models
│   ├── specs/             # Test specifications organized by feature
│   │   ├── api/           # API tests
│   │   ├── auth/          # Authentication tests
│   │   ├── dashboard/     # Dashboard tests
│   │   ├── smoke/         # Smoke tests
│   │   ├── tasks/         # Task management tests
│   │   └── visual/        # Visual regression tests
│   └── utils/             # Utility functions
├── .env.example           # Example environment variables
├── package.json           # Package configuration
├── playwright.config.ts   # Playwright configuration
└── tsconfig.json          # TypeScript configuration
```

## Best Practices

- **Page Object Model**: All UI interactions are abstracted into page objects
- **Test Isolation**: Each test runs in isolation to prevent cross-test dependencies
- **Test Data Management**: Test data is generated dynamically and cleaned up after tests
- **Visual Testing**: Visual regression tests verify UI appearance
- **API Testing**: Direct API calls verify backend functionality
- **Smoke Tests**: Critical path tests ensure core functionality works

## Customization

The testing framework can be extended by:

1. Adding new page objects in the `pages` directory
2. Creating new test files in the `specs` directory
3. Extending fixtures in `fixtures/test-fixtures.ts`
4. Adding utility functions in the `utils` directory
