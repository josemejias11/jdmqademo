# Task Manager with Unified Playwright Test Automation Framework

A modern full-stack task management application demonstrating comprehensive QA automation practices. Features enterprise-grade Playwright testing framework with **consolidated dependency management** and streamlined development workflow.

## 🚀 Key Features

### 🎯 **Unified Development Experience**

- **Single Dependency Management**: All dependencies (React, Express, Playwright) managed from root `package.json`
- **Consolidated Configuration**: Unified TypeScript, ESLint, Prettier, and Playwright configurations
- **Streamlined Workflow**: All commands run from root directory - no more switching between folders
- **Zero Redundancy**: Eliminated duplicate configuration files and dependencies

### 🧪 **Advanced Playwright Test Automation**

- **Optimized Browser Matrix**: Chromium, Firefox, WebKit, Mobile Chrome & Safari (5-browser configuration)
- **Visual Regression Testing**: Comprehensive screenshot comparison across all browsers
- **API Testing**: Backend endpoint validation with data consistency verification
- **Performance Testing**: Lighthouse CI integration for web vitals monitoring
- **Page Object Model**: Maintainable test architecture with centralized locators

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
- Unified dependency management

**Application:**

- React 18 + TypeScript frontend
- Express.js + JWT backend
- Bootstrap 5 responsive UI

## 🚀 Quick Start

### Prerequisites

- Node.js 20.11.1 LTS
- npm 10.0.0+

### Installation & Setup

```bash
# Clone and install all dependencies (including Playwright)
git clone https://github.com/josemejias11/jdmqademo.git
cd jdmqademo && npm install --legacy-peer-deps

# Install Playwright browsers
npm run install:browsers

# Set up environment variables
cp .env.example .env
# Edit .env with your JWT secret and other configurations

# Start application (both frontend and backend)
npm run dev  # Frontend: :3000, Backend: :3001
```

### Running Tests

```bash
# All tests from root directory (no cd required!)
npm run test:e2e              # Complete test suite
npm run test:e2e:ui           # Interactive test runner
npm run test:e2e:smoke        # Critical path tests
npm run test:e2e:api          # API endpoint tests
npm run test:e2e:visual       # Visual regression tests
npm run test:e2e:chromium     # Browser-specific tests
npm run test:e2e:mobile       # Mobile browsers (Chrome & Safari)

# Test reporting
npm run test:e2e:report       # View test results
npm run test:e2e:clean        # Clean test artifacts
```

### Development Workflow

```bash
# Code quality (all files from root)
npm run format               # Auto-fix formatting
npm run lint                 # Lint all files (src, server, e2e)
npm run type-check           # TypeScript validation
npm run type-check:server    # Server-specific validation

# Building
npm run build                # Frontend production build
npm run build:server         # Backend compilation
npm run build:all            # Build everything
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
  **Environment Variables:**
- `NODE_ENV=development`
- `JWT_SECRET=dev-jwt-secret-key-change-in-production`
- `MOCK_USER=admin`
- `MOCK_PASSWORD=changeme`
- `BACKEND_PORT=3001`
- `FRONTEND_URL=http://localhost:3000`

For production deployment, update the environment variables in `docker-compose.yml` or use environment-specific compose files.

## 🏗️ Unified Project Architecture

### **Revolutionary Consolidation**

- ✅ **Single `package.json`**: All dependencies (React, Express, Playwright) in one place
- ✅ **Unified Configuration**: One TypeScript config, one ESLint config, one Prettier config
- ✅ **Root-Level Commands**: All scripts run from project root (no more `cd e2e`)
- ✅ **Zero Redundancy**: Eliminated 6+ duplicate configuration files
- ✅ **Simplified Maintenance**: One source of truth for all tooling

### **Smart Configuration**

- **TypeScript**: Root `tsconfig.json` with path mappings for e2e imports
- **ESLint**: Single `.eslintrc.cjs` with overrides for different file types
- **Playwright**: Root `playwright.config.ts` targeting `e2e/src/specs`
- **Environment**: Unified `.env` file for all environment variables

## 🧪 Clean Test Framework Structure

