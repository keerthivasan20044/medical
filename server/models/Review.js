import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [String]
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
