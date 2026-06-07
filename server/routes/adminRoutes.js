import { Router } from 'express';
import {
  dashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  toggleUserVerification,
  generateReports,
  getAnalytics,
  sendTestEmail
} from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', verifyToken, authorizeRoles(['admin']), dashboardStats);
router.get('/users', verifyToken, authorizeRoles(['admin']), getAllUsers);
router.post('/users', verifyToken, authorizeRoles(['admin']), createUser);
router.patch('/users/:id/toggle', verifyToken, authorizeRoles(['admin']), toggleUserStatus);
router.patch('/users/:id/verify', verifyToken, authorizeRoles(['admin']), toggleUserVerification);
router.put('/users/:id', verifyToken, authorizeRoles(['admin']), updateUser);
router.delete('/users/:id', verifyToken, authorizeRoles(['admin']), deleteUser);
router.get('/reports', verifyToken, authorizeRoles(['admin']), generateReports);
router.get('/analytics', verifyToken, authorizeRoles(['admin']), getAnalytics);
router.post('/email/test', verifyToken, authorizeRoles(['admin']), sendTestEmail);

export default router;
