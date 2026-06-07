import User from '../models/User.js';
import Order from '../models/Order.js';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/notify.js';

function serializeUser(user) {
  return {
    ...user,
    status: user.isActive === false ? 'suspended' : 'active'
  };
}

export async function dashboardStats(req, res) {
  try {
    const [totalUsers, activePharmacies, ordersToday, deliveries, revenue] = await Promise.all([
      User.countDocuments(),
      Pharmacy.countDocuments({ status: 'active' }),
      Order.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
      Order.countDocuments({ status: 'dispatched' }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
    ]);

    res.json({
      totalUsers: totalUsers || 0,
      activePharmacies: activePharmacies || 0,
      ordersToday: ordersToday || 0,
      deliveries: deliveries || 0,
      revenue: revenue[0]?.total || 0
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ 
      totalUsers: 0, 
      activePharmacies: 0, 
      ordersToday: 0, 
      deliveries: 0, 
      revenue: 0,
      error: 'Data aggregation failure' 
    });
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;

    const [items, total] = await Promise.all([
      User.find(query)
        .select('-password -passwordHash -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      items: items.map(serializeUser),
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      hasNext: pageNum < pages,
      hasPrev: pageNum > 1
    });
  } catch (err) {
    next(err);
  }
}

async function updateUserFlag(req, res, field, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user[field] = !user[field];
    await user.save();

    res.json({ success: true, user: serializeUser(user.toObject()) });
  } catch (err) {
    next(err);
  }
}

export async function toggleUserStatus(req, res, next) {
  return updateUserFlag(req, res, 'isActive', next);
}

export async function toggleUserVerification(req, res, next) {
  return updateUserFlag(req, res, 'isVerified', next);
}

export async function createUser(req, res, next) {
  try {
    const { name, email, phone, password, role = 'customer', isVerified = true, isActive = true, pharmacyId } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Name and email or phone are required' });
    }

    const hashedPassword = await bcrypt.hash(password || 'Password@123', 10);
    const user = await User.create({
      name,
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      password: hashedPassword,
      role,
      isVerified,
      isActive,
      pharmacyId: pharmacyId || undefined
    });

    const safe = user.toObject();
    delete safe.password;
    res.status(201).json({ success: true, user: serializeUser(safe), item: serializeUser(safe) });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const allowed = ['name', 'email', 'phone', 'role', 'isActive', 'isVerified', 'pharmacyId'];
    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key] || undefined;
    });
    if (req.body.password) data.password = await bcrypt.hash(req.body.password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    }).select('-password -passwordHash -refreshToken');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: serializeUser(user.toObject()), item: serializeUser(user.toObject()) });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, refreshToken: null },
      { new: true }
    ).select('-password -passwordHash -refreshToken');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: serializeUser(user.toObject()) });
  } catch (err) {
    next(err);
  }
}

export async function generateReports(req, res) {
  res.json({ message: 'Reports generated', url: 'report.pdf' });
}

export async function getAnalytics(req, res) {
  const medicines = await Medicine.countDocuments();
  const pharmacies = await Pharmacy.countDocuments();
  res.json({ medicines, pharmacies });
}

export async function sendTestEmail(req, res, next) {
  try {
    const to = req.body?.to || req.user?.email || process.env.SMTP_USER;
    if (!to) return res.status(400).json({ success: false, message: 'Recipient email is required' });

    const result = await sendEmail(
      to,
      'MediReach email test',
      'Your MediReach Nodemailer setup is working. Customers can receive order, OTP, and delivery updates by email.'
    );

    res.json({
      success: result?.ok !== false,
      simulated: Boolean(result?.simulated),
      message: result?.simulated ? 'SMTP is not configured. Email was simulated in server logs.' : 'Test email sent.',
      result
    });
  } catch (err) {
    next(err);
  }
}
