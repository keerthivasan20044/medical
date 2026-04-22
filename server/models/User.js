import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'doctor', 'pharmacist', 'delivery', 'admin'], default: 'customer' },
    avatar: { url: String, publicId: String },
    address: [{
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: { lat: Number, lng: Number },
      isDefault: { type: Boolean, default: false }
    }],
    // Doctor specific fields (for role: 'doctor')
    doctorProfile: {
      specialization: String,
      qualification: String,
      hospital: String,
      experience: Number,
      languages: [String],
      fee: Number,
      status: { type: String, enum: ['online', 'busy', 'offline'], default: 'offline' },
      rating: { type: Number, default: 0 },
      consultations: { type: Number, default: 0 },
      bio: String,
      education: [{ degree: String, institute: String }],
      registration: String,
      schedule: {
        days: String,
        slots: [String]
      },
      tags: [String]
    },
    // Pharmacist/Delivery specific
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: String,
    otp: String,
    otpExpiry: Date,
    resetToken: String,
    resetTokenExpiry: Date
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
// Note: email and phone already indexed via unique:true — no need to repeat
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

export default mongoose.model('User', userSchema);
