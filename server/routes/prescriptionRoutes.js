import { Router } from 'express';
import { 
  uploadPrescription, 
  getMyPrescriptions, 
  getPrescriptionById, 
  getPharmacyQueue,
  getAllPrescriptions,
  updatePrescription,
  approvePrescription, 
  rejectPrescription,
  deletePrescription
} from '../controllers/prescriptionController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// Customer routes
router.post('/', verifyToken, upload.single('image'), uploadPrescription);
router.get('/me', verifyToken, getMyPrescriptions);
router.get('/admin', verifyToken, authorizeRoles(['admin']), getAllPrescriptions);
router.get('/pharmacy', verifyToken, authorizeRoles(['pharmacist', 'admin']), getPharmacyQueue);
router.get('/:id', verifyToken, getPrescriptionById);
router.put('/:id', verifyToken, authorizeRoles(['admin']), updatePrescription);
router.delete('/:id', verifyToken, deletePrescription);

// Pharmacist routes
router.put('/:id/approve', verifyToken, authorizeRoles(['pharmacist', 'admin']), approvePrescription);
router.put('/:id/verify', verifyToken, authorizeRoles(['pharmacist', 'admin']), approvePrescription);
router.put('/:id/reject', verifyToken, authorizeRoles(['pharmacist', 'admin']), rejectPrescription);

export default router;
