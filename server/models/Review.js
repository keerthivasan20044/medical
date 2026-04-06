import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    rating: Number,
    comment: String,
    images: [String]
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
