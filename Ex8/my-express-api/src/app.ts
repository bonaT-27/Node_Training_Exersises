// app.ts
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';


const app = express();

app.use(express.json());
app.use(errorHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

// Root
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(config.port, () => {
 console.log(`Server running on http://localhost:${config.port}`);
});