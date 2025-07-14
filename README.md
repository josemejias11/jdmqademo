# Task Manager with Playwright Test Automation Framework

A self-developed task management application demonstrating comprehensive QA automation practices. Features enterprise-grade Playwright testing framework with streamlined CI/CD integration and advanced testing patterns for web applications.

## 🚀 Key Features

### 🎯 **QA Automation Leadership**

- **Test Strategy & Architecture**: Enterprise-grade automation framework design and implementation
- **Requirements Analysis**: Participation in design reviews with testability focus
- **CI/CD Pipeline Management**: Single, streamlined pipeline with comprehensive quality gates
- **Team Coordination**: Client QA interface and technical solution evaluation

### 🧪 **Playwright Test Automation**

- **Multi-Browser Testing**: Chrome, Firefox, Safari with parallel execution matrix
- **API Testing**: Comprehensive backend endpoint testing with data consistency
- **Performance Testing**: Lighthouse CI integration for web vitals monitoring

### 🔧 **Enterprise Infrastructure**

- **GitHub Actions**: Single, robust CI/CD pipeline with security scanning
- **Test Management**: Comprehensive reporting and artifact management
- **Quality Gates**: Multi-stage validation with intelligent failure handling
- **Security Integration**: CodeQL analysis and dependency vulnerability scanning

## 🛠 Tech Stack

**Testing Framework:**

- Playwright + TypeScript
- Page Object Model architecture
- API integration & performance testing

**Infrastructure:**

- GitHub Actions CI/CD
- Node.js 20.11.1 LTS
- Artifact management & reporting

**Application:**

- React 18 + TypeScript frontend
- Express.js + JWT backend
- Bootstrap 5 responsive UI

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/josemejias11/jdmqademo.git
cd jdmqademo && npm install --legacy-peer-deps

# Setup testing
cd e2e && npm install --legacy-peer-deps && npx playwright install

# Start application
npm run dev  # Frontend: :3000, Backend: :3001

# Run tests
cd e2e && npm test              # All tests
cd e2e && npm run test:ui       # Interactive mode

# Code quality
npm run format                  # Fix formatting
npm run lint                    # Code linting
npm run type-check              # TypeScript validation
```

## 🐳 Docker Setup

Run the entire application stack using Docker:

```bash
# Build and start the application
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

**Docker Configuration:**
- **Frontend**: React development server on port 3000
- **Backend**: Express server on port 3001
- **Live Reload**: Volume mounting for real-time code changes
- **Environment**: Pre-configured with development settings

**Environment Variables (Docker):**
- `NODE_ENV=development`
- `JWT_SECRET=devsecret`
- `MOCK_USER=admin`
- `MOCK_PASSWORD=changeme`
- `API_URL=http://localhost:3001`

For production deployment, update the environment variables in `docker-compose.yml` or use environment-specific compose files.

## 🧪 Test Framework Structure

```
e2e/
├── src/
│   ├── pages/          # Page Object Models
│   ├── specs/          # Test specifications
│   │   ├── auth/       # Authentication tests
│   │   ├── tasks/      # Task management tests
│   │   ├── api/        # API endpoint tests
│   │   ├── dashboard/  # Dashboard functionality
│   │   ├── smoke/      # Critical path tests
│   │   └── demo/       # Feature demonstrations
│   ├── locators/       # Centralized selectors
│   ├── fixtures/       # Test data management
│   ├── config/         # Test configuration
│   └── utils/          # Helper functions
└── playwright.config.ts
```

## 🔧 Testing & Quality Commands

```bash
# Test execution
cd e2e && npm test              # Complete test suite
cd e2e && npm run test:smoke    # Critical path tests

# Development & debugging
cd e2e && npm run test:ui       # Interactive test runner
cd e2e && npm run test:debug    # Debug mode
cd e2e && npm run test:headed   # Run with browser UI

# Code quality & formatting
npm run format                  # Auto-fix code formatting
npm run format:check            # Check formatting without changes
npm run lint                    # ESLint code quality checks
npm run type-check              # TypeScript validation
npm run type-check:server       # Server TypeScript validation

# CI/CD test suites (via workflow_dispatch)
# - smoke: Critical functionality
# - regression: Full regression suite
# - full: Complete test coverage
```

## 🔄 CI/CD Pipeline

**QA Automation Pipeline** (`.github/workflows/ci.yml`):

1. **🔒 Security & Dependency Scan**
   - npm audit with vulnerability reporting
   - CodeQL static security analysis
   - Security audit artifacts
   - Continue on dev dependency issues

2. **✅ Code Quality & Type Safety**
   - TypeScript compilation (frontend, server, e2e)
   - ESLint code quality validation
   - Prettier formatting enforcement
   - Smart formatting: warnings on PRs, failures on main/develop

3. **🏗️ Build Application**
   - Frontend React production build
   - Backend TypeScript compilation
   - Build artifacts upload for deployment

4. **🧪 E2E Tests (Multi-Browser Matrix)**
   - **Browsers**: Chromium, Firefox, WebKit
   - **Parallel execution** with fail-fast disabled
   - **Test suites**: smoke, regression, full (workflow_dispatch)
   - **Environment isolation** with configurable test data
   - **Comprehensive reporting** with screenshots/videos on failure

5. **⚡ Performance Testing**
   - **Lighthouse CI** integration
   - **Web vitals** monitoring and reporting
   - **Performance budget** enforcement

6. **📊 QA Summary & Validation**
   - **Comprehensive test reporting** in GitHub summary
   - **Quality gate validation** with intelligent failure handling
   - **Deployment readiness** assessment
   - **Primary gates**: E2E tests, quality checks, build success

## 📊 Enterprise QA Capabilities

✅ **Multi-Browser E2E Testing** - Chromium, Firefox, WebKit with matrix strategy  
✅ **API Testing Integration** - Backend endpoint validation and data consistency  
✅ **Performance Monitoring** - Lighthouse CI with web vitals tracking  
✅ **Security Scanning** - CodeQL analysis and dependency vulnerability checks  
✅ **Smart CI/CD Pipeline** - Single, robust workflow with intelligent quality gates  
✅ **Comprehensive Reporting** - Automated artifacts, screenshots, and summary generation  
✅ **Intelligent Validation** - Smart failure handling and deployment readiness checks  
✅ **Developer-Friendly** - Formatting warnings on PRs, strict enforcement on main branches

## 🎯 Demo Application

**Task Manager Features:**

- JWT authentication with protected routes
- CRUD operations for task management
- Real-time UI updates and responsive design
- RESTful API with comprehensive validation

**Test Credentials:**

- Username: `admin`
- Password: `changeme`

## 🔍 Quality Assurance

**Code Quality:**

- TypeScript strict mode
- ESLint + Prettier formatting
- Comprehensive error handling
- Security best practices

**Testing Strategy:**

- Page Object Model architecture
- Test data isolation
- Cross-browser compatibility
- Performance benchmarking

**Pipeline Features:**

- Security vulnerability scanning
- Automated dependency updates
- Quality gate enforcement
- Comprehensive test reporting

---

**Version**: 4.1 - Streamlined QA Pipeline  
**Last Updated**: January 9, 2025  
**Features**: Single CI workflow, accessibility testing removed, smart formatting enforcement, comprehensive multi-browser E2E testing with performance monitoring.
