import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';
import mongoose from 'mongoose';

async function resolvePharmacyByIdentifier(identifier) {
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return Pharmacy.findById(identifier);
  }

  const legacyMatch = String(identifier || '').match(/^ph-(\d+)$/i);
  if (legacyMatch) {
    const count = await Pharmacy.countDocuments({});
    if (!count) return null;
    const index = Math.max(0, Number(legacyMatch[1]) - 1) % count;
    return Pharmacy.findOne({}).sort({ createdAt: 1, name: 1 }).skip(index);
  }

  return Pharmacy.findOne({ slug: identifier });
}

function normalizePharmacyPayload(body = {}) {
  const data = { ...body };

  if (typeof data.phone === 'string') {
    data.phone = data.phone
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof data.services === 'string') {
    data.services = data.services
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (data.latitude || data.longitude || data.lat || data.lng) {
    const lat = Number(data.latitude || data.lat);
    const lng = Number(data.longitude || data.lng);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      data.location = { type: 'Point', coordinates: [lng, lat] };
    }
    delete data.latitude;
    delete data.longitude;
    delete data.lat;
    delete data.lng;
  }

  return data;
}

// GET /api/pharmacies
export const getPharmacies = async (req, res, next) => {
  try {
    const { search, q, city, rating, service, status, sort, page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = req.user?.role === 'admin' ? {} : { status: 'active' };
    const searchTerm = search || q;

    if (searchTerm) query.name = { $regex: searchTerm, $options: 'i' };
    if (city) query.city = city;
    if (status && status !== 'all' && req.user?.role === 'admin') query.status = status;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (service) query.services = { $in: [service] };

    let sortQuery = { rating: -1 };
    if (sort === 'rating') sortQuery = { rating: -1 };
    if (sort === 'alphabetical') sortQuery = { name: 1 };
    if (sort === 'newest') sortQuery = { createdAt: -1 };

    const [items, total] = await Promise.all([
      Pharmacy.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Pharmacy.countDocuments(query)
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
};

// GET /api/pharmacies/nearby
export const getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query; // radius in meters

    const pharmacies = await Pharmacy.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius)
        }
      },
      status: 'active'
    });

    res.json(pharmacies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/pharmacies/:id
export const getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await resolvePharmacyByIdentifier(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json(pharmacy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/pharmacies/:id/medicines
export const getPharmacyMedicines = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const pharmacy = await resolvePharmacyByIdentifier(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });

    const query = { pharmacyId: pharmacy._id, isActive: { $ne: false } };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const medicines = await Medicine.find(query).sort(sort === 'price_low' ? { price: 1 } : { createdAt: -1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/pharmacies/:id/reviews
export const addPharmacyReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });

    // In a real app, we'd have a separate Review model. 
    // For now, let's update the pharmacy rating summary (mocked)
    const newCount = pharmacy.reviewCount + 1;
    const newRating = (pharmacy.rating * pharmacy.reviewCount + rating) / newCount;

    pharmacy.rating = newRating;
    pharmacy.reviewCount = newCount;
    await pharmacy.save();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/pharmacies
export const createPharmacy = async (req, res, next) => {
  try {
    const data = normalizePharmacyPayload(req.body);
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const pharmacy = await Pharmacy.create(data);
    res.status(201).json({ item: pharmacy });
  } catch (err) {
    next(err);
  }
};

// PUT /api/pharmacies/:id
export const updatePharmacy = async (req, res, next) => {
  try {
    const data = normalizePharmacyPayload(req.body);
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json({ item: pharmacy });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/pharmacies/:id
export const deletePharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended', isActive: false },
      { new: true }
    );

    if (!pharmacy) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json({ ok: true, item: pharmacy });
  } catch (err) {
    next(err);
  }
};
