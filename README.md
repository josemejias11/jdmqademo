# Task Manager with Unified Playwright Test Automation Framework

A modern full-stack task management application demonstrating comprehensive QA automation practices with enterprise-grade Playwright testing framework and consolidated dependency management.

## 🚀 Features

### 🎯 **Application Features**

- **Task Management**: Full CRUD operations with real-time UI updates
- **Authentication**: JWT-based authentication with protected routes
- **Responsive Design**: Bootstrap 5 responsive UI across all devices
- **RESTful API**: Comprehensive validation and error handling
- **Multi-browser Support**: Compatible across Chromium, Firefox, WebKit, and mobile browsers

### 🧪 **Testing Features**

- **5-Browser Matrix**: Chromium, Firefox, WebKit, Mobile Chrome & Safari
- **Visual Regression Testing**: Screenshot comparison across all browsers
- **API Testing**: Backend endpoint validation with data consistency verification
- **Page Object Model**: Maintainable test architecture with centralized locators
- **Performance Testing**: Lighthouse CI integration for web vitals monitoring
- **Interactive Testing**: UI mode for test development and debugging

### 🔧 **Development Features**

- **Unified Dependency Management**: Single `package.json` for all components
- **Consolidated Configuration**: TypeScript, ESLint, Prettier, and Playwright
- **Root-Level Commands**: All operations from project root directory
- **Hot Reload**: Live development with automatic rebuilds
- **Docker Support**: Complete containerized development environment

## 🛠 Technologies

### **Frontend Stack**

- **React 18** - Modern React with hooks and functional components
- **TypeScript 5.8.3** - Full type safety and enhanced IDE support
- **Bootstrap 5** - Responsive CSS framework
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing

### **Backend Stack**

- **Express.js 4.18** - Web application framework
- **Node.js 20.11.1 LTS** - JavaScript runtime
- **TypeScript** - Type-safe server development
- **JWT (jsonwebtoken)** - Authentication tokens
- **Express Validator** - Request validation middleware
- **CORS** - Cross-origin resource sharing

### **Testing Stack**

- **Playwright 1.54.1** - End-to-end testing framework
- **TypeScript** - Type-safe test development
- **GitHub Actions** - CI/CD pipeline automation
- **Docker** - Containerized testing environment

### **Development Tools**

- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **Concurrently** - Parallel script execution
- **TSX** - TypeScript execution engine
- **Rimraf** - Cross-platform file cleanup

## ⚙️ Setup & Configuration

### **Prerequisites**

- Node.js 20.11.1 LTS
- npm 10.0.0+
- Git

### **Installation**

```bash
# Clone repository
git clone https://github.com/josemejias11/jdmqademo.git
cd jdmqademo

# Install all dependencies (React, Express, Playwright)
npm install --legacy-peer-deps

# Install Playwright browsers
npm run install:browsers

# Environment setup
cp .env.example .env
# Configure environment variables in .env file
```

### **Environment Variables**

```bash
NODE_ENV=development
JWT_SECRET=dev-jwt-secret-key-change-in-production
MOCK_USER=admin
MOCK_PASSWORD=changeme
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### **VS Code Extensions (Recommended)**

The project includes `.vscode/extensions.json` with recommended extensions:

- **Playwright** - Test debugging and execution
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced IDE support
- **Docker** - Container support

### **Docker Configuration**

```bash
# Build and start complete stack
docker-compose up --build

# Development with live reload
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Docker Services:**

- **Frontend**: React development server (port 3000)
- **Backend**: Express server (port 3001)
- **Live Reload**: Volume mounting for real-time changes

## 📋 Available Commands

### **Application Development**

```bash
# Start Services
npm run dev                     # Start both frontend & backend
npm run frontend                # React development server (:3000)
npm run backend                 # Express server with watch mode (:3001)
npm start                       # React development server only

# Building
npm run build                   # Frontend production build
npm run build:server            # Backend TypeScript compilation
npm run build:all               # Build both frontend & backend
```

### **Testing Commands**

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

# Interactive Testing
npm run test:e2e:ui             # Interactive test runner (GUI)
npm run test:e2e:debug          # Debug mode with breakpoints
npm run test:e2e:headed         # Run with visible browser UI

# Test Management
npm run test:e2e:report         # Show HTML test report
npm run test:e2e:clean          # Clean test artifacts
npm run install:browsers        # Install/update Playwright browsers
```

### **Code Quality Commands**

```bash
# Formatting
npm run format                  # Auto-fix code formatting
npm run format:check            # Check formatting (CI-friendly)
npm run prettier                # Format all files with Prettier

# Linting
npm run lint                    # ESLint all files (src, server, e2e)
npm run lint:fix                # Auto-fix linting issues

# Type Checking
npm run type-check              # Frontend TypeScript validation
npm run type-check:server       # Backend TypeScript validation
```

## 🏗️ Project Architecture

### **Unified Configuration Structure**

```
jdmqademo/
├── .vscode/                    # VS Code workspace settings
│   ├── extensions.json         # Recommended extensions
│   ├── settings.json          # Workspace settings
│   └── launch.json            # Debug configurations
├── .github/workflows/          # CI/CD pipeline
│   └── ci.yml                 # GitHub Actions workflow
├── playwright.config.ts        # Unified Playwright configuration
├── package.json               # Single dependency management
├── tsconfig.json              # Unified TypeScript configuration
├── .eslintrc.cjs              # Consolidated linting rules
├── .env / .env.example        # Environment configuration
├── docker-compose.yml         # Container orchestration
├── Dockerfile                 # Application containerization
├── src/                       # React frontend source
│   ├── components/            # Reusable UI components
│   ├── context/              # React context providers
│   ├── pages/                # Application pages
│   ├── services/             # API service layer
│   └── utils/                # Frontend utilities
├── server/                    # Express backend source
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   └── types/                # Server type definitions
└── e2e/                      # Test automation framework
    └── src/                  # Test source code
        ├── api/              # API client utilities
        ├── config/           # Test configuration
        ├── fixtures/         # Test data & fixtures
        ├── locators/         # Centralized UI selectors
        ├── models/           # Test data models
        ├── pages/            # Page Object Models
        ├── specs/            # Test specifications
        │   ├── api/          # API endpoint tests
        │   ├── auth/         # Authentication tests
        │   ├── dashboard/    # Dashboard functionality
        │   ├── smoke/        # Critical path tests
        │   ├── tasks/        # Task management tests
        │   └── visual/       # Visual regression tests
        └── utils/            # Test helper utilities
```

### **Configuration Files**

- **TypeScript**: Unified configuration with path mappings
- **ESLint**: Single configuration with file-type overrides
- **Prettier**: Consistent formatting across all file types
- **Playwright**: Centralized test configuration
- **Docker**: Complete development environment setup

## 🎯 Demo Application

### **Application Access**

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Test Reports**: Generated in `playwright-report/`

### **Test Credentials**

- **Username**: `admin`
- **Password**: `changeme`

### **API Endpoints**

- **Authentication**: `POST /api/auth/login`
- **Tasks**: `GET|POST|PUT|DELETE /api/tasks`
- **Base URL**: `http://localhost:3001`
