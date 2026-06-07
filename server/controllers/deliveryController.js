import Order from '../models/Order.js';
import { getIO } from '../config/socket.js';
import { sendSMS, sendEmail, sendWhatsApp } from '../utils/notify.js';
import { notifyOrderStatusUpdate, notifyDeliveryStarted, notifyOrderDelivered } from '../services/notificationService.js';
import User from '../models/User.js';

function populateDeliveryOrder(query) {
  return query
    .populate('pharmacyId', 'name address phone location')
    .populate('customerId', 'name phone')
    .populate('items.medicine', 'name brand unit');
}

// Helper: emit status update to all relevant rooms
function emitStatusUpdate(orderId, status, extra = {}) {
  try {
    const io = getIO();
    const payload = { orderId: String(orderId), status, ...extra };
    // Notify the customer tracking the order
    io.to(`order:${orderId}`).emit('order:status-update', payload);
    if (extra.customerId) io.to(`user:${extra.customerId}`).emit('order:status-update', payload);
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
      status: { $in: ['confirmed', 'preparing', 'out for delivery'] },
      deliveryPartner: null
    })
      .populate('pharmacyId', 'name address location')
      .populate('items.medicine', 'name brand unit');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/delivery/active
export const getActiveOrder = async (req, res) => {
  try {
    const order = await populateDeliveryOrder(Order.findOne({
      deliveryPartner: req.user.id,
      deliveryStatus: { $nin: ['delivered', 'cancelled'] }
    }));
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
    if (!['confirmed', 'preparing', 'out for delivery'].includes(order.status)) {
      return res.status(400).json({ message: 'Order is not ready for delivery pickup' });
    }

    order.deliveryPartner = req.user.id;
    order.deliveryStatus = 'accepted';
    await order.save();

    emitStatusUpdate(order._id, 'accepted', {
      pharmacyId: order.pharmacyId,
      customerId: String(order.customerId),
      deliveryPartnerId: req.user.id
    });
    try {
      const io = getIO();
      io.to('role:delivery').emit('delivery_assigned', String(order._id));
      io.to('role:delivery').emit('delivery:assigned', {
        id: String(order._id),
        pharmacyName: order.pharmacyId?.name,
        address: order.deliveryAddress,
        total: order.totalAmount
      });
    } catch {}

    const populatedOrder = await populateDeliveryOrder(Order.findById(order._id));
    res.json({ message: 'Order accepted successfully', order: populatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/delivery/:orderId/status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, issue, issueDescription } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.deliveryPartner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'This delivery task is assigned to another partner' });
    }

    const previousDeliveryStatus = order.deliveryStatus;
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
    if (issue) {
      order.deliveryIssues.push({
        reason: issue,
        description: issueDescription || '',
        timestamp: new Date()
      });
    }

    const mappedStatus = STATUS_MAP[status];
    if (mappedStatus) order.status = mappedStatus;

    await order.save();

    if (
      ['out_for_delivery', 'arrived'].includes(status) &&
      !['out_for_delivery', 'arrived'].includes(previousDeliveryStatus)
    ) {
      await order.populate('customerId', 'phone email');
      const deliveryOtp = order.otp || order.deliveryOTP;
      const message = `MediReach delivery OTP for order ${order.orderNumber}: ${deliveryOtp}. Share it only after receiving your medicines.`;
      if (order.customerId?.phone) {
        await sendSMS(order.customerId.phone, message);
        await sendWhatsApp(order.customerId.phone, message);
      }
      if (order.customerId?.email) await sendEmail(order.customerId.email, 'Delivery OTP', message);
      
      // Send status update notification
      if (status === 'out_for_delivery') {
        const deliveryPartner = await User.findById(req.user.id).select('name phone vehicle');
        await notifyDeliveryStarted(order, order.customerId, deliveryPartner);
      }
    }

    // Notify order delivered
    if (status === 'delivered' && previousDeliveryStatus !== 'delivered') {
      await order.populate('customerId', 'phone email');
      await notifyOrderDelivered(order, order.customerId);
    }

    // ── Emit real-time update ────────────────────────────────────────
    emitStatusUpdate(order._id, status, {
      pharmacyId: order.pharmacyId,
      customerId: String(order.customerId),
      mainStatus: order.status,
      deliveryPartnerId: String(req.user.id),
      otpVisible: status === 'out_for_delivery' || status === 'arrived',
      otp: ['out_for_delivery', 'arrived'].includes(status) ? (order.otp || order.deliveryOTP) : undefined
    });

    const populatedOrder = await populateDeliveryOrder(Order.findById(order._id));
    res.json({ message: `Status updated to ${status}`, order: populatedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/delivery/:orderId/location
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { lat, lng, accuracy, heading, speed, eta } = req.body;
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ message: 'Valid latitude and longitude are required' });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (req.user.role !== 'admin' && String(order.deliveryPartner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'This delivery task is assigned to another partner' });
    }

    const previousDeliveryStatus = order.deliveryStatus;
    order.deliveryLocation = { type: 'Point', coordinates: [longitude, latitude] };
    if (order.deliveryStatus === 'accepted') order.deliveryStatus = 'out_for_delivery';
    if (!['delivered', 'cancelled'].includes(order.status)) order.status = 'out for delivery';
    await order.save();

    if (order.deliveryStatus === 'out_for_delivery' && previousDeliveryStatus !== 'out_for_delivery') {
      await order.populate('customerId', 'phone email');
      const deliveryOtp = order.otp || order.deliveryOTP;
      const message = `MediReach delivery OTP for order ${order.orderNumber}: ${deliveryOtp}. Share it only after receiving your medicines.`;
      if (order.customerId?.phone) {
        await sendSMS(order.customerId.phone, message);
        await sendWhatsApp(order.customerId.phone, message);
      }
      if (order.customerId?.email) await sendEmail(order.customerId.email, 'Delivery OTP', message);
    }

    const payload = {
      orderId: String(order._id),
      lat: latitude,
      lng: longitude,
      accuracy,
      heading,
      speed,
      eta,
      status: order.deliveryStatus,
      mainStatus: order.status,
      timestamp: new Date()
    };

    try {
      const io = getIO();
      io.to(`order:${order._id}`).emit('order:location-update', payload);
      io.to(`user:${order.customerId}`).emit('order:location-update', payload);
      io.to('role:admin').emit('order:location-update', payload);
      io.to(`pharmacy:${order.pharmacyId}`).emit('order:location-update', payload);
    } catch {}

    res.json({ ok: true, item: order, location: payload });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update delivery location' });
  }
};

