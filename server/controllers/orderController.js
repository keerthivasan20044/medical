import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import { getIO } from '../config/socket.js';
import { sendEmail, sendSMS, sendWhatsApp } from '../utils/notify.js';
import { notifyOrderPlaced, notifyOrderStatusUpdate } from '../services/notificationService.js';

import mongoose from 'mongoose';

async function resolveUserPharmacyIds(user) {
  const ids = new Set();

  if (user?.pharmacyId && mongoose.Types.ObjectId.isValid(user.pharmacyId)) {
    ids.add(String(user.pharmacyId));
  }

  if (user?.id && mongoose.Types.ObjectId.isValid(user.id)) {
    const ownedPharmacies = await mongoose.model('Pharmacy')
      .find({ owner: user.id })
      .select('_id')
      .lean();
    ownedPharmacies.forEach((pharmacy) => ids.add(String(pharmacy._id)));
  }

  return [...ids];
}

export async function placeOrder(req, res) {
  let { pharmacyId, items = [], deliveryAddress, paymentMethod, note, prescriptionUrl } = req.body;
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'No items in cart. Add a medicine before checkout.' });
  }

  const invalidItem = items.find((item) => !mongoose.Types.ObjectId.isValid(item.medicine || item.id || item._id));
  if (invalidItem) {
    return res.status(400).json({ message: 'Invalid cart item. Clear the cart and add medicines again.' });
  }

  items = items.map((item) => ({
    medicine: item.medicine || item.id || item._id,
    quantity: Math.max(1, Number(item.quantity) || 1),
    price: Math.max(0, Number(item.price) || 0)
  }));

  if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
    const firstMedicine = await Medicine.findById(items[0]?.medicine).select('pharmacyId').lean();
    if (firstMedicine?.pharmacyId) {
      pharmacyId = firstMedicine.pharmacyId;
    } else {
      const defaultPharmacy = await mongoose.model('Pharmacy').findOne();
      if (defaultPharmacy) {
        pharmacyId = defaultPharmacy._id;
      }
    }
  }

  if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
    return res.status(400).json({ message: 'No valid pharmacy available to fulfill order' });
  }

  const medicineIds = items.map((item) => item.medicine);
  const medicines = await Medicine.find({ _id: { $in: medicineIds }, isActive: { $ne: false } })
    .select('_id pharmacyId stock price name')
    .lean();
  const medicineMap = new Map(medicines.map((medicine) => [String(medicine._id), medicine]));

  for (const item of items) {
    const medicine = medicineMap.get(String(item.medicine));
    if (!medicine) {
      return res.status(400).json({ message: 'One or more medicines are no longer available.' });
    }
    if (String(medicine.pharmacyId) !== String(pharmacyId)) {
      return res.status(400).json({ message: 'Cart contains medicines from a different pharmacy. Clear cart and try again.' });
    }
    if (Number(medicine.stock) < Number(item.quantity)) {
      return res.status(400).json({ message: `${medicine.name} has only ${medicine.stock} units available.` });
    }
    if (!item.price) item.price = Number(medicine.price) || 0;
  }

  const totalAmount = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);
  const orderNumber = `MED-${Date.now()}`;
  
  // Create OTP for delivery confirmation
  const deliveryOtp = String(Math.floor(100000 + Math.random() * 900000));
  
  const order = await Order.create({
    orderNumber,
    customerId: req.user.id,
    pharmacyId,
    items,
    totalAmount,
    paymentMethod,
    deliveryAddress,
    prescriptionUrl,
    otp: deliveryOtp,
    status: 'pending'
  });

  const notif = await Notification.create({
    user: req.user.id,
    title: 'Order Placed',
    body: `Order ${order.orderNumber} is being processed.`,
    type: 'order',
    icon: 'order'
  });

  try {
    const io = getIO();
    io.to(`user:${req.user.id}`).emit('notification:new', notif);
    io.to(`pharmacy:${pharmacyId}`).emit('order:new', order);
    io.to('role:admin').emit('order:new', order);
    
    io.emit('activity:new', {
       type: 'order_placed',
       message: `New order ${orderNumber} placed in Karaikal cluster`,
       location: 'Karaikal',
       timestamp: new Date()
    });
  } catch (e) {}

  const user = await User.findById(req.user.id);
  if (user) {
    // Send unified notifications (WebSocket + Email + WhatsApp)
    await notifyOrderPlaced(order, user);
  }

  res.status(201).json({ order });
}

