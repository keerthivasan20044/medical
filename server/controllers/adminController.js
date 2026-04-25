import User from '../models/User.js';
import Order from '../models/Order.js';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';

export async function dashboardStats(req, res) {
  const [totalUsers, activePharmacies, ordersToday, deliveries, revenue] = await Promise.all([
    User.countDocuments(),
    Pharmacy.countDocuments({ isVerified: true }),
    Order.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }),
    Order.countDocuments({ status: 'dispatched' }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }])
  ]);

  res.json({
    totalUsers,
    activePharmacies,
    ordersToday,
    deliveries,
    revenue: revenue[0]?.total || 0
  });
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
        .select('-passwordHash -refreshToken')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      User.countDocuments(query)
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
    next(err);
  }
}

export async function toggleUserStatus(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ user });
}

export async function generateReports(req, res) {
  res.json({ message: 'Reports generated', url: 'report.pdf' });
}

export async function getAnalytics(req, res) {
  const medicines = await Medicine.countDocuments();
  const pharmacies = await Pharmacy.countDocuments();
  res.json({ medicines, pharmacies });
}
