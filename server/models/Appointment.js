import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    type: { type: String, enum: ['online', 'offline'], default: 'online' },
    status: { type: String, enum: ['booked', 'confirmed', 'completed', 'cancelled'], default: 'booked' },
    fee: { type: Number, min: 0 },
    meetLink: String,
    symptoms: String,
    notes: String
  },
  { timestamps: true }
);

// Create indexes
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model('Appointment', appointmentSchema);
