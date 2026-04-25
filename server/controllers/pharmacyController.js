import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';
import Order from '../models/Order.js';

// GET /api/pharmacies
export const getPharmacies = async (req, res, next) => {
  try {
    const { search, q, city, rating, service, sort, page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = { status: 'active' };
    const searchTerm = search || q;

    if (searchTerm) query.name = { $regex: searchTerm, $options: 'i' };
    if (city) query.city = city;
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
    const pharmacy = await Pharmacy.findById(req.params.id);
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
    // Assuming medicines are linked to pharmacy either in Pharmacy model or Medicine model
    // Let's check Medicine model or assume a simple query
    const query = { pharmacyId: req.params.id };
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
