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

export async function getAllUsers(req, res) {
  const items = await User.find().select('-passwordHash -refreshToken');
  res.json({ items });
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
