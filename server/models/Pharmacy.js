import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    licenseNumber: { type: String, unique: true, required: true },
    images: [{ url: String, publicId: String }],
    address: {
      street: String,
      city: { type: String, default: 'Karaikal' },
      pincode: String,
      coordinates: { lat: Number, lng: Number }
    },
    phone: String,
    email: String,
    timings: String,
    rating: { type: Number, min: 0, max: 5 },
    totalReviews: Number,
    isVerified: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    pharmacist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryRadius: Number
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
// Note: licenseNumber already indexed via unique:true — no need to repeat
pharmacySchema.index({ name: 1 });
pharmacySchema.index({ city: 1 });
pharmacySchema.index({ isVerified: 1 });

export default mongoose.model('Pharmacy', pharmacySchema);