```
Project Root
├── playwright.config.ts       # Unified Playwright configuration
├── package.json               # Single dependency management
├── tsconfig.json              # Unified TypeScript configuration
├── .eslintrc.cjs              # Consolidated linting rules
├── .env / .env.example        # Environment configuration
├── src/                       # React frontend source
├── server/                    # Express backend source
└── e2e/                       # Clean test-only directory
    └── src/                   # Test source code only
        ├── api/               # API client utilities
        ├── config/            # Test configuration
        ├── fixtures/          # Test data & fixtures
        ├── locators/          # Centralized UI selectors
        ├── models/            # Data models
        ├── pages/             # Page Object Models
        ├── specs/             # Test specifications
        │   ├── api/           # API endpoint tests
        │   ├── auth/          # Authentication tests
        │   ├── dashboard/     # Dashboard functionality
        │   ├── demo/          # Feature demonstrations
        │   ├── smoke/         # Critical path tests
        │   ├── tasks/         # Task management tests
        │   └── visual/        # Visual regression tests
        └── utils/             # Helper utilities
```

## 🔧 Complete Command Reference

### Application Development

```bash
npm run dev                     # Start both frontend & backend
npm run frontend                # React development server (:3000)
npm run backend                 # Express server with watch mode (:3001)
npm run build                   # Production build (frontend)
npm run build:server            # Backend TypeScript compilation
npm run build:all               # Build both frontend & backend
```

### E2E Testing (All from Root Directory)

```bash
# Test Execution
npm run test:e2e                # Complete test suite (all browsers)
npm run test:e2e:smoke          # Critical path tests only
npm run test:e2e:api            # API endpoint tests
npm run test:e2e:visual         # Visual regression tests
npm run test:e2e:chromium       # Chromium browser only
npm run test:e2e:firefox        # Firefox browser only
npm run test:e2e:webkit         # WebKit/Safari only
npm run test:e2e:mobile         # Mobile browsers (Chrome & Safari)

# Test Development & Debugging
npm run test:e2e:ui             # Interactive test runner (GUI)
npm run test:e2e:debug          # Debug mode with breakpoints
npm run test:e2e:headed         # Run with visible browser UI

# Test Management
npm run test:e2e:report         # Show HTML test report
npm run test:e2e:clean          # Clean test artifacts
npm run install:browsers        # Install/update Playwright browsers
```

### Code Quality & Validation

```bash
# Formatting & Linting (All File Types)
npm run format                  # Auto-fix code formatting
npm run format:check            # Check formatting (CI-friendly)
npm run lint                    # ESLint all files (src, server, e2e)
npm run lint:fix                # Auto-fix linting issues

# TypeScript Validation
npm run type-check              # Frontend TypeScript validation
npm run type-check:server       # Backend TypeScript validation
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

4. **🧪 E2E Tests (Optimized Browser Matrix)**
   - **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari (5-browser matrix)
   - **Visual Regression**: Screenshot comparison testing across all browsers
   - **Parallel execution** with fail-fast disabled
   - **Test suites**: smoke, API, visual, regression, full (workflow_dispatch)
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

## 🎯 Demo Application & Test Credentials

**Task Manager Features:**

- JWT-based authentication with protected routes
- Full CRUD operations for task management
- Real-time UI updates and responsive design
- RESTful API with comprehensive validation
- Multi-browser compatibility testing

**Test Credentials:**

- **Username**: `admin`
- **Password**: `changeme`

**API Endpoints:**

- Authentication: `POST /api/auth/login`
- Tasks: `GET|POST|PUT|DELETE /api/tasks`
- Base URL: `http://localhost:3001` (backend)
- Frontend: `http://localhost:3000`

## 🔍 Quality Assurance & Architecture

### **Code Quality Standards**

- ✅ **TypeScript Strict Mode**: Full type safety across the stack
- ✅ **ESLint + Prettier**: Automated code formatting and quality checks
- ✅ **Comprehensive Error Handling**: Proper error boundaries and validation
- ✅ **Security Best Practices**: JWT authentication, input validation, CORS

### **Testing Strategy**

- ✅ **Optimized Browser Matrix**: 5-browser configuration (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
- ✅ **Visual Regression Testing**: Screenshot comparison across all browsers for UI consistency
- ✅ **Page Object Model**: Maintainable test architecture with centralized locators
- ✅ **Test Data Isolation**: Clean test environment for each run
- ✅ **API Testing Integration**: Backend endpoint validation with frontend tests
- ✅ **Performance Benchmarking**: Lighthouse CI integration

### **Unified Architecture Benefits**

- 🚀 **50% Faster Setup**: Single `npm install` for everything
- 🔧 **Zero Configuration Conflicts**: No duplicate or conflicting configs
- 📦 **Simplified Dependency Management**: One package.json to rule them all
- 🎯 **Developer Experience**: All commands from root, no directory switching
- 🛠️ **Easier Maintenance**: Single source of truth for all tooling
- 📊 **Consistent Tooling**: Same linting, formatting, and type checking everywhere

---

**Version**: 6.0 - Optimized Browser Matrix & Visual Testing  
**Last Updated**: July 2025
