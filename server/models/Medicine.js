import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genericName: String,
    brand: String,
    category: { type: String, required: true },
    images: [{ url: String, publicId: String }],
    image: String, // Supporting singular image as requested
    price: { type: Number, min: 0 },
    mrp: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    stock: { type: Number, min: 0, default: 0 },
    description: String,
    isActive: { type: Boolean, default: true },
    unit: String,
    dosage: String,
    sideEffects: [String],
    requiresPrescription: { type: Boolean, default: false },
    isVaccine: { type: Boolean, default: false },
    isInjection: { type: Boolean, default: false },
    expiryDate: Date,
    batchNumber: String,
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' }
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
medicineSchema.index({ name: 'text' }); // Full text search
medicineSchema.index({ category: 1 });
medicineSchema.index({ pharmacyId: 1 });
medicineSchema.index({ requiresPrescription: 1 });

export default mongoose.model('Medicine', medicineSchema);
