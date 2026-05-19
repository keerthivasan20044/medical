import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getMyNotifications, markRead, markAllRead, createNotification } from '../controllers/notificationController.js';

const router = Router();

router.get('/', verifyToken, getMyNotifications);
// IMPORTANT: /read/all must come BEFORE /:id/read to avoid Express
// treating 'read' as the :id parameter and calling markRead instead.
router.put('/read/all', verifyToken, markAllRead);
router.put('/:id/read', verifyToken, markRead);
router.post('/', verifyToken, createNotification);

export default router;
