import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth';
import { reportDevice, getAllDevices, deleteDevice } from '../controllers/deviceController';

const router = Router();

router.post('/report', authenticate, reportDevice);
router.get('/list', authenticate, requireAdmin, getAllDevices);
router.delete('/:id', authenticate, requireAdmin, deleteDevice);

export default router;
