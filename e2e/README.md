# End-to-End Testing Framework

A modern, scalable end-to-end testing framework for the Task Manager application built with Playwright, TypeScript, and best practices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- The main Task Manager application running on `http://localhost:3000`

### Setup
```bash
# Install dependencies and browsers
npm install
npx playwright install

# Or use the setup script
chmod +x setup.sh
./setup.sh

# Copy environment configuration
cp .env.example .env
```

### Running Tests
```bash
# Run all tests
npm test

# Run in headed mode (see browser)
npm run test:headed

# Run with Playwright UI
npm run test:ui

# Debug tests step by step
npm run test:debug

# Run specific browsers
npm run test:chromium
npm run test:firefox  
npm run test:webkit
npm run test:mobile

# Run specific test suites
npm run test:smoke     # Critical user journeys
npm run test:visual    # Visual regression
npm run test:api       # Backend API tests

# View test reports
npm run report
```

## 📁 Project Structure

```
e2e/
├── src/
│   ├── pages/              # Page Object Models
│   │   ├── login-page.ts
│   │   ├── dashboard-page.ts
│   │   └── tasks-page.ts
│   ├── specs/              # Test specifications
│   │   ├── auth/           # Authentication tests
│   │   ├── dashboard/      # Dashboard functionality
│   │   ├── tasks/          # Task management CRUD
│   │   ├── visual/         # Visual regression
│   │   ├── api/            # API testing
│   │   └── smoke/          # Critical path tests
│   ├── fixtures/           # Test fixtures & setup
│   ├── utils/              # Helper utilities
│   ├── config/             # Configuration files
│   ├── models/             # TypeScript interfaces
│   └── api/                # API client for testing
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables
└── package.json           # Dependencies & scripts
```
## 🧪 Test Suites

### Authentication Tests (`/auth`)
- Login/logout functionality
- Form validation
- Invalid credentials handling
- Session management

### Dashboard Tests (`/dashboard`)  
- Component visibility
- Statistics accuracy
- Navigation functionality
- User welcome messages

### Task Management (`/tasks`)
- CRUD operations (Create, Read, Update, Delete)
- Task filtering and sorting  
- Completion status toggling
- Form validation

### Visual Regression (`/visual`)
- Screenshot comparisons
- UI consistency checks
- Cross-browser visual testing
- Responsive design validation

### API Tests (`/api`)
- Backend endpoint testing
- Data validation
- Error handling
- Authentication flows

### Smoke Tests (`/smoke`)
- Critical user journeys
- End-to-end workflows
- Essential functionality validation

## 🔧 Configuration

### Environment Variables (`.env`)
```bash
# Application URLs
BASE_URL="http://localhost:3000"
API_URL="http://localhost:3001"

# Test credentials
TEST_USERNAME="testuser"
TEST_PASSWORD="password123"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="adminpassword"
```

### Browser Configuration
- **Chromium**: Desktop testing
- **Firefox**: Cross-browser compatibility  
- **WebKit**: Safari compatibility
- **Mobile Chrome/Safari**: Mobile responsiveness

## 🏗️ Architecture & Patterns

### Page Object Model (POM)
```typescript
// Example: LoginPage
export class LoginPage implements BasePage {
  private selectors = {
    usernameInput: 'input[name="username"]',
    passwordInput: 'input[name="password"]',
    loginButton: 'button[type="submit"]'
  };

  async login(username: string, password: string) {
    await this.page.fill(this.selectors.usernameInput, username);
    await this.page.fill(this.selectors.passwordInput, password);
    await this.page.click(this.selectors.loginButton);
  }
}
```

### Test Fixtures
```typescript
// Reusable test setup
export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  tasksPage: TasksPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  }
});
```

## 🚦 Best Practices

### ✅ Do
- Use descriptive test names
- Implement proper waits and assertions
- Follow Page Object Model pattern
- Clean up test data after tests
- Use environment variables for configuration
- Write atomic, independent tests

### ❌ Don't  
- Use hard-coded waits (`page.waitForTimeout()`)
- Access private page properties directly
- Write interdependent tests
- Hardcode test data in tests
- Skip error handling
- Ignore visual regression tests

## 🔍 Debugging

### Debug Mode
```bash
# Step through tests with browser open
npm run test:debug

# Run specific test file in debug mode
npx playwright test src/specs/auth/authentication.spec.ts --debug
```

### Screenshots & Videos
- Automatically captured on test failures
- Stored in `test-results/` directory
- Included in HTML reports

### Trace Viewer
```bash
# Generate trace files
npx playwright test --trace on

# View traces
npx playwright show-trace trace.zip
```

## 📊 Reporting

### HTML Report
```bash
npm run report
# Opens browser with detailed test results
```

### CI/CD Integration
- JSON reporter for CI systems
- JUnit XML for test result integration
- GitHub Actions compatible

## 🔄 Maintenance

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting  
npm run format
```

### Test Data Cleanup
- Automatic cleanup after tests
- Test data isolation
- Database reset utilities

### Browser Updates
```bash
# Update Playwright browsers
npx playwright install
```

## 🤝 Contributing

1. **Add New Tests**: Place in appropriate `/specs` subdirectory
2. **Page Objects**: Update page objects when UI changes
3. **Selectors**: Use stable, semantic selectors
4. **Documentation**: Update README for new features
5. **Environment**: Add new config to `.env.example`

## 🐛 Troubleshooting

### Common Issues

**Application Not Running**
```bash
# Start the main application first
cd ../
npm run dev
```

**Browser Installation Issues**
```bash
# Reinstall browsers
npx playwright install --force
```

**Test Failures**
- Check application is running on correct port
- Verify environment variables are set
- Review test-results/ for screenshots
- Use `--headed` mode to see browser actions

**TypeScript Errors**
```bash
# Check TypeScript configuration
npm run type-check
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Testing Practices](https://playwright.dev/docs/best-practices)

---

## 📈 Status

✅ **Framework Complete**: Modern, scalable E2E testing setup  
✅ **TypeScript Ready**: Full type safety and IDE support  
✅ **Multi-Browser**: Chrome, Firefox, Safari, Mobile testing  
✅ **CI/CD Ready**: GitHub Actions and reporting integration  
✅ **Maintainable**: Page Object Model and clean architecture  

**Last Updated**: June 27, 2025
