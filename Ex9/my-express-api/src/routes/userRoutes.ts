import { Router } from 'express';
import { fetchUsers, fetchUserById } from '../controllers/userController.js';

const router = Router();

router.get('/', fetchUsers);
router.get('/:id', fetchUserById);

export default router;