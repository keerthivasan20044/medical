import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerPhone: String,
    licenseId: { type: String, unique: true, required: true },
    images: [{ url: String, publicId: String }],
    image: String,

    // ── Photo Management ──────────────────────────────────────────
    googlePlaceId: String,          // Google Places unique ID for this pharmacy
    photos: [String],               // Array of photo URLs (Google-cached on Cloudinary)
    mainPhoto: String,              // Primary display photo (first of photos[] or customPhotos[])
    photoFetchedAt: Date,           // Timestamp of last Google fetch (refresh after 30 days)
    customPhotos: [String],         // Admin-uploaded photos — shown above Google photos
    isFallback: { type: Boolean, default: false }, // true = no real photo found, using curated stock
    // ─────────────────────────────────────────────────────────────

    address: {
      street: String,
      city: { type: String, default: 'Karaikal' },
      state: { type: String, default: 'Puducherry' },  // Supports multi-city expansion
      pincode: String,
      coordinates: { lat: Number, lng: Number }
    },
    phone: String,
    email: String,
    operatingHours: String,
    deliveryTime: String,
    deliveryFee: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5 },
    totalReviews: Number,
    isVerified: { type: Boolean, default: false },
    isOpen: { type: Boolean, default: true },
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }],
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryRadius: Number
  },
  { timestamps: true }
);

// Indexes for frequently queried fields
pharmacySchema.index({ name: 1 });
pharmacySchema.index({ 'address.city': 1 });
pharmacySchema.index({ isVerified: 1 });
pharmacySchema.index({ googlePlaceId: 1 });
pharmacySchema.index({ photoFetchedAt: 1 });  // for scheduled refresh queries

export default mongoose.model('Pharmacy', pharmacySchema);

