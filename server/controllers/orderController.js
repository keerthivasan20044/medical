import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';
import { sendEmail, sendSMS } from '../utils/notify.js';

export async function placeOrder(req, res) {
  const { pharmacy, items = [], deliveryAddress, paymentMethod, note } = req.body;
  if (!items.length) return res.status(400).json({ message: 'No items' });
  const totalAmount = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 1), 0);
  const orderNumber = `MED-${Date.now()}`;
  const order = await Order.create({
    orderNumber,
    customer: req.user.id,
    pharmacy,
    items,
    totalAmount,
    paymentMethod,
    deliveryAddress,
    note,
    status: 'placed'
  });

  const notif = await Notification.create({
    user: req.user.id,
    title: 'Order Placed',
    body: `Order ${order.orderNumber} confirmed.`,
    type: 'order',
    icon: 'order'
  });

  try {
    const io = getIO();
    io.to(`user:${req.user.id}`).emit('notification:new', notif);
    // Emit order:placed for customer's UI update
    io.to(`user:${req.user.id}`).emit('order:placed', { 
       id: order.orderNumber, 
       pharmacyName: 'Pharmacy Node', 
       eta: '30 min' 
    });
    // Pharmacy Real-Time Node Handshake
    io.to(`pharmacy:${pharmacy}`).emit('order:new', order);
    // Global Multi-Node Sync
    io.to('admin').emit('order:new', order);
    // Global District Pulse Broadcast
    io.emit('activity:new', {
       type: 'order_placed',
       message: `New medical node handshake initiated in Karaikal via ${orderNumber}`,
       location: 'Karaikal Central',
       timestamp: new Date()
    });
  } catch (e) {
    // socket not ready
  }

  const user = await User.findById(req.user.id);
  if (user?.email) await sendEmail(user.email, 'Order Placed', `Your order ${order.orderNumber} is confirmed.`);
  if (user?.phone) await sendSMS(user.phone, `Order ${order.orderNumber} confirmed.`);

  res.status(201).json({ order });
}

export async function getMyOrders(req, res) {
  try {
    const items = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
}

export async function getOrderById(req, res) {
  try {
    const item = await Order.findById(req.params.id).populate('items.medicine');
    if (!item) return res.status(404).json({ message: 'Order not found' });
    
    // Authorization check: User can only view their own orders unless they're admin/pharmacy staff/delivery agent
    const isOrderOwner = item.customer.toString() === req.user.id;
    const isDeliveryAgent = item.deliveryAgent?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'pharmacist';
    
    if (!isOrderOwner && !isDeliveryAgent && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Cannot access this order' });
    }
    
    res.json({ item });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    
    // Validate status enum (A-Rank District Protocol)
    const validStatuses = ['placed', 'confirmed', 'preparing', 'shipped', 'dispatched', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid protocol status: ${status}` });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Authorization check: Only admin, pharmacist, or assigned delivery agent can update
    const isAdmin = req.user.role === 'admin' || req.user.role === 'pharmacist';
    const isDeliveryAgent = order.deliveryAgent?.toString() === req.user.id;
    
    if (!isAdmin && !isDeliveryAgent) {
      return res.status(403).json({ message: 'Forbidden: Cannot update this order' });
    }
    
    order.status = status;
    await order.save();

    const notif = await Notification.create({
      user: order.customer,
      title: 'Order Status Update',
      body: `Your order ${order.orderNumber} is now ${status}.`,
      type: 'order',
      icon: 'order'
    });

    try {
      const io = getIO();
      const statusPayload = { 
         orderId: order._id, 
         id: order.orderNumber,
         status,
         pharmacyName: 'District Pharmacy', 
         notif
      };
      // Consistent status update event
      io.to(`user:${order.customer}`).emit('order:status-update', statusPayload);
      io.to(`order:${order._id}`).emit('order:status-update', statusPayload);
      
      // Fallback for legacy listeners
      io.to(`user:${order.customer}`).emit('order:status', statusPayload);
      
      io.to(`order:${order._id}`).emit('notification:new', notif);
      
      // Global District Pulse Broadcast
      io.emit('activity:new', {
         type: 'order_update',
         message: `Order #${order.orderNumber.slice(-6)} protocol updated to: ${status.toUpperCase()}`,
         location: 'Logistics Terminal',
         timestamp: new Date()
      });
    } catch (e) {}

    res.json({ item: order, order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
}

export async function verifyDeliveryOTP(req, res) {
  const { code } = req.body;
  const item = await Order.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Order not found' });
  if (item.otp?.code && item.otp.code === code) {
    item.otp.verified = true;
    item.status = 'delivered';
    await item.save();
    return res.json({ ok: true });
  }
  return res.status(400).json({ message: 'Invalid OTP' });
}

export async function liveTrackOrder(req, res) {
  const item = await Order.findById(req.params.id).select('status liveLocation estimatedDelivery');
  res.json({ item });
}

export async function rateOrder(req, res) {
  const { pharmacyRating, deliveryRating, comment } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order Node not found.' });

  order.rating = {
    pharmacy: { score: pharmacyRating, review: comment },
    delivery: { score: deliveryRating, review: comment }
  };

  await order.save();
  res.json({ ok: true, message: 'Architecture Feedback Synchronized.' });
}
