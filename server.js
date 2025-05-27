const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./server/routes/authRoutes');
const taskRoutes = require('./server/routes/taskRoutes');

// Import middleware
const errorHandler = require('./server/middleware/errorHandler');
const notFound = require('./server/middleware/notFound');
const requestLogger = require('./server/middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for CORS with specific options
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow only the frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
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
