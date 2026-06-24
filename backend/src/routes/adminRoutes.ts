import { Router } from 'express';
import { authenticate, requireSuperAdmin } from '../middleware/auth';
import { listUsers, createUser, updateUserRole, toggleBan, updateUserCredentials, deleteUser } from '../controllers/adminController';

const router = Router();

router.get('/users', authenticate, requireSuperAdmin, listUsers);
router.post('/users', authenticate, requireSuperAdmin, createUser);
router.patch('/users/:id/role', authenticate, requireSuperAdmin, updateUserRole);
router.patch('/users/:id/ban', authenticate, requireSuperAdmin, toggleBan);
router.patch('/users/:id/credentials', authenticate, requireSuperAdmin, updateUserCredentials);
router.delete('/users/:id', authenticate, requireSuperAdmin, deleteUser);

export default router;
