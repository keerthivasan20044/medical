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
