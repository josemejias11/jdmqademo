# JDM QA Demo Application

A full-stack task management application with authentication built using React, TypeScript, and Express.

## Project Overview

This application demonstrates modern web development practices including:

- TypeScript integration for type-safe code
- RESTful API architecture
- JWT-based authentication
- React Context API for state management
- Form validation with Formik and Yup
- Modular backend architecture
- Code quality tools (ESLint & Prettier)

## Tech Stack

### Frontend
- React 19
- TypeScript
- React Router for navigation
- Formik & Yup for form handling and validation
- Bootstrap for styling
- Axios for API requests

### Backend
- Express.js
- JWT for authentication
- Express Validator for request validation

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
│   ├── routes/           # Frontend routes
│   ├── services/         # API service functions
│   ├── utils/            # Helper functions
│   └── types.ts          # TypeScript type definitions
├── .env                  # Environment variables
├── .eslintrc.js          # ESLint configuration
├── .prettierrc.js        # Prettier configuration
├── package.json          # Project dependencies and scripts
├── server.js             # Express server entry point
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

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

3. Create a `.env` file in the root directory with the following:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the development servers:
   ```bash
   # In one terminal - start the React development server
   npm start
   
   # In another terminal - start the Express server
   npm run dev
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the frontend app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run dev`

Runs the backend Express server with nodemon for automatic reloading.

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

Set up for Playwright tests (not yet configured).

## Development Workflow

1. Pull the latest code from the repository
2. Install any new dependencies with `npm install`
3. Start both the frontend and backend servers as described above
4. Make your changes
5. Format your code with `npm run format`
6. Run linting with `npm run lint:fix` to ensure code quality
7. Test your changes locally
8. Commit and push your changes

## Backend API

The backend provides the following API endpoints:

### Authentication

- **POST /api/auth/login**: Authenticate a user and receive a JWT token
  ```json
  // Request
  {
    "username": "user",
    "password": "password"
  }
  
  // Response
  {
    "success": true,
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "user"
    }
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
    "description": "Task description"
  }
  ```
- **PUT /api/tasks/:id**: Update an existing task
- **DELETE /api/tasks/:id**: Delete a task

All task endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token
```
