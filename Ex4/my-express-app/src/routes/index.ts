// src/routes/index.ts

import { Router } from 'express';
import userRoutes from './userRoutes.js';

const router = Router();

router.use('/api/users', userRoutes);

// Health check
router.get('/health', (_req, res) => {  // Prefix with _ for unused parameter
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;