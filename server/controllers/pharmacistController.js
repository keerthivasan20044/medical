import Order from '../models/Order.js';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

async function getPharmaciesForUser(user) {
  const ids = new Set();

  if (user?.pharmacyId && mongoose.Types.ObjectId.isValid(user.pharmacyId)) {
    ids.add(String(user.pharmacyId));
  }

  if (user?.id && mongoose.Types.ObjectId.isValid(user.id)) {
    const owned = await Pharmacy.find({ owner: user.id }).select('_id').lean();
    owned.forEach((pharmacy) => ids.add(String(pharmacy._id)));
  }

  if (!ids.size) return [];
  return Pharmacy.find({ _id: { $in: [...ids] } });
}

async function getPrimaryPharmacyForUser(user) {
  const pharmacies = await getPharmaciesForUser(user);
  return pharmacies[0] || null;
}

function pharmacyQuery(pharmacies) {
  return { $in: pharmacies.map((pharmacy) => pharmacy._id) };
}

export const getPharmacistStats = async (req, res) => {
  try {
    const pharmacies = await getPharmaciesForUser(req.user);
    if (!pharmacies.length) {
      return res.json({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalMedicines: 0,
        lowStockCount: 0,
        warning: 'No pharmacy associated with this account'
      });
    }
    const pharmacyId = pharmacyQuery(pharmacies);

    const [totalOrders, pendingOrders, totalRevenue, totalMedicines, lowStockCount] = await Promise.all([
      Order.countDocuments({ pharmacyId }),
      Order.countDocuments({ pharmacyId, status: { $in: ['pending', 'confirmed', 'preparing'] } }),
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
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getPharmacistProfile = async (req, res) => {
  try {
    const [user, pharmacies] = await Promise.all([
      User.findById(req.user.id).select('-password -passwordHash -refreshToken').lean(),
      getPharmaciesForUser(req.user)
    ]);

    res.json({ user, pharmacy: pharmacies[0] || null, pharmacies });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const updatePharmacistProfile = async (req, res) => {
  try {
    const { user: userInput = {}, pharmacy: pharmacyInput = {} } = req.body;
    const userUpdate = {};
    ['name', 'phone', 'email'].forEach((key) => {
      if (userInput[key] !== undefined) userUpdate[key] = userInput[key];
    });

    const pharmacyUpdate = {};
    ['name', 'address', 'city', 'state', 'pincode', 'email'].forEach((key) => {
      if (pharmacyInput[key] !== undefined) pharmacyUpdate[key] = pharmacyInput[key];
    });
    if (pharmacyInput.phone !== undefined) {
      pharmacyUpdate.phone = Array.isArray(pharmacyInput.phone)
        ? pharmacyInput.phone
        : String(pharmacyInput.phone).split(',').map((item) => item.trim()).filter(Boolean);
    }

    const pharmacy = await getPrimaryPharmacyForUser(req.user);
    const [user, updatedPharmacy] = await Promise.all([
      Object.keys(userUpdate).length
        ? User.findByIdAndUpdate(req.user.id, userUpdate, { new: true }).select('-password -passwordHash -refreshToken')
        : User.findById(req.user.id).select('-password -passwordHash -refreshToken'),
      pharmacy && Object.keys(pharmacyUpdate).length
        ? Pharmacy.findByIdAndUpdate(pharmacy._id, pharmacyUpdate, { new: true, runValidators: true })
        : pharmacy
    ]);

    res.json({ user, pharmacy: updatedPharmacy });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getPharmacistEarnings = async (req, res) => {
  try {
    const pharmacies = await getPharmaciesForUser(req.user);
    if (!pharmacies.length) return res.json({ totalRevenue: 0, availableSettlement: 0, commission: 0, transactions: [], chart: [] });

    const orders = await Order.find({ pharmacyId: pharmacyQuery(pharmacies), status: 'delivered' })
      .select('orderNumber totalAmount createdAt paymentStatus')
      .sort({ createdAt: -1 })
      .lean();

    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const commission = Math.round(totalRevenue * 0.1);
    const availableSettlement = Math.max(0, totalRevenue - commission);
    const chartMap = new Map();
    orders.forEach((order) => {
      const date = new Date(order.createdAt).toISOString().slice(0, 10);
      chartMap.set(date, (chartMap.get(date) || 0) + (Number(order.totalAmount) || 0));
    });

    res.json({
      totalRevenue,
      availableSettlement,
      commission,
      transactions: orders.slice(0, 20).map((order) => ({
        id: order._id,
        order: order.orderNumber,
        type: 'Credit',
        amount: order.totalAmount,
        date: order.createdAt,
        status: order.paymentStatus === 'paid' ? 'Completed' : 'Pending'
      })),
      chart: [...chartMap.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-7).map(([date, amount]) => ({ date, amount }))
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getPharmacistAnalytics = async (req, res) => {
  try {
    const pharmacies = await getPharmaciesForUser(req.user);
    if (!pharmacies.length) return res.json({ topMedicines: [], peakHours: [], repeatRate: 0, avgBasketValue: 0, serviceVelocity: 'N/A' });

    const pharmacyId = pharmacyQuery(pharmacies);
    const [topMedicines, peakHours, deliveredStats, customers] = await Promise.all([
      Order.aggregate([
        { $match: { pharmacyId } },
        { $unwind: '$items' },
        { $group: { _id: '$items.medicine', sales: { $sum: '$items.quantity' } } },
        { $sort: { sales: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'medicines', localField: '_id', foreignField: '_id', as: 'medicine' } },
        { $unwind: { path: '$medicine', preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ['$medicine.name', 'Medicine'] }, sales: 1 } }
      ]),
      Order.aggregate([
        { $match: { pharmacyId } },
        { $group: { _id: { $hour: '$createdAt' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { pharmacyId } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { pharmacyId } },
        { $group: { _id: '$customerId', count: { $sum: 1 } } }
      ])
    ]);

    const stats = deliveredStats[0] || { total: 0, count: 0 };
    const repeatCustomers = customers.filter((customer) => customer.count > 1).length;
    const repeatRate = customers.length ? Math.round((repeatCustomers / customers.length) * 100) : 0;

    res.json({
      topMedicines,
      peakHours: peakHours.map((item) => ({ hour: `${item._id}:00`, orders: item.orders })),
      repeatRate,
      avgBasketValue: stats.count ? Math.round(stats.total / stats.count) : 0,
      serviceVelocity: stats.count > 0 ? 'FAST' : 'N/A'
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getPharmacistInventory = async (req, res) => {
  try {
    const pharmacies = await getPharmaciesForUser(req.user);
    const { page = 1, limit = 20, q, search } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    if (!pharmacies.length) {
      return res.json({
        success: true,
        items: [],
        total: 0,
        page: pageNum,
        pages: 0,
        limit: limitNum,
        hasNext: false,
        hasPrev: false,
        warning: 'No pharmacy associated with this account'
      });
    }

    const query = { pharmacyId: pharmacyQuery(pharmacies), isActive: { $ne: false } };
    const searchTerm = q || search;
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Medicine.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Medicine.countDocuments(query)
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
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

// GET /api/pharmacist/low-stock
// Returns medicines with stock <= threshold (default 10 units)
export const getLowStockAlerts = async (req, res) => {
  try {
    const pharmacies = await getPharmaciesForUser(req.user);
    if (!pharmacies.length) return res.json({ items: [], total: 0, threshold: parseInt(req.query.threshold) || 10, warning: 'No pharmacy associated with this account' });
    const threshold = parseInt(req.query.threshold) || 10;

    const medicines = await Medicine.find({
      pharmacyId: pharmacyQuery(pharmacies),
      stock: { $lte: threshold }
    })
      .select('name genericName category stock unit price')
      .sort({ stock: 1 }); // Lowest stock first

    res.json({ items: medicines, total: medicines.length, threshold });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
