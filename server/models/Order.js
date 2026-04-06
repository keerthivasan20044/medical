import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
    items: [{ medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, qty: Number, price: Number }],
    prescription: { url: String, publicId: String },
    totalAmount: { type: Number, required: true },
    deliveryCharge: Number,
    discount: Number,
    paymentMethod: { type: String, enum: ['cod', 'upi', 'card', 'wallet'] },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    status: { type: String, enum: ['placed', 'confirmed', 'preparing', 'dispatched', 'delivered', 'cancelled'], default: 'placed' },
    deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryAddress: String,
    note: String,
    estimatedDelivery: String,
    otp: { code: String, verified: { type: Boolean, default: false } },
    liveLocation: { lat: Number, lng: Number },
    paymentMeta: { razorpayOrderId: String, razorpayPaymentId: String, retryCount: Number, retryLogs: [{ at: Date, reason: String }] },
    rating: {
      pharmacy: { score: { type: Number, min: 1, max: 5 }, review: String },
      delivery: { score: { type: Number, min: 1, max: 5 }, review: String }
    }
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
// Note: orderNumber already indexed via unique:true — no need to repeat
orderSchema.index({ customer: 1 });
orderSchema.index({ pharmacy: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
