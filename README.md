# JDM QA Demo Application

A full-stack task management application with authentication built using React, TypeScript, Express, and Bootstrap. This application has been optimized and cleaned up to follow modern best practices, DRY principles, and production-ready patterns.

## Project Overview

This application demonstrates modern web development practices including:

- **Type-safe development** with TypeScript throughout the stack
- **RESTful API architecture** with proper error handling
- **JWT-based authentication** with secure token management
- **React Context API** for efficient state management
- **Form validation** with Formik and Yup
- **Responsive UI** with Bootstrap 5 and modern fonts
- **Modular backend architecture** with shared types and middleware
- **Code quality tools** (ESLint & Prettier) with zero lint errors
- **End-to-end testing** with Playwright and visual regression tests
- **Production-ready optimizations** including environment-aware logging
- **Clean architecture** with eliminated code duplication and unused files

## Tech Stack

### Frontend

- React 18
- TypeScript
- React Router for navigation
- Formik & Yup for form handling and validation
- Bootstrap 5 for responsive styling
- React Icons for UI elements
- Axios for API requests

### Backend

- **Express.js** with TypeScript for robust server-side development
- **JWT authentication** with configurable security settings
- **Express Validator** for comprehensive request validation
- **Shared type definitions** across frontend and backend for consistency
- **Environment-aware logging** (verbose in development, minimal in production)
- **Production-ready middleware** with proper error handling
- **In-memory data store** (for demonstration purposes)

### Testing

- Playwright for end-to-end testing
- Jest-compatible assertions

## Project Structure

```
jdmqademo/
├── build/                # Production build output
├── e2e/                  # Playwright end-to-end tests
│   ├── pages/            # Page object models
│   ├── specs/            # Test specifications
│   └── utils/            # Test utilities and helpers
├── public/               # Static assets
├── server/               # Backend code
│   ├── controllers/      # Route controllers with shared types
│   ├── middleware/       # Express middleware (auth, validation, logging)
│   ├── models/           # Data models with TypeScript interfaces
│   ├── routes/           # API route definitions
│   └── types/            # Shared TypeScript type definitions
├── src/                  # Frontend code
│   ├── components/       # Reusable React components
│   ├── context/          # React context providers (Auth, Tasks)
│   ├── pages/            # Page components with routing
│   ├── ProtectedRoute/   # Route protection components
│   ├── routes/           # Frontend routing configuration
│   ├── services/         # API service functions with proper typing
│   ├── utils/            # Helper functions and API client
│   └── types.ts          # Frontend TypeScript type definitions
├── .env.example          # Example environment configuration
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile            # Docker container configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration (frontend)
├── tsconfig.server.json  # TypeScript configuration (backend)
└── README.md             # This file
```

## Recent Optimizations & Improvements

### ✅ Code Quality & DRY Principles
- **Eliminated duplicate interfaces** - Consolidated `TaskFormValues` and other shared types
- **Removed unused files** - Cleaned up unnecessary service index files, assets, and utilities
- **Zero `any` types** - Replaced all `any` with proper TypeScript interfaces
- **Consistent error handling** - Unified error types across frontend and backend
- **Clean imports** - Added explicit `.js` extensions for Node.js compatibility

### ✅ Performance & Bundle Optimization  
- **Reduced bundle size** - Removed unused dependencies and CSS (217 bytes saved)
- **Optimized CSS** - Cleaned up unused styles and minimized stylesheet
- **Environment-aware logging** - Debug logs only run in development mode
- **Efficient context updates** - Tasks appear immediately after creation without page reloads

### ✅ Type Safety & Consistency
- **Shared backend types** - All server types consolidated in `server/types/index.ts`
- **Frontend/backend type alignment** - Consistent interfaces for Task, User, and API responses
- **Complete TypeScript coverage** - Zero type errors across entire codebase
- **Proper validation** - Form validation with shared type definitions

### ✅ Production Readiness
- **Environment configurations** - Conditional middleware and logging based on NODE_ENV
- **Security improvements** - Proper JWT handling and request size limits
- **Clean dependency tree** - Removed unused packages and optimized node_modules
- **Build verification** - All builds pass with improved performance metrics

## Features

### Authentication

- Login with username and password
- JWT token-based authentication
- Protected routes for authenticated users
- Automatic redirection for unauthenticated users
- Secure logout functionality

### Task Management

