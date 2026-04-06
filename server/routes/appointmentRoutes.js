import { Router } from 'express';
import { bookAppointment, getMyAppointments, updateAppointment } from '../controllers/appointmentController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, bookAppointment);
router.get('/me', verifyToken, getMyAppointments);
router.put('/:id', verifyToken, updateAppointment);

export default router;
