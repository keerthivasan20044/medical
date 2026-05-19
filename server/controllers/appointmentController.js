import Appointment from '../models/Appointment.js';

export async function bookAppointment(req, res) {
  const item = await Appointment.create({ ...req.body, patient: req.user.id });
  res.status(201).json({ item });
}

export async function getMyAppointments(req, res) {
  const items = await Appointment.find({ patient: req.user.id }).sort({ createdAt: -1 });
  res.json({ items });
}

export async function updateAppointment(req, res) {
  const item = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ item });
}

export async function getAllAppointments(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const items = await Appointment.find()
    .populate('patient', 'name email phone')
    .populate('doctor', 'name doctorProfile')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Appointment.countDocuments();
  res.json({ 
    items, 
    total, 
    page: parseInt(page), 
    pages: Math.ceil(total / limit) 
  });
}