- **Intuitive dashboard** with real-time task statistics and overview
- **Advanced task listing** with filtering, search, and sorting capabilities
- **Smart task creation** - Tasks appear immediately in UI after creation
- **Comprehensive task editing** with validation and error handling
- **Detailed task views** with complete task information display
- **One-click status toggle** for completed/pending states
- **Safe task deletion** with confirmation modals and proper cleanup
- **Fully responsive design** optimized for all screen sizes and devices
- **Context-aware state management** - Data updates across all components automatically

## Getting Started

You can run the application using either npm scripts or Docker Compose.

### Prerequisites

- Node.js (v16+)
- npm (v8+)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/josemejias11/jdmqademo.git
   cd jdmqademo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file to set your own values:

     ```
     # Server configuration
     PORT=3001
     NODE_ENV=development

     # Security
     JWT_SECRET=use_a_secure_random_string_here

     # Mock user credentials (for development only)
     MOCK_USER=admin
     MOCK_PASSWORD=changeme

     # API URL for scripts
     API_URL=http://localhost:3001
     ```

   > **IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive information.

4. Install Playwright browsers (if you plan to run tests):

   ```bash
   npm run playwright:install
   ```

5. Start the development servers:

   ```bash
   # Start both frontend and backend with concurrently
   npm run dev

   # Or start them separately:
   # In one terminal - start the Express server
   npm run server

   # In another terminal - start the React development server
   npm start
   ```

## Available Scripts

In the project directory, you can run:

### Development Scripts

#### `npm run dev`
Runs both frontend and backend concurrently in development mode with hot reloading.

#### `npm start` or `npm run frontend`
Runs the React frontend in development mode on [http://localhost:3000](http://localhost:3000).

#### `npm run backend` or `npm run server`
Runs the Express backend server with TypeScript support on port 3001.

### Build Scripts

#### `npm run build`
Builds the frontend app for production to the `build` folder with optimized bundle size.

#### `npm run build:server`
Compiles the TypeScript backend to JavaScript for production deployment.

#### `npm run build:all`
Builds both frontend and backend for production deployment.

### Quality Assurance Scripts

#### `npm run type-check`
Runs TypeScript type checking for the frontend without emitting files.

#### `npm run type-check:server`
Runs TypeScript type checking for the backend without emitting files.

#### `npm run lint`
Runs ESLint to check code quality across the entire codebase.

#### `npm run lint:fix`
Automatically fixes ESLint issues where possible.

#### `npm run prettier`
Formats all code files according to Prettier configuration.

### Testing Scripts

#### `npm test`
Runs the complete Playwright end-to-end test suite.

#### `npm run test:ui`
Runs Playwright tests with interactive UI mode for debugging.

## Docker Deployment

To run the full application using Docker:

1. **Ensure Docker and Docker Compose are installed**
2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
3. **Start all services**:
   ```bash
   docker compose up --build
   ```

This launches:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

> Use `docker compose down` to stop all services.

## Development Workflow

### Getting Started
1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd jdmqademo
   npm install
   cp .env.example .env
   ```

2. **Configure environment** - Edit `.env` with your settings

3. **Start development**:
   ```bash
   npm run dev  # Starts both frontend and backend
   ```

### Code Quality Workflow
1. **Type checking**: `npm run type-check && npm run type-check:server`
2. **Linting**: `npm run lint` (zero errors expected)
3. **Formatting**: `npm run prettier`
4. **Testing**: `npm test`
5. **Building**: `npm run build:all`

### Best Practices
- ✅ **All code is TypeScript** - No `any` types allowed
- ✅ **Shared types** between frontend and backend
- ✅ **Environment-aware code** - Different behavior for dev/prod
- ✅ **Zero lint errors** - Clean, consistent code style
- ✅ **Immediate UI updates** - No page reloads needed for task operations

## Testing Strategy

This project uses **Playwright** for comprehensive end-to-end testing with visual regression capabilities.

### Test Coverage
- **Authentication flows** (login, logout, protected routes)
- **Task management operations** (CRUD operations, status toggling)
- **Visual regression tests** with cross-browser snapshots
- **Error handling scenarios** and user feedback

### Running Tests
```bash
npm test              # Run all tests headlessly
npm run test:ui       # Interactive test debugging with UI
```

### Test Architecture
- **Page Object Models** - Reusable, maintainable test structure
- **Cross-browser testing** - Chrome, Firefox, Safari/WebKit
- **Visual snapshots** - Automatic screenshot comparison
- **Test data cleanup** - Isolated test environments

### Adding New Tests
Tests are located in `e2e/specs/`. Follow existing patterns:
- Use page object models from `e2e/pages/`
- Include visual regression tests for UI changes
- Test both success and error scenarios

## Backend API

The backend provides a robust RESTful API with proper validation and error handling:

### Authentication Endpoints

#### **POST /api/auth/login**
Authenticate user and receive JWT token.

```json
// Request
{
  "username": "admin",
  "password": "changeme"
}

// Success Response (200)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "admin"
  }
}

