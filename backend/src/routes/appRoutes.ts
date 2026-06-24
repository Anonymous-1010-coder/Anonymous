import { Router } from 'express';
import {
  uploadApp,
  listApps,
  getApp,
  downloadApp,
  getMyApps,
  deleteApp,
  getFeaturedApps,
} from '../controllers/appController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { uploadFields } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/featured', getFeaturedApps);
router.get('/list', optionalAuth, listApps);
router.get('/my', authenticate, getMyApps);
router.get('/:id', optionalAuth, getApp);
router.get('/:id/download', downloadApp);
router.post('/upload', authenticate, uploadLimiter, uploadFields, uploadApp);
router.delete('/:id', authenticate, deleteApp);

export default router;
