// src/routes/healthRoutes.ts

import { Router } from 'express';
import { healthController } from '../controllers/healthController.js';
import { requestLogger } from '../middleware/logger.js';

const router = Router();

// Apply logger to health routes as well (optional)
router.use(requestLogger);

router.get('/', healthController.check);
router.get('/ready', healthController.ready);

export const healthRoutes = router;