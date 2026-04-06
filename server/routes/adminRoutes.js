import { Router } from 'express';
import { dashboardStats, getAllUsers, toggleUserStatus, generateReports, getAnalytics } from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles(['admin']), dashboardStats);
router.get('/users', verifyToken, authorizeRoles(['admin']), getAllUsers);
router.put('/users/:id', verifyToken, authorizeRoles(['admin']), toggleUserStatus);
router.get('/reports', verifyToken, authorizeRoles(['admin']), generateReports);
router.get('/analytics', verifyToken, authorizeRoles(['admin']), getAnalytics);

export default router;
