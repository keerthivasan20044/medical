import Notification from '../models/Notification.js';
import { getIO } from '../config/socket.js';

export async function getMyNotifications(req, res) {
  const items = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ items });
}

export async function markRead(req, res) {
  const item = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  res.json({ item });
}

export async function markAllRead(req, res) {
  await Notification.updateMany({ user: req.user.id }, { isRead: true });
  res.json({ ok: true });
}

export async function createNotification(req, res) {
  const item = await Notification.create({ ...req.body, user: req.user.id });
  try {
    getIO().to(`user:${req.user.id}`).emit('notification:new', item);
  } catch (e) {
    // socket not ready
  }
  res.status(201).json({ item });
}