// Error Response (401)
{
  "success": false,
  "message": "Invalid username or password"
}
```

### Task Management Endpoints

All task endpoints require authentication via JWT token:
```
Authorization: Bearer your_jwt_token_here
```

#### **GET /api/tasks**
Retrieve all tasks for authenticated user.

#### **GET /api/tasks/:id**
Get specific task by ID (with ownership validation).

#### **POST /api/tasks**
Create new task with validation.

```json
// Request
{
  "title": "Complete project documentation",
  "description": "Update README with latest improvements",
  "completed": false
}

// Response (201)
{
  "id": "task_uuid",
  "title": "Complete project documentation",
  "description": "Update README with latest improvements", 
  "completed": false,
  "userId": "admin",
  "createdAt": "2025-06-26T...",
  "updatedAt": "2025-06-26T..."
}
```

#### **PUT /api/tasks/:id**
Update existing task (partial updates supported).

#### **DELETE /api/tasks/:id**
Delete task with ownership validation.

### Error Handling
- **400** - Bad Request (validation errors)
- **401** - Unauthorized (invalid/missing token)
- **404** - Not Found (task doesn't exist or no access)
- **500** - Internal Server Error

## Security & Production Readiness

This application implements comprehensive security measures and production optimizations:

### Authentication Security
- **JWT tokens** with configurable expiration (1 hour default)
- **Secure secret management** via environment variables
- **Token validation** with proper error handling
- **Authorization checks** on all protected routes
- **Request size limits** to prevent DoS attacks

### API Security
- **Request validation** using express-validator with shared types
- **CORS protection** with environment-specific configurations
- **JSON payload limits** (10KB) to prevent oversized requests
- **Token length validation** to prevent oversized authorization headers
- **Proper error responses** without sensitive information leakage

### Production Optimizations
- **Environment-aware logging** - Debug logs only in development
- **Conditional middleware** - Request logger disabled in production
- **Optimized builds** - Smaller bundle sizes and clean dependencies
- **Type safety** - Zero `any` types across entire codebase
- **Clean architecture** - No code duplication, shared types, modular structure

### Development Security Features
- **Environment variables** for all sensitive configuration
- **Secure .gitignore** - No sensitive files committed
- **Dependency management** - Regular updates and security patches
- **Input validation** - All user inputs validated and sanitized

### Security Limitations (Development/Demo)
⚠️ **Important**: This is a demonstration application with some limitations:
- **In-memory storage** - Data doesn't persist between server restarts
- **Mock authentication** - Single hardcoded user for demo purposes
- **Development CORS** - Allows all origins in development mode

For production deployment, replace these with:
- Persistent database (PostgreSQL, MongoDB, etc.)
- Proper user management system
- Restricted CORS configuration

## Architecture & API Configuration

### Centralized API Client

The frontend uses a sophisticated API client configuration in `src/utils/apiClient.ts`:

```typescript
import axios from 'axios';

// Custom Axios instance with optimized headers
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export default apiClient;
```

**Benefits:**
- **Consistent base URL** for all API requests
- **Standardized headers** across the application  
- **Reusable instance** for maintainable API communication
- **Easy configuration** for different environments

### Service Layer Architecture

Each domain has dedicated service files using the shared API client:

```typescript
// src/services/taskService.ts
import apiClient from '../utils/apiClient';

const API_URL = '/tasks'; // Clean paths (base URL handled by apiClient)

export const getTasks = async (): Promise<ApiResponse<Task[]>> => {
  const response = await apiClient.get(API_URL);
  return response.data;
};
```

### Shared Type System

**Frontend types** (`src/types.ts`):
```typescript
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

