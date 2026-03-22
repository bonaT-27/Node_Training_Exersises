// src/routes/userRoutes.ts

import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

// Public routes
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;