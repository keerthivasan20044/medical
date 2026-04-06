import { Router } from 'express';
import { getMyProfile, updateProfile, uploadAvatar, getUserById, getUsers } from '../controllers/userController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', getUsers);
router.get('/doctors', (req, res, next) => { req.query.role = 'doctor'; next(); }, getUsers);
router.get('/doctors/:id', getUserById);
router.get('/me', verifyToken, getMyProfile);
router.put('/me', verifyToken, updateProfile);
router.put('/avatar', verifyToken, uploadAvatar);
router.get('/:id', verifyToken, authorizeRoles(['admin']), getUserById);

export default router;
