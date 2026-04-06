import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getMyNotifications, markRead, markAllRead, createNotification } from '../controllers/notificationController.js';

const router = Router();

router.get('/', verifyToken, getMyNotifications);
router.put('/:id/read', verifyToken, markRead);
router.put('/read/all', verifyToken, markAllRead);
router.post('/', verifyToken, createNotification);

export default router;
