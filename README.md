# JDM QA Demo — Task Manager

A full-stack demo application for showcasing QA automation practices with a production-quality Playwright E2E framework.

## Overview

**JDM QA Demo** is a React + Express task management app built as a demonstration platform for end-to-end testing with Playwright. It covers the full automation stack: authentication flows, CRUD operations, API testing, visual regression, and cross-browser execution — all from a single unified project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Bootstrap 5, React Router, Formik + Yup |
| **Backend** | Express 4, Node.js ≥ 20, JWT auth, Express Validator |
| **Testing** | Playwright 1.54, TypeScript, Page Object Model |
| **Tooling** | Vite 8, ESLint 9, Prettier, TSX, Concurrently |

---

## Project Structure

```
jdmqademo/
├── src/                        # React frontend
│   ├── components/             # Shared UI components
│   ├── context/                # Auth context (JWT)
│   ├── pages/                  # Login, Dashboard, Tasks, TaskForm
│   ├── services/               # API service layer
│   └── utils/                  # Frontend utilities
├── server/                     # Express backend
│   ├── controllers/            # Auth & task handlers
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # In-memory data store
│   └── routes/                 # /api/auth, /api/tasks
├── e2e/                        # Playwright test framework
│   ├── api/                    # API client (ApiClient class)
│   ├── config/                 # config.ts, global-setup.ts
│   ├── fixtures/               # test-fixtures.ts (extended test)
│   ├── locators/               # app-locators.ts (all selectors)
│   ├── models/                 # base-page.ts (BasePOM), models.ts
│   ├── pages/                  # LoginPage, DashboardPage, TasksPage
│   ├── specs/
│   │   ├── api/                # API endpoint tests
│   │   ├── auth/               # Authentication flow tests
│   │   ├── dashboard/          # Dashboard component tests
│   │   ├── smoke/              # Critical path tests
│   │   ├── tasks/              # Task CRUD tests
│   │   └── visual/             # Visual regression tests
│   └── utils/                  # helpers.ts, test-data-cleanup.ts
├── playwright.config.ts        # Playwright configuration
├── vite.config.ts              # Vite/frontend configuration
├── tsconfig.json               # Frontend TypeScript config
├── tsconfig.server.json        # Backend TypeScript config
├── eslint.config.js            # ESLint (flat config)
├── .prettierrc.json            # Prettier config
├── docker-compose.yml          # Docker stack
├── Dockerfile                  # App container
└── package.json                # Single dependency manifest
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** ≥ 10.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/josemejias11/jdmqademo.git
cd jdmqademo

# Install all dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Copy and configure environment variables
cp .env.example .env
```

### Environment Variables

```bash
NODE_ENV=development
JWT_SECRET=dev-jwt-secret-key-change-in-production
MOCK_USER=admin
MOCK_PASSWORD=changeme
BACKEND_PORT=3001
FRONTEND_URL=http://127.0.0.1:3000
```

---

## Running the App

```bash
npm run dev          # Start frontend (:3000) + backend (:3001) together
npm run frontend     # Frontend only (Vite dev server)
npm run backend      # Backend only (tsx watch)
```

- **Frontend**: http://127.0.0.1:3000
- **Backend API**: http://127.0.0.1:3001

### Test Credentials

| Username | Password |
|---|---|
| `admin` | `changeme` |

---

## Running Tests

Playwright automatically starts both servers before running tests — no manual `npm run dev` needed.

### Quick Commands

```bash
npm run test:e2e               # Full suite — all browsers
npm run test:e2e:chromium      # Chromium only (fastest)
npm run test:e2e:firefox       # Firefox only
npm run test:e2e:webkit        # WebKit/Safari only
npm run test:e2e:mobile        # Mobile Chrome + Mobile Safari
```

### By Test Type

```bash
npm run test:e2e:smoke         # Critical path (login → tasks → logout)
npm run test:e2e:api           # API endpoint tests only
npm run test:e2e:visual        # Visual regression (screenshot comparison)
```

### Development & Debugging

```bash
npm run test:e2e:ui            # Interactive Playwright UI (pick & run tests)
npm run test:e2e:headed        # Run with visible browser window
npm run test:e2e:debug         # Step-through debugger
npm run test:e2e:report        # Open last HTML test report
npm run test:e2e:clean         # Delete test-results/ and playwright-report/
```

---

## E2E Framework Architecture

The Playwright test project follows a clean Page Object Model (POM) pattern with centralized configuration and zero duplication.

### Key Design Decisions

| Pattern | Implementation |
|---|---|
| **Base class** | `BasePOM` in `e2e/models/base-page.ts` — shared `isMobile()`, `ensureNavExpanded()`, `logout()` |
| **Locators** | All selectors centralized in `e2e/locators/app-locators.ts` |
| **Fixtures** | `test-fixtures.ts` extends Playwright's `test` with page objects, session IDs, and cleanup |
| **Cleanup** | `TestDataCleanup` uses `APIRequestContext` — no brittle UI modal interaction |
| **Path aliases** | `@pages`, `@models`, `@locators`, `@fixtures`, `@utils`, `@api`, `@config` |

### Path Aliases

All E2E imports use `@`-aliases defined in `tsconfig.json`:

```ts
import { LoginPage } from '@pages/login-page';
import { navigation } from '@locators/app-locators';
import { config } from '@config/config';
```

### Test Suites

| Suite | File | Coverage |
|---|---|---|
| Auth | `specs/auth/authentication.spec.ts` | Login, logout, error handling, session retention |
| Dashboard | `specs/dashboard/dashboard.spec.ts` | Stats, navigation, task reflection |
| Tasks | `specs/tasks/task-management.spec.ts` | Create, toggle, delete, filter |
| Smoke | `specs/smoke/smoke.spec.ts` | End-to-end critical user journey |
| API | `specs/api/api.spec.ts` | JWT auth, task CRUD via API |
| Visual | `specs/visual/visual-regression.spec.ts` | Screenshot baseline comparison |

---

## Code Quality

```bash
npm run lint           # ESLint (src, server, e2e)
npm run lint:fix       # Auto-fix lint issues
npm run format         # Prettier auto-format
npm run format:check   # Prettier CI check (no writes)
npm run type-check     # Frontend TypeScript check
npm run type-check:server  # Backend TypeScript check
```

---

## Building

```bash
npm run build          # Frontend production build (Vite)
npm run build:server   # Backend TypeScript compilation
npm run build:all      # Both
```

---

## Docker

```bash
docker-compose up --build    # Build and start full stack
docker-compose up -d         # Start in background
docker-compose logs -f       # Stream logs
docker-compose down          # Stop and remove containers
```

---

## CI/CD

GitHub Actions workflow in `.github/workflows/ci.yml` runs on every push and pull request:

- Lint and type-check
- Build frontend and backend
- Run Playwright E2E suite (Chromium)
- Upload test report as artifact

---

## API Reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Login, returns JWT | No |
| `GET` | `/api/tasks` | List all tasks | Bearer token |
| `POST` | `/api/tasks` | Create a task | Bearer token |
| `PUT` | `/api/tasks/:id` | Update a task | Bearer token |
| `DELETE` | `/api/tasks/:id` | Delete a task | Bearer token |
