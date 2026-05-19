import { Router } from 'express';
import { bookAppointment, getMyAppointments, updateAppointment, getAllAppointments } from '../controllers/appointmentController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', verifyToken, authorizeRoles(['admin']), getAllAppointments);
router.post('/', verifyToken, bookAppointment);
router.get('/me', verifyToken, getMyAppointments);
router.put('/:id', verifyToken, updateAppointment);

export default router;
