const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// CORS Configuration
// In development: Allow all origins for easier testing
// In production: Restrict to specific allowed origins
const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGIN || 'http://localhost:3000' // Specific origin in production
      : true, // Allow any origin in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
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

// Set appropriate content type for API responses
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

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
