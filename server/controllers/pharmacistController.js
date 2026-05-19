import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';
import { getIO } from '../config/socket.js';

// Helper: find pharmacy for the logged-in pharmacist
async function getPharmacyForUser(userId) {
  const pharmacy = await Pharmacy.findOne({ owner: userId });
  if (!pharmacy) throw new Error('Pharmacy not found for this user');
  return pharmacy;
}

export const getPharmacistStats = async (req, res) => {
  try {
    const pharmacy = await getPharmacyForUser(req.user.id);
    const pharmacyId = pharmacy._id;

    const [totalOrders, pendingOrders, totalRevenue, totalMedicines, lowStockCount] = await Promise.all([
      Order.countDocuments({ pharmacyId }),
      Order.countDocuments({ pharmacyId, status: { $in: ['placed', 'confirmed', 'processing'] } }),
      Order.aggregate([
        { $match: { pharmacyId, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Medicine.countDocuments({ pharmacyId }),
      Medicine.countDocuments({ pharmacyId, stock: { $lte: 10 } })
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalMedicines,
      lowStockCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPharmacistInventory = async (req, res) => {
  try {
    const pharmacy = await getPharmacyForUser(req.user.id);
    const medicines = await Medicine.find({ pharmacyId: pharmacy._id });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/pharmacist/low-stock
// Returns medicines with stock <= threshold (default 10 units)
export const getLowStockAlerts = async (req, res) => {
  try {
    const pharmacy = await getPharmacyForUser(req.user.id);
    const threshold = parseInt(req.query.threshold) || 10;

    const medicines = await Medicine.find({
      pharmacyId: pharmacy._id,
      stock: { $lte: threshold }
    })
      .select('name genericName category stock unit price')
      .sort({ stock: 1 }); // Lowest stock first

    res.json({ items: medicines, total: medicines.length, threshold });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
