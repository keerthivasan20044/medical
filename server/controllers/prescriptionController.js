import mongoose from 'mongoose';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import { getIO } from '../config/socket.js';

export async function uploadPrescription(req, res) {
  try {
    const { doctor, doctorName, medicines, diagnosis, notes, orderId } = req.body;
    
    // Logic to determine if 'doctor' is an ID or a Name
    const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    
    const itemData = {
      patient: req.user.id,
      imageUrl: req.file?.path || '',
      publicId: req.file?.filename || '',
      medicines: medicines ? (typeof medicines === 'string' ? JSON.parse(medicines) : medicines) : [],
      diagnosis,
      notes,
      orderId,
      status: 'pending'
    };

    if (doctor && isObjectId(doctor)) {
      itemData.doctor = doctor;
    } else if (doctor || doctorName) {
      itemData.doctorName = doctor || doctorName;
    }

    const item = await Prescription.create(itemData);

    // Link to order if provided
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'prescription.url': item.imageUrl,
        'prescription.publicId': item.publicId,
        prescriptionId: item._id
      });
    }

    // Emit to pharmacist rooms for real-time queue
    try {
      const io = getIO();
      io.to('pharmacist').emit('prescription:new', {
        prescriptionId: item._id,
        patientId: req.user.id,
        orderId,
        imageUrl: item.imageUrl,
        createdAt: item.createdAt
      });
      io.emit('activity:new', {
        type: 'prescription_upload',
        message: `New clinical manifest uploaded for review in Karaikal district`,
        location: 'Pharmacy Vault',
        timestamp: new Date()
      });
    } catch (e) { /* socket not ready */ }

    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMyPrescriptions(req, res) {
  try {
    const items = await Prescription.find({ patient: req.user.id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPrescriptionById(req, res) {
  try {
    const item = await Prescription.findById(req.params.id).populate('patient', 'name phone email');
    if (!item) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// GET all for pharmacist queue
export async function getPharmacyQueue(req, res) {
  try {
    const items = await Prescription.find()
      .populate('patient', 'name phone email avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function verifyPrescription(req, res) {
  try {
    const item = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status: 'verified', verifiedAt: new Date(), verifiedBy: req.user.id },
      { new: true }
    ).populate('patient', 'name phone email');

    if (!item) return res.status(404).json({ message: 'Prescription not found' });

    // Create customer notification
    const notif = await Notification.create({
      user: item.patient._id,
      title: '✅ Prescription Verified',
      body: 'Your prescription has been approved. Your order is being prepared.',
      type: 'prescription',
      icon: 'shield'
    });

    // Real-time event to customer
    try {
      const io = getIO();
      io.to(`user:${item.patient._id}`).emit('prescription:verified', {
        prescriptionId: item._id,
        status: 'verified',
        notif
      });
      io.to(`user:${item.patient._id}`).emit('notification:new', notif);
    } catch (e) {}

    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function rejectPrescription(req, res) {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Rejection reason required' });

    const item = await Prescription.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date(),
        rejectedBy: req.user.id
      },
      { new: true }
    ).populate('patient', 'name phone email');

    if (!item) return res.status(404).json({ message: 'Prescription not found' });

    // Create customer notification
    const notif = await Notification.create({
      user: item.patient._id,
      title: '❌ Prescription Issue',
      body: `Prescription rejected: ${reason}. Please upload a clearer image or a valid prescription.`,
      type: 'prescription',
      icon: 'alert'
    });

    // Real-time event to customer
    try {
      const io = getIO();
      io.to(`user:${item.patient._id}`).emit('prescription:rejected', {
        prescriptionId: item._id,
        status: 'rejected',
        reason,
        notif
      });
      io.to(`user:${item.patient._id}`).emit('notification:new', notif);
    } catch (e) {}

    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function deletePrescription(req, res) {
  try {
    const item = await Prescription.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Prescription not found' });
    
    // Only owner can delete
    if (item.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
