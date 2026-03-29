// routes/authRoutes.ts
import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected route
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Protected data', user: (req as any).user });
});

// Admin only
router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin only access' });
});

export default router;