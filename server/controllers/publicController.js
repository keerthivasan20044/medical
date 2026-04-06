import User from '../models/User.js';
import Order from '../models/Order.js';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';

export async function getPublicStats(req, res) {
  try {
    const [totalUsers, activePharmacies, totalMedicines, totalOrders] = await Promise.all([
      User.countDocuments(),
      Pharmacy.countDocuments({ isVerified: true }),
      Medicine.countDocuments(),
      Order.countDocuments()
    ]);

    res.json({
      totalUsers: totalUsers + 1240, // baseline + real
      activePharmacies,
      totalMedicines: totalMedicines + 4500, // baseline + real
      totalOrders: totalOrders + 820 // baseline + real
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error pulse lost.' });
  }
}
