# JDM QA Demo Application

A full-stack task management application with authentication built using React, TypeScript, Express, and Bootstrap.

## Project Overview

This application demonstrates modern web development practices including:

- TypeScript integration for type-safe code
- RESTful API architecture
- JWT-based authentication
- React Context API for state management
- Form validation with Formik and Yup
- Responsive UI with Bootstrap 5
- Modular backend architecture
- Code quality tools (ESLint & Prettier)
- End-to-end testing with Playwright
- Dockerized frontend, backend, and PostgreSQL using Docker Compose

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

- Express.js
- JWT for authentication
- Express Validator for request validation
- In-memory data store (for demonstration purposes)

### Testing

- Playwright for end-to-end testing
- Jest-compatible assertions

## Project Structure

```
jdmqademo/
├── build/                # Production build output
├── docs/                 # Project documentation
├── node_modules/         # Dependencies
├── public/               # Static assets
├── server/               # Backend code
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # Data models
│   └── routes/           # API routes
├── src/                  # Frontend code
│   ├── components/       # React components
│   ├── context/          # React context providers
│   ├── pages/            # Page components
│   ├── routes/           # Frontend routes
│   ├── services/         # API service functions
│   ├── utils/            # Helper functions
│   └── types.ts          # TypeScript type definitions
├── tests/                # Playwright tests
├── .env                  # Environment variables
├── .env.example          # Example environment configuration
├── .eslintrc.js          # ESLint configuration
├── .gitignore            # Files to exclude from git
├── .prettierrc.js        # Prettier configuration
├── package.json          # Project dependencies and scripts
├── playwright.config.ts  # Playwright configuration
├── server.js             # Express server entry point
└── tsconfig.json         # TypeScript configuration
```

## Features

### Authentication

- Login with username and password
- JWT token-based authentication
- Protected routes for authenticated users
- Automatic redirection for unauthenticated users
- Secure logout functionality

### Task Management

- Dashboard with task statistics and overview
- Task listing with filtering and search capabilities
- Task creation and editing forms
- Task detail view with all task information
- Task status toggle (completed/pending)
- Delete confirmation modals
- Responsive UI for all screen sizes

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

## Option 1: Available Scripts

In the project directory, you can run:

### `npm start`

Runs the frontend app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run server`

Runs the backend Express server with nodemon for automatic reloading on port 3001.

### `npm run dev`

Runs both the frontend and backend concurrently in development mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run lint`

Runs ESLint to check for code quality issues.

### `npm run lint:fix`

Automatically fixes ESLint issues where possible.

### `npm run format`

Runs Prettier to format all code files.

### `npm run format:check`

Checks if files are formatted according to Prettier rules.

### `npm test`

Runs Playwright end-to-end tests.

### `npm run test:ui`

Runs Playwright tests with UI mode for interactive debugging.

### `npm run playwright:install`

Installs the Playwright browser dependencies.

## Option 2: Using Docker Compose

To run the full application (frontend, backend, and database) using Docker:

1. Ensure Docker and Docker Compose are installed.
2. Create a `.env` file based on `.env.example` and update environment variables as needed.
3. Start all services:
   ```bash
   docker compose up --build
   ```
   This will launch:
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:3001
    - PostgreSQL: localhost:5432

> Use `docker compose down` to stop the services.

## Development Workflow

1. Pull the latest code from the repository
2. Install any new dependencies with `npm install`
3. Make sure your `.env` file is properly configured
4. Start both the frontend and backend servers with `npm run dev`
5. Make your changes
6. Format your code with `npm run format`
7. Run linting with `npm run lint:fix` to ensure code quality
8. Run tests with `npm test` to verify functionality
9. Test your changes manually
10. Commit and push your changes

## Testing

This project uses Playwright for end-to-end testing. The tests are located in the `tests/` directory.

### Running Tests

```bash
  # Run all tests
npm test

  # Run tests with UI for debugging
npm run test:ui
```

