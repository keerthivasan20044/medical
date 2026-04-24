import Order from '../models/Order.js';
import User from '../models/User.js';

// GET /api/delivery/available
export const getAvailableOrders = async (req, res) => {
  try {
    // Orders that are confirmed but not yet accepted by a delivery partner
    const orders = await Order.find({
      status: 'confirmed',
      deliveryPartner: { $exists: false }
    }).populate('pharmacyId', 'name address location');

    res.json(orders);
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

    // Update timestamps based on status
    if (status === 'pickup_started') order.pickupStartedAt = new Date();
    if (status === 'at_pickup') order.pickedUpAt = new Date();
    if (status === 'out_for_delivery') {
      order.outForDeliveryAt = new Date();
      order.status = 'out for delivery';
    }
    if (status === 'arrived') order.arrivedAt = new Date();

    await order.save();
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
    order.paymentStatus = 'paid'; // If COD, it's paid now
    await order.save();

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
    const count = orders.length;

    res.json({
      totalEarnings,
      deliveryCount: count,
      history: orders.map(o => ({ id: o._id, amount: o.deliveryFare, date: o.deliveredAt }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
