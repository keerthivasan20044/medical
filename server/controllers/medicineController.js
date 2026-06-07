import mongoose from 'mongoose';
import Medicine from '../models/Medicine.js';
import Pharmacy from '../models/Pharmacy.js';

async function resolvePharmaciesForUser(user) {
  const ids = new Set();

  if (user?.pharmacyId && mongoose.Types.ObjectId.isValid(user.pharmacyId)) {
    ids.add(String(user.pharmacyId));
  }

  if (user?.id && mongoose.Types.ObjectId.isValid(user.id)) {
    const owned = await Pharmacy.find({ owner: user.id }).select('_id').lean();
    owned.forEach((pharmacy) => ids.add(String(pharmacy._id)));
  }

  if (!ids.size) return [];
  return Pharmacy.find({ _id: { $in: [...ids] } }).select('_id').lean();
}

async function resolvePrimaryPharmacyForUser(user) {
  const pharmacies = await resolvePharmaciesForUser(user);
  return pharmacies[0] || null;
}

async function canManageMedicine(user, medicine) {
  if (user?.role === 'admin') return true;
  const pharmacies = await resolvePharmaciesForUser(user);
  return pharmacies.some((pharmacy) => String(medicine.pharmacyId) === String(pharmacy._id));
}

export async function getAllMedicines(req, res, next) {
  try {
    const { 
      q, search, category, pharmacyId, minPrice, maxPrice, 
      requiresPrescription, stock, inStock, sort, page = 1, limit = 20
    } = req.query;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const query = { isActive: { $ne: false } };
    const searchTerm = q || search;

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
        { therapeuticClass: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const toList = (value) => {
      if (!value) return [];
      return Array.isArray(value) ? value : String(value).split(',');
    };

    const categories = toList(category).filter(Boolean);
    const pharmacyIds = toList(pharmacyId).filter(Boolean);

    if (categories.length === 1) query.category = categories[0];
    if (categories.length > 1) query.category = { $in: categories };
    if (pharmacyIds.length === 1) query.pharmacyId = pharmacyIds[0];
    if (pharmacyIds.length > 1) query.pharmacyId = { $in: pharmacyIds };
    
    // Auto-filter for pharmacists
    if (req.user && req.user.role === 'pharmacist') {
       const pharmacies = await resolvePharmaciesForUser(req.user);
       query.pharmacyId = { $in: pharmacies.map((pharmacy) => pharmacy._id) };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (requiresPrescription !== undefined) query.requiresPrescription = requiresPrescription === 'true';
    if (stock === 'In Stock' || inStock === 'true') query.stock = { $gt: 0 };

    let sortOption = { createdAt: -1, _id: -1 };
    if (sort === 'price_asc') sortOption = { price: 1, _id: 1 };
    if (sort === 'price_desc') sortOption = { price: -1, _id: -1 };
    if (sort === 'rating') sortOption = { rating: -1, _id: -1 };

    const [items, total] = await Promise.all([
      Medicine.find(query)
        .populate('pharmacyId', 'name address phone')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
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
    next(err);
  }
}

export async function getMedicineById(req, res) {
  try {
    const item = await Medicine.findById(req.params.id).populate('pharmacyId');
    if (!item) return res.status(404).json({ message: 'Medicine SKU not found.' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving inventory data.', error: err.message });
  }
}

export async function createMedicine(req, res) {
  try {
    const data = { ...req.body };

    if (req.user?.role === 'pharmacist') {
      const pharmacy = await resolvePrimaryPharmacyForUser(req.user);
      if (!pharmacy) {
        return res.status(400).json({ message: 'No pharmacy is linked to this pharmacist account.' });
      }
      data.pharmacyId = pharmacy._id;
    } else if (data.pharmacyId && !mongoose.Types.ObjectId.isValid(data.pharmacyId)) {
      return res.status(400).json({ message: 'Invalid pharmacy selected.' });
    }

    data.price = data.price === '' || data.price === undefined ? 0 : Number(data.price);
    data.mrp = data.mrp === '' || data.mrp === undefined ? data.price : Number(data.mrp);
    data.stock = data.stock === '' || data.stock === undefined ? 0 : Number(data.stock);
    data.discount = data.discount === '' || data.discount === undefined ? 0 : Number(data.discount);
    data.requiresPrescription = data.requiresPrescription === true || data.requiresPrescription === 'true';
    data.isActive = data.isActive !== false;
    
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({
        url: f.path,
        publicId: f.filename
      }));
      data.image = data.images[0].url; // Flatten for legacy support
    }
    const item = await Medicine.create(data);
    res.status(201).json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create medicine.', error: err.message });
  }
}

export async function updateMedicine(req, res) {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map(f => ({
        url: f.path,
        publicId: f.filename
      }));
      data.image = data.images[0].url;
    }
    
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    if (!(await canManageMedicine(req.user, medicine))) {
       return res.status(403).json({ message: 'Permission denied: Ownership mismatch' });
    }

    if (req.user.role !== 'admin') delete data.pharmacyId;

    const item = await Medicine.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update medicine.', error: err.message });
  }
}

export async function deleteMedicine(req, res) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    
    if (!(await canManageMedicine(req.user, medicine))) {
       return res.status(403).json({ message: 'Permission denied: Ownership mismatch' });
    }

    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ ok: true, message: 'Medicine deactivated' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
}

export async function getMedicinesByCategory(req, res) {
  const items = await Medicine.find({ category: req.params.cat, isActive: { $ne: false } });
  res.json({ items });
}

export async function getSearchSuggestions(req, res) {
  const { q } = req.query;
  if (!q) return res.json({ suggestions: [] });
  const suggestions = await Medicine.find({ 
    name: { $regex: q, $options: 'i' },
    isActive: { $ne: false }
  })
    .select('name _id category')
    .limit(5);
  res.json({ suggestions });
}
