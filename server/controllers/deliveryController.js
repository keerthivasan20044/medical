import Order from '../models/Order.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';

// Helper: emit status update to all relevant rooms
function emitStatusUpdate(orderId, status, extra = {}) {
  try {
    const io = getIO();
    const payload = { orderId: String(orderId), status, ...extra };
    // Notify the customer tracking the order
    io.to(`order:${orderId}`).emit('order:status-update', payload);
    // Notify admin room
    io.to('role:admin').emit('order:status-update', payload);
    // Notify the pharmacy room
    if (extra.pharmacyId) io.to(`pharmacy:${extra.pharmacyId}`).emit('order:status-update', payload);
  } catch {
    // Socket may not be initialised in test environments — safe to ignore
  }
}

// GET /api/delivery/available
export const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      status: 'confirmed',
      deliveryPartner: { $exists: false }
    }).populate('pharmacyId', 'name address location');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery/active
export const getActiveOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      deliveryPartner: req.user._id,
      deliveryStatus: { $nin: ['delivered', 'cancelled'] }
    }).populate('pharmacyId', 'name address location');
    res.json({ order: order || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/delivery/:orderId/accept
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.deliveryPartner) return res.status(400).json({ message: 'Order already accepted by another partner' });

    order.deliveryPartner = req.user._id;
    order.deliveryStatus = 'accepted';
    await order.save();

    emitStatusUpdate(order._id, 'accepted', { pharmacyId: order.pharmacyId });

    res.json({ message: 'Order accepted successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/delivery/:orderId/status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.deliveryStatus = status;

    // Map delivery sub-status → main order status
    const STATUS_MAP = {
      pickup_started:    null,             // internal only
      at_pickup:         null,
      out_for_delivery:  'out for delivery',
      arrived:           null,
    };

    if (status === 'pickup_started')   order.pickupStartedAt = new Date();
    if (status === 'at_pickup')        order.pickedUpAt = new Date();
    if (status === 'out_for_delivery') order.outForDeliveryAt = new Date();
    if (status === 'arrived')          order.arrivedAt = new Date();

    const mappedStatus = STATUS_MAP[status];
    if (mappedStatus) order.status = mappedStatus;

    await order.save();

    // ── Emit real-time update ────────────────────────────────────────
    emitStatusUpdate(order._id, status, {
      pharmacyId: order.pharmacyId,
      mainStatus: order.status,
      deliveryPartnerId: String(req.user._id)
    });

    res.json({ message: `Status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/delivery/:orderId/confirm
export const confirmDelivery = async (req, res) => {
  try {
    const { otp } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.deliveryOTP !== otp && order.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    order.deliveryStatus = 'delivered';
    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid'; // COD is settled on delivery
    await order.save();

    // ── Emit delivered event to customer + admin + pharmacy ──────────
    emitStatusUpdate(order._id, 'delivered', {
      pharmacyId: order.pharmacyId,
      mainStatus: 'delivered',
      deliveredAt: order.deliveredAt
    });

    res.json({ message: 'Delivery confirmed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery/history
export const getDeliveryHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
      deliveryStatus: 'delivered'
    }).populate('pharmacyId', 'name address');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery/earnings
export const getDeliveryEarnings = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
      deliveryStatus: 'delivered'
    });

    const totalEarnings = orders.reduce((sum, order) => sum + (order.deliveryFare || 0), 0);
    res.json({
      totalEarnings,
      deliveryCount: orders.length,
      history: orders.map(o => ({ id: o._id, amount: o.deliveryFare, date: o.deliveredAt }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