**Backend types** (`server/types/index.ts`):
```typescript
export interface CustomError extends Error {
  statusCode?: number;
  data?: ValidationError[];
}

export interface AuthenticatedRequest<T = any> extends Request {
  user: AuthenticatedUser;
}
```

This architecture ensures:
- ✅ **Type consistency** between frontend and backend
- ✅ **Maintainable API layer** with shared configurations
- ✅ **Clear separation** of concerns
- ✅ **Reusable components** across the application

## Environment Configuration

### Required Environment Variables

| Variable        | Description                                  | Default               | Required |
|-----------------|----------------------------------------------|-----------------------|----------|
| `PORT`          | Backend server port                          | 3001                  | No       |
| `NODE_ENV`      | Environment mode (development/production)    | development           | No       |
| `JWT_SECRET`    | Secret key for JWT token signing            | None                  | **Yes**  |
| `MOCK_USER`     | Demo username for authentication            | admin                 | No       |
| `MOCK_PASSWORD` | Demo password for authentication            | changeme              | No       |
| `API_URL`       | Base API URL for external scripts           | http://localhost:3001 | No       |
| `ALLOWED_ORIGIN`| Allowed CORS origin (production only)       | http://localhost:3000 | No       |

### Environment Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure required variables**:
   ```env
   # Required for JWT token signing
   JWT_SECRET=your_secure_random_string_here_minimum_32_characters
   
   # Optional: Customize demo credentials
   MOCK_USER=admin
   MOCK_PASSWORD=changeme
   
   # Optional: Production settings
   NODE_ENV=production
   ALLOWED_ORIGIN=https://yourdomain.com
   ```

### Environment Behavior

**Development Mode** (`NODE_ENV=development`):
- ✅ Verbose logging enabled
- ✅ Request logger middleware active
- ✅ CORS allows all origins
- ✅ Debug auth messages

**Production Mode** (`NODE_ENV=production`):
- ✅ Minimal logging only
- ✅ Request logger disabled
- ✅ CORS restricted to `ALLOWED_ORIGIN`
- ✅ No debug messages

> **Security Note**: Never commit your `.env` file to version control. The `.gitignore` is configured to exclude it.

## UI/UX Design

### Modern Design System

The application features a cohesive design system built with **Bootstrap 5** and custom typography:

#### Typography
- **Headings**: Montserrat (700 weight) for strong visual hierarchy
- **Subheadings**: Poppins (700 weight) for modern, friendly appeal  
- **Body Text**: Inter (400 weight) for optimal readability
- **Forms**: Roboto (400 weight) for clean, functional interfaces

#### Component Library
- **Navigation** - Responsive navbar with mobile-first collapsing
- **Cards** - Clean content containers with subtle shadows
- **Modals** - Confirmation dialogs and form overlays
- **Alerts** - Contextual feedback with proper color coding
- **Progress indicators** - Task completion visualization
- **Interactive buttons** - Consistent styling with hover states
- **Form controls** - Validation states with clear error messaging
- **Loading states** - Bootstrap spinners for async operations

#### Responsive Features
- ✅ **Mobile-first design** - Optimized for phones and tablets
- ✅ **Flexible grid system** - Adapts to all screen sizes
- ✅ **Touch-friendly interfaces** - Proper touch targets and spacing
- ✅ **Accessible navigation** - Keyboard and screen reader support

#### Visual Enhancements
- **React Icons** integration for consistent iconography
- **Custom color palette** leveraging Bootstrap's design tokens
- **Subtle animations** for improved user feedback
- **Clean whitespace** for better content hierarchy
- **Optimized bundle size** - Reduced CSS footprint by 217 bytes

### User Experience Features
- **Immediate feedback** - Tasks appear instantly after creation
- **Smart state management** - No page reloads required
- **Error handling** - Clear, actionable error messages
- **Loading states** - Visual feedback for all async operations
- **Keyboard shortcuts** - Enhanced accessibility and power user features

---

## Contributing

### Code Standards
- ✅ **TypeScript required** - No `any` types allowed
- ✅ **ESLint compliance** - Zero lint errors expected  
- ✅ **Prettier formatting** - Consistent code style
- ✅ **Shared types** - Maintain consistency between frontend/backend
- ✅ **Environment awareness** - Code should adapt to dev/production

### Pull Request Process
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Run quality checks: `npm run type-check && npm run lint && npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

---

*This README reflects the current optimized state of the application with all recent improvements, code cleanup, and production-ready enhancements.*
