import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    genericName: String,
    brand: String,
    category: { type: String, required: true },
    images: [{ url: String, publicId: String }],
    price: { type: Number, min: 0 },
    mrp: { type: Number, min: 0 },
    discount: { type: Number, min: 0, max: 100 },
    qty: { type: Number, min: 0 },
    unit: String,
    dosage: String,
    sideEffects: [String],
    requiresPrescription: { type: Boolean, default: false },
    isVaccine: { type: Boolean, default: false },
    isInjection: { type: Boolean, default: false },
    expiryDate: Date,
    batchNumber: String,
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' }
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
medicineSchema.index({ name: 'text' }); // Full text search
medicineSchema.index({ category: 1 });
medicineSchema.index({ pharmacy: 1 });
medicineSchema.index({ requiresPrescription: 1 });

export default mongoose.model('Medicine', medicineSchema);