export async function getPharmacyOrders(req, res, next) {
  try {
    const { page = 1, limit = 20, status, search, q } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    const statusAliases = {
      processing: 'preparing',
      shipped: 'out for delivery',
      ready: 'out for delivery'
    };

    const pharmacyIds = await resolveUserPharmacyIds(req.user);
    if (!pharmacyIds.length && req.user.role !== 'admin') {
       return res.json({
         success: true,
         items: [],
         total: 0,
         page: pageNum,
         pages: 0,
         limit: limitNum,
         hasNext: false,
         hasPrev: false,
         warning: 'No pharmacy associated with this account'
       });
    }
    
    const query = pharmacyIds.length ? { pharmacyId: { $in: pharmacyIds } } : {};
    if (status) query.status = statusAliases[status] || status;

    const searchTerm = search || q;
    if (searchTerm) {
      query.$or = [
        { orderNumber: { $regex: searchTerm, $options: 'i' } },
        { deliveryAddress: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(query)
        .populate('customerId', 'name phone')
        .populate('pharmacyId', 'name address')
        .populate('items.medicine', 'name brand category price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({ 
      success: true,
      items,
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      hasNext: pageNum < pages,
      hasPrev: pageNum > 1
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const { page = 1, limit = 10, status, search, q } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = { customerId: req.user.id };
    if (status === 'active') {
      query.status = { $nin: ['delivered', 'cancelled'] };
    } else if (status) {
      query.status = status;
    }

    const searchTerm = search || q;
    if (searchTerm) {
      query.$or = [
        { orderNumber: { $regex: searchTerm, $options: 'i' } },
        { deliveryAddress: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const [items, total] = await Promise.all([
      Order.find(query)
        .populate('pharmacyId', 'name address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({ 
      success: true,
      items,
      total,
      page: pageNum,
      pages,
      limit: limitNum,
      hasNext: pageNum < pages,
      hasPrev: pageNum > 1
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res) {
  try {
    const item = await Order.findById(req.params.id)
      .populate('items.medicine')
      .populate('pharmacyId')
      .populate('customerId', 'name phone email');
      
    if (!item) return res.status(404).json({ message: 'Order not found' });
    
    const isOrderOwner = item.customerId?._id.toString() === req.user.id;
    const isDeliveryAgent = item.deliveryPartner?.toString() === req.user.id;
    const isAdmin = ['admin', 'pharmacist'].includes(req.user.role);
    
    if (!isOrderOwner && !isDeliveryAgent && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out for delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Status transition rules
    if (order.status === 'delivered' || order.status === 'cancelled') {
       return res.status(400).json({ message: 'Cannot update a completed or cancelled order' });
    }

    order.status = status;
    await order.save();

    const notif = await Notification.create({
      user: order.customerId,
      title: 'Order Status Update',
      body: `Your order ${order.orderNumber} is now ${status}.`,
      type: 'order',
      icon: 'order'
    });

    try {
      const io = getIO();
      const payload = { orderId: order._id, status, orderNumber: order.orderNumber };
      io.to(`user:${order.customerId}`).emit('order:status-update', payload);
      io.to(`order:${order._id}`).emit('order:status-update', { ...payload, orderId: String(order._id) });
      io.to(`user:${order.customerId}`).emit('notification:new', notif);
      if (['confirmed', 'preparing'].includes(status) && !order.deliveryPartner) {
        const deliveryTask = await Order.findById(order._id)
          .populate('pharmacyId', 'name address location')
          .populate('items.medicine', 'name brand unit')
          .lean();
        io.to('role:delivery').emit('new_delivery_available', deliveryTask);
      }
    } catch (e) {}

    res.json({ item: order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
}

export async function cancelMyOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.customerId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'This order cannot be cancelled' });
    }
    if (order.status === 'out for delivery' || order.deliveryStatus === 'out_for_delivery' || order.deliveryStatus === 'arrived') {
      return res.status(400).json({ message: 'Order is already out for delivery. Please contact support.' });
    }

    order.status = 'cancelled';
    order.deliveryStatus = 'cancelled';
    await order.save();

    const notif = await Notification.create({
      user: order.customerId,
      title: 'Order Cancelled',
      body: `Your order ${order.orderNumber} has been cancelled.`,
      type: 'order',
      icon: 'order'
    });

    try {
      const io = getIO();
      const payload = { orderId: String(order._id), status: 'cancelled', orderNumber: order.orderNumber };
      io.to(`user:${order.customerId}`).emit('order:status-update', payload);
      io.to(`order:${order._id}`).emit('order:status-update', payload);
      io.to(`pharmacy:${order.pharmacyId}`).emit('order:status-update', payload);
      io.to('role:admin').emit('order:status-update', payload);
      io.to(`user:${order.customerId}`).emit('notification:new', notif);
    } catch (e) {}

    res.json({ item: order, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
}

export async function verifyDeliveryOTP(req, res) {
  try {
    const { code, otp } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (String(order.deliveryPartner) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'This delivery task is assigned to another partner' });
    }
    
    const submittedOtp = String(code || otp || '').trim();
    order.deliveryOtpAttempts = (order.deliveryOtpAttempts || 0) + 1;
    if (order.otp === submittedOtp || order.deliveryOTP === submittedOtp) {
      order.status = 'delivered';
      order.deliveryStatus = 'delivered';
      order.paymentStatus = 'paid'; // Assuming delivery confirms payment for COD
      order.deliveredAt = new Date();
      order.deliveryOtpConfirmedAt = order.deliveredAt;
      order.deliveryOtpConfirmedBy = req.user.id;
      await order.save();
      
      const io = getIO();
      const payload = { orderId: String(order._id), status: 'delivered', mainStatus: 'delivered' };
      io.to(`user:${order.customerId}`).emit('order:delivered', payload);
      io.to(`order:${order._id}`).emit('order:status-update', payload);
      
      return res.json({ ok: true, message: 'Order delivered successfully' });
    }
    await order.save();
    return res.status(400).json({ message: 'Invalid delivery OTP' });
  } catch (e) {
    res.status(500).json({ message: 'Verification failed' });
  }
}

export async function liveTrackOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .select('status deliveryStatus deliveryLocation deliveryAddress otp deliveryOTP deliveryOtpAttempts deliveryOtpConfirmedAt customerId deliveryPartner pharmacyId updatedAt')
      .populate('deliveryPartner', 'name phone avatar deliveryRating')
      .populate('pharmacyId', 'name address location');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOrderOwner = String(order.customerId) === String(req.user.id);
    const isDeliveryAgent = String(order.deliveryPartner?._id || order.deliveryPartner) === String(req.user.id);
    const isAdminOrPharmacist = ['admin', 'pharmacist'].includes(req.user.role);
    if (!isOrderOwner && !isDeliveryAgent && !isAdminOrPharmacist) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const coordinates = order.deliveryLocation?.coordinates;
    const item = {
      _id: order._id,
      status: order.status,
      deliveryStatus: order.deliveryStatus,
      deliveryAddress: order.deliveryAddress,
      pharmacy: order.pharmacyId,
      deliveryPartner: order.deliveryPartner,
      liveLocation: Array.isArray(coordinates) && coordinates.length === 2
        ? { lng: coordinates[0], lat: coordinates[1] }
        : null,
      otp: isOrderOwner ? (order.otp || order.deliveryOTP) : undefined,
      deliveryOtpAttempts: order.deliveryOtpAttempts || 0,
      deliveryOtpConfirmedAt: order.deliveryOtpConfirmedAt,
      updatedAt: order.updatedAt
    };
    res.json({ item });
  } catch (e) {
    res.status(500).json({ message: 'Tracking failed' });
  }
}

export async function rateOrder(req, res) {
  try {
    const { pharmacyRating, deliveryRating, comment } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.rating = {
      pharmacy: { score: pharmacyRating, review: comment },
      delivery: { score: deliveryRating, review: comment }
    };

    await order.save();
    res.json({ ok: true, message: 'Rating submitted' });
  } catch (e) {
    res.status(500).json({ message: 'Rating failed' });
  }
}