// POST /api/delivery/:orderId/confirm
export const confirmDelivery = async (req, res) => {
  try {
    const { code, otp } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.deliveryPartner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'This delivery task is assigned to another partner' });
    }

    const submittedOtp = String(code || otp || '').trim();
    order.deliveryOtpAttempts = (order.deliveryOtpAttempts || 0) + 1;
    if (order.deliveryOTP !== submittedOtp && order.otp !== submittedOtp) {
      await order.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    order.deliveryStatus = 'delivered';
    order.status = 'delivered';
    order.deliveredAt = new Date();
    order.deliveryOtpConfirmedAt = order.deliveredAt;
    order.deliveryOtpConfirmedBy = req.user.id;
    order.paymentStatus = 'paid'; // COD is settled on delivery
    await order.save();

    // ── Emit delivered event to customer + admin + pharmacy ──────────
    emitStatusUpdate(order._id, 'delivered', {
      pharmacyId: order.pharmacyId,
      customerId: String(order.customerId),
      mainStatus: 'delivered',
      deliveredAt: order.deliveredAt
    });

    res.json({ message: 'Delivery confirmed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/delivery/:orderId/resend-otp
export const resendDeliveryOtp = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('customerId', 'name phone email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.deliveryPartner) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This delivery task is assigned to another partner' });
    }
    if (order.deliveryStatus === 'delivered' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Delivery is already confirmed' });
    }

    const otp = order.otp || order.deliveryOTP || Math.floor(100000 + Math.random() * 900000).toString();
    order.otp = otp;
    order.deliveryOTP = otp;
    await order.save();

    const customer = order.customerId;
    const message = `MediReach delivery OTP for order ${order.orderNumber}: ${otp}. Share it only after receiving your medicines.`;
    if (customer?.phone) {
      await sendSMS(customer.phone, message);
      await sendWhatsApp(customer.phone, message);
    }
    if (customer?.email) await sendEmail(customer.email, 'Delivery OTP', message);

    try {
      const io = getIO();
      io.to(`user:${customer?._id || order.customerId}`).emit('order:status-update', {
        orderId: String(order._id),
        status: order.deliveryStatus,
        mainStatus: order.status,
        otpVisible: true,
        otp
      });
    } catch {}

    res.json({ ok: true, message: 'OTP sent to customer' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to resend delivery OTP' });
  }
};

// POST /api/delivery/:orderId/report-disruption
export const reportDisruption = async (req, res) => {
  try {
    const { stage, status, description } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.deliveryPartner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'This delivery task is assigned to another partner' });
    }

    // Record disruption issue
    order.deliveryIssues.push({
      reason: 'disruption_reported',
      description: description || `Disruption reported at stage ${stage} (status: ${status})`,
      timestamp: new Date(),
      reportedBy: req.user.id
    });
    
    // Update delivery status to pause/on_hold (optional)
    const previousStatus = order.deliveryStatus;
    order.deliveryStatus = 'on_hold';

    await order.save();

    // Notify admin and pharmacy about disruption
    try {
      const io = getIO();
      io.to('role:admin').emit('delivery:disruption-reported', {
        orderId: String(order._id),
        deliveryPartnerId: String(req.user.id),
        stage,
        previousStatus,
        timestamp: new Date()
      });
      io.to(`pharmacy:${order.pharmacyId}`).emit('delivery:disruption-reported', {
        orderId: String(order._id),
        stage,
        timestamp: new Date()
      });
    } catch {}

    res.json({ 
      ok: true, 
      message: 'Disruption reported successfully. Admin has been notified.',
      order 
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to report disruption' });
  }
};

// GET /api/delivery/history
export const getDeliveryHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user.id,
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
      deliveryPartner: req.user.id,
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