### Test Structure

The tests are organized to cover key functionality:

- Authentication tests (login, logout)
- Task management tests (create, read, update, delete)

### Writing New Tests

When adding new features, please add corresponding tests in the `tests/` directory. Follow the existing patterns for
structuring your tests.

## Backend API

The backend provides the following API endpoints:

### Authentication

- **POST /api/auth/login**: Authenticate a user and receive a JWT token
  ```json
  // Request
  {
    "username": "admin",
    "password": "changeme"
  }
  
  // Response
  {
    "success": true,
    "token": "jwt_token_here"
  }
  ```

### Task Management

- **GET /api/tasks**: Get all tasks for the authenticated user
- **GET /api/tasks/:id**: Get a specific task by ID
- **POST /api/tasks**: Create a new task
  ```json
  // Request
  {
    "title": "Task title",
    "description": "Task description",
    "completed": false
  }
  ```
- **PUT /api/tasks/:id**: Update an existing task
- **DELETE /api/tasks/:id**: Delete a task

All task endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## Security Considerations

This application implements several security best practices:

### Authentication

- JWT tokens for stateless authentication
- Environment variable for JWT secret (never hardcoded)
- Token expiration (1 hour by default)
- Proper authorization checks on protected routes

### API Security

- Request validation with express-validator
- CORS protection (configurable per environment)
- JSON payload size limits to prevent DoS attacks
- Token length validation to prevent oversized tokens

### Development Security

- Environment variables for sensitive information
- Proper .gitignore configuration to avoid committing sensitive files
- Dependencies kept up-to-date with latest security patches

### Security Limitations (Development Only)

- In-memory data storage (not suitable for production)
- Mock user authentication (should be replaced with proper user management in production)
- Development CORS settings allow all origins (restricted in production)

## API Structure and Configuration

The application follows a structured approach for API communication between the frontend and backend:

### API Base URL Configuration

The frontend uses a centralized API client configuration in `src/utils/apiClient.ts`:

```typescript
// Custom Axios instance with minimal headers
import axios from 'axios';

// Create a custom instance with minimal default headers
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

export default apiClient;
```

This configuration:

- Sets a common base URL (`http://localhost:3001/api`) for all API requests
- Defines standard headers used across all requests
- Creates a reusable Axios instance for consistent API communication

### Service-Level API Implementation

Each API domain has its own service file that uses the apiClient. For example, `src/services/taskService.ts` handles all
task-related API calls:

```typescript
import apiClient from '../utils/apiClient';

// The path should not include /api as it's already in the baseURL
const API_URL = '/tasks'; 

export const getTasks = async () => {
  const response = await apiClient.get(API_URL);
  return response.data;
};
```

## Environment Variables

The application uses the following environment variables:

| Variable       | Description                                  | Default               |
|----------------|----------------------------------------------|-----------------------|
| PORT           | The port the server will run on              | 3001                  |
| NODE_ENV       | Environment mode (development/production)    | development           |
| JWT_SECRET     | Secret key for signing JWT tokens            | None (required)       |
| MOCK_USER      | Username for development authentication      | admin                 |
| MOCK_PASSWORD  | Password for development authentication      | changeme              |
| API_URL        | Base URL for API (used by diagnostic script) | http://localhost:3001 |
| ALLOWED_ORIGIN | Allowed CORS origin in production            | http://localhost:3000 |

## Bootstrap UI Components

The application uses Bootstrap 5 for responsive styling and includes the following UI components:

- Navigation bar with responsive collapsing
- Cards for content containers
- Modals for confirmations and forms
- Alerts for error messages and notifications
- Progress bars for task completion tracking
- Buttons and button groups for actions
- Tables for displaying task lists
- Form controls with validation styling
- Spinners for loading indicators
- Icons from React Icons library

The UI is fully responsive and works well on mobile, tablet, and desktop screens.
