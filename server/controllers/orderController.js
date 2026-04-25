import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';
import { sendEmail, sendSMS } from '../utils/notify.js';

export async function placeOrder(req, res) {
  const { pharmacyId, items = [], deliveryAddress, paymentMethod, note, prescriptionUrl } = req.body;
  if (!items.length) return res.status(400).json({ message: 'No items' });
  
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
    io.to('admin').emit('order:new', order);
    
    io.emit('activity:new', {
       type: 'order_placed',
       message: `New order ${orderNumber} placed in Karaikal cluster`,
       location: 'Karaikal',
       timestamp: new Date()
    });
  } catch (e) {}

  const user = await User.findById(req.user.id);
  if (user?.email) await sendEmail(user.email, 'Order Placed', `Your order ${order.orderNumber} is confirmed.`);
  if (user?.phone) await sendSMS(user.phone, `Order ${order.orderNumber} confirmed. OTP: ${deliveryOtp}`);

  res.status(201).json({ order });
}

export async function getPharmacyOrders(req, res, next) {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const pharmacyId = req.user.pharmacyId;
    if (!pharmacyId && req.user.role !== 'admin') {
       return res.status(403).json({ success: false, message: 'No pharmacy associated with this account' });
    }
    
    const query = pharmacyId ? { pharmacyId } : {};
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      Order.find(query)
        .populate('customerId', 'name phone')
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
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const query = { customerId: req.user.id };
    if (status) query.status = status;

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
    const isDeliveryAgent = item.deliveryPartnerId?.toString() === req.user.id;
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
      io.to(`user:${order.customerId}`).emit('notification:new', notif);
    } catch (e) {}

    res.json({ item: order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
}

export async function verifyDeliveryOTP(req, res) {
  try {
    const { code } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    if (order.otp === code) {
      order.status = 'delivered';
      order.paymentStatus = 'paid'; // Assuming delivery confirms payment for COD
      await order.save();
      
      const io = getIO();
      io.to(`user:${order.customerId}`).emit('order:delivered', { orderId: order._id });
      
      return res.json({ ok: true, message: 'Order delivered successfully' });
    }
    return res.status(400).json({ message: 'Invalid delivery OTP' });
  } catch (e) {
    res.status(500).json({ message: 'Verification failed' });
  }
}

export async function liveTrackOrder(req, res) {
  try {
    const item = await Order.findById(req.params.id).select('status liveLocation');
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
