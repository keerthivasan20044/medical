import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctorName: String, // fallback for manual uploads
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    imageUrl: { type: String, required: true },
    publicId: String,
    medicines: [{ name: String, dosage: String, frequency: String, duration: String }],
    diagnosis: String,
    notes: String,
    isValid: { type: Boolean, default: true },
    expiryDate: Date,
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'dispensed'], 
      default: 'pending' 
    },
    rejectionReason: String,
    rejectedAt: Date,
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    pharmacistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Create indexes
prescriptionSchema.index({ customerId: 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ createdAt: -1 });

export default mongoose.model('Prescription', prescriptionSchema);
