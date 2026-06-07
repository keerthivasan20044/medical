import mongoose from 'mongoose';
import Prescription from '../models/Prescription.js';
import Notification from '../models/Notification.js';
import Order from '../models/Order.js';
import { getIO } from '../config/socket.js';

export async function uploadPrescription(req, res) {
  try {
    const { doctor, doctorName, medicines, diagnosis, notes, orderId, pharmacyId } = req.body;
    
    const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    const fallbackDataUrl = req.file?.buffer
      ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
      : '';
    const imageUrl = req.file?.path || fallbackDataUrl;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Prescription file is required' });
    }
    
    const itemData = {
      customerId: req.user.id,
      imageUrl,
      publicId: req.file?.filename || req.file?.originalname || '',
      medicines: medicines ? (typeof medicines === 'string' ? JSON.parse(medicines) : medicines) : [],
      diagnosis,
      notes,
      status: 'pending'
    };

    if (orderId && isObjectId(orderId)) itemData.orderId = orderId;
    if (pharmacyId && isObjectId(pharmacyId)) itemData.pharmacyId = pharmacyId;

    if (doctor && isObjectId(doctor)) {
      itemData.doctor = doctor;
    } else if (doctor || doctorName) {
      itemData.doctorName = doctor || doctorName;
    }

    const item = await Prescription.create(itemData);

    // Link to order if provided
    if (orderId && isObjectId(orderId)) {
      await Order.findByIdAndUpdate(orderId, {
        prescriptionUrl: item.imageUrl,
        prescriptionId: item._id
      });
    }

    try {
      const io = getIO();
      io.to('pharmacist').emit('prescription:new', {
        prescriptionId: item._id,
        customerId: req.user.id,
        orderId,
        imageUrl: item.imageUrl
      });
    } catch (e) {}

    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMyPrescriptions(req, res) {
  try {
    const items = await Prescription.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPrescriptionById(req, res) {
  try {
    const item = await Prescription.findById(req.params.id)
      .populate('customerId', 'name phone email')
      .populate('pharmacyId', 'name address');
    if (!item) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPharmacyQueue(req, res) {
  try {
    const query = {};
    if (req.user.role === 'pharmacist' && req.user.pharmacyId) {
      query.pharmacyId = req.user.pharmacyId;
    }
    
    const items = await Prescription.find(query)
      .populate('customerId', 'name phone email avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getAllPrescriptions(req, res) {
  try {
    const { page = 1, limit = 20, status, search, pharmacyId } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (status && status !== 'all') query.status = status;
    if (pharmacyId && mongoose.Types.ObjectId.isValid(pharmacyId)) query.pharmacyId = pharmacyId;

    let customerIds = null;
    if (search) {
      const User = mongoose.model('User');
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      customerIds = users.map((user) => user._id);
      query.$or = [
        { doctorName: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { customerId: { $in: customerIds } }
      ];
    }

    const [items, total] = await Promise.all([
      Prescription.find(query)
        .populate('customerId', 'name phone email')
        .populate('pharmacyId', 'name city address')
        .populate('pharmacistId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Prescription.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limitNum);
    res.json({
      success: true,
      items,
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      hasNext: pageNum < pages,
      hasPrev: pageNum > 1
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updatePrescription(req, res) {
  try {
    const allowed = ['doctorName', 'diagnosis', 'notes', 'expiryDate', 'status', 'pharmacyId'];
    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });

    if (data.status === 'approved') {
      data.approvedAt = new Date();
      data.pharmacistId = req.user.id;
    }
    if (data.status === 'rejected') {
      data.rejectedAt = new Date();
      data.rejectedBy = req.user.id;
      data.rejectionReason = req.body.rejectionReason || req.body.reason || 'Rejected by admin';
    }

    const item = await Prescription.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    })
      .populate('customerId', 'name phone email')
      .populate('pharmacyId', 'name city address');

    if (!item) return res.status(404).json({ message: 'Prescription not found' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function approvePrescription(req, res) {
  try {
    const item = await Prescription.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedAt: new Date(), pharmacistId: req.user.id },
      { new: true }
    ).populate('customerId', 'name phone email');

    if (!item) return res.status(404).json({ message: 'Prescription not found' });

    const notif = await Notification.create({
      user: item.customerId._id,
      title: 'Prescription Approved',
      body: 'Your prescription has been approved by the pharmacist.',
      type: 'prescription',
      icon: 'shield'
    });

    try {
      const io = getIO();
      io.to(`user:${item.customerId._id}`).emit('prescription:approved', {
        prescriptionId: item._id,
        status: 'approved',
        notif
      });
      io.to(`user:${item.customerId._id}`).emit('notification:new', notif);
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
    ).populate('customerId', 'name phone email');

    if (!item) return res.status(404).json({ message: 'Prescription not found' });

    const notif = await Notification.create({
      user: item.customerId._id,
      title: 'Prescription Issue',
      body: `Prescription rejected: ${reason}.`,
      type: 'prescription',
      icon: 'alert'
    });

    try {
      const io = getIO();
      io.to(`user:${item.customerId._id}`).emit('prescription:rejected', {
        prescriptionId: item._id,
        status: 'rejected',
        reason,
        notif
      });
      io.to(`user:${item.customerId._id}`).emit('notification:new', notif);
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
    
    if (item.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
