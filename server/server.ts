import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import requestLogger from './middleware/requestLogger.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// CORS Configuration
interface CorsOptions {
  origin: boolean | string | string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
      : [
          process.env.FRONTEND_URL || 'http://localhost:3000',
          'http://localhost:3000',
          'http://127.0.0.1:3000'
        ], // Allow local development hosts
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-test-session-id'],
  credentials: true,
  maxAge: 86400
};

// Apply CORS middleware with our configuration
app.use(cors(corsOptions));

// Log CORS configuration on startup
console.log(
  `CORS configured with origin: ${
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
      : 'Any origin (development mode)'
  }`
);

// Parse JSON with a limit to prevent large payloads
app.use(express.json({ limit: '10kb' }));

// Request logging for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}

// Health check root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.head('/', (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// Health check route at /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Set appropriate content type for API responses
const setJsonContentType = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  next();
};

app.use('/api', setJsonContentType);

// Routes
app.use('/api/auth', authRoutes);

import { body } from 'express-validator';
import validate from './middleware/validate.js';
import auth from './middleware/auth.js';
import { AuthenticatedRequest, CustomError } from './types/index.js';
import { SessionTaskStore } from './models/SessionTaskStore.js';

const taskValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be at most 500 characters'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
];

// GET /api/tasks
app.get('/api/tasks', auth as express.RequestHandler, (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const sessionId = (req.header('x-test-session-id') || 'default') as string;
    const userTasks = SessionTaskStore.findByUserId(sessionId, authReq.user.username);
    res.json({ success: true, data: userTasks });
  } catch (err) {
    next(err);
  }
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', auth as express.RequestHandler, (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest<{ id: string }>;
    const sessionId = (req.header('x-test-session-id') || 'default') as string;
    const task = SessionTaskStore.findById(sessionId, authReq.params.id, authReq.user.username);
    if (!task) {
      const error = new Error('Task not found') as CustomError;
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
app.post(
  '/api/tasks',
  auth as express.RequestHandler,
  taskValidationRules,
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest<Record<string, never>, unknown, { title: string; description?: string }>;
      const sessionId = (req.header('x-test-session-id') || 'default') as string;
      const { title, description } = authReq.body;
      const task = SessionTaskStore.create(sessionId, {
        title,
        description,
        userId: authReq.user.username
      });
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }
);

// PUT /api/tasks/:id
app.put(
  '/api/tasks/:id',
  auth as express.RequestHandler,
  taskValidationRules,
  validate,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest<{ id: string }, unknown, { title?: string; description?: string; completed?: boolean }>;
      const sessionId = (req.header('x-test-session-id') || 'default') as string;
      const { title, description, completed } = authReq.body;
      const updatedTask = SessionTaskStore.update(sessionId, authReq.params.id, authReq.user.username, {
        title,
        description,
        completed
      });
      if (!updatedTask) {
        const error = new Error('Task not found') as CustomError;
        error.statusCode = 404;
        return next(error);
      }
      res.json({ success: true, data: updatedTask });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', auth as express.RequestHandler, (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest<{ id: string }>;
    const sessionId = (req.header('x-test-session-id') || 'default') as string;
    const deleted = SessionTaskStore.delete(sessionId, authReq.params.id, authReq.user.username);
    if (!deleted) {
      const error = new Error('Task not found') as CustomError;
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
