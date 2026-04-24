import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    items: [{ medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, quantity: Number, price: Number }],
    prescriptionUrl: String,
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: Number,
    paymentMethod: { type: String, enum: ['cod', 'upi', 'card', 'wallet'] },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentId: String,
    razorpayOrderId: String,
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'], default: 'pending' },
    
    // ── Delivery Specific Fields ──────────────────────────────
    deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryStatus: { type: String, enum: ['pending', 'accepted', 'pickup_started', 'at_pickup', 'out_for_delivery', 'arrived', 'delivered', 'cancelled'], default: 'pending' },
    pickupStartedAt: Date,
    pickedUpAt: Date,
    outForDeliveryAt: Date,
    arrivedAt: Date,
    deliveredAt: Date,
    deliveryOTP: { type: String, default: () => Math.floor(100000 + Math.random() * 900000).toString() },
    deliveryLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }
    },
    deliveryFare: { type: Number, default: 0 },
    deliveryDistance: Number, // in km
    deliveryDuration: Number, // in minutes
    deliveryRating: Number,
    deliveryReview: String,
    deliveryIssues: [{
      reason: String,
      description: String,
      timestamp: { type: Date, default: Date.now }
    }],
    // ──────────────────────────────────────────────────────────

    deliveryAddress: String,
    otp: { type: String, default: () => Math.floor(100000 + Math.random() * 900000).toString() },
    rating: {
      pharmacy: { score: { type: Number, min: 1, max: 5 }, review: String },
      delivery: { score: { type: Number, min: 1, max: 5 }, review: String }
    }
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
// Note: orderNumber already indexed via unique:true — no need to repeat
orderSchema.index({ customerId: 1 });
orderSchema.index({ pharmacyId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
