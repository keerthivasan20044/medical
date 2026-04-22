import Review from '../models/Review.js';
import Pharmacy from '../models/Pharmacy.js';
import Medicine from '../models/Medicine.js';

export async function createReview(req, res) {
  try {
    const { pharmacyId, medicineId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating) return res.status(400).json({ message: 'Rating is required' });

    const review = await Review.create({
      userId,
      pharmacyId,
      medicineId,
      rating,
      comment
    });

    // Update pharmacy/medicine average rating (simplified)
    if (pharmacyId) {
       const reviews = await Review.find({ pharmacyId });
       const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
       await Pharmacy.findByIdAndUpdate(pharmacyId, { rating: avg, totalReviews: reviews.length });
    }

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
}

export async function getReviews(req, res) {
  try {
    const { pharmacyId, medicineId } = req.query;
    const query = {};
    if (pharmacyId) query.pharmacyId = pharmacyId;
    if (medicineId) query.medicineId = medicineId;

    const items = await Review.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
}
