// src/app.ts

import express from 'express';
import routes from './routes/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use(routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on http://localhost:${PORT}
  📋 API endpoints:
     GET    /api/users          - Get all users
     GET    /api/users/:id      - Get user by ID
     POST   /api/users          - Create user
     PUT    /api/users/:id      - Update user
     DELETE /api/users/:id      - Delete user
     GET    /health             - Health check
  `);
});

export default app;