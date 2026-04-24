import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    state: { type: String, default: 'Puducherry' },
    pincode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' }
    },
    phone: [String],
    email: String,
    hours: [{
      day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      open: String,
      close: String,
      closed: { type: Boolean, default: false }
    }],
    services: [String], // e.g. "24 Hours", "Home Delivery", "Emergency"
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    photos: [String],
    mainPhoto: String,
    customPhotos: [String],
    googlePlaceId: String,
    photoFetchedAt: Date,
    license: String,
    licenseNumber: String,
    status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

pharmacySchema.index({ location: '2dsphere' });

export default mongoose.model('Pharmacy', pharmacySchema);

