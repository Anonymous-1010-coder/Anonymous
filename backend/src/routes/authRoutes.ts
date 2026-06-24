import { Router } from 'express';
import { login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

// Registration disabled — only superadmin can create accounts
router.post('/login', authLimiter, login);
router.get('/profile', authenticate, getProfile);

export default router;
