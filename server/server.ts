import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import requestLogger from './middleware/requestLogger.js';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// CORS Configuration
interface CorsOptions {
  origin: boolean | string;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

const corsOptions: CorsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
      : 'http://localhost:3000', // Explicitly allow frontend in dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

// Request logging for debugging
app.use(requestLogger);

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
app.use('/api/tasks', taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});