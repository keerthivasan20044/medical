import crypto from 'crypto';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';
import { sendEmail, sendSMS, sendWhatsApp } from '../utils/notify.js';
import PDFDocument from 'pdfkit';
import Razorpay from 'razorpay';

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  
  // Auto-detect environment placeholders and return null to trigger mock development mode
  if (
    key_id.includes('your_') || 
    key_id.includes('change-me') || 
    key_secret.includes('your_') || 
    key_secret.includes('change-me')
  ) {
    return null;
  }
  
  return new Razorpay({ key_id, key_secret });
}

function verifySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!orderId || !paymentId || !signature || !secret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
}

function renderReceipt(doc, order) {
  doc.fontSize(18).text('MediReach Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Order: ${order.orderNumber}`);
  doc.text(`Status: ${order.paymentStatus}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  doc.text('Items:');
  doc.moveDown(0.5);
  order.items.forEach((i) => {
    const name = i.medicine?.name || 'Medicine';
    doc.text(`${name} x${i.quantity || 1} - ₹${i.price}`);
  });
  doc.moveDown();
  doc.fontSize(14).text(`Total: ₹${order.totalAmount}`, { align: 'right' });
}

function buildReceiptBuffer(order) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    renderReceipt(doc, order);
    doc.end();
  });
}

function canAccessOrder(req, order) {
  return req.user?.role === 'admin' || String(order.customerId) === String(req.user?.id);
}

export async function createPaymentIntent(req, res) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Not allowed to access this order' });

    const amount = Math.round(Number(order.totalAmount || 0) * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Order amount must be greater than zero' });
    }
    const client = getRazorpayClient();
    
    if (client) {
      try {
        const rpOrder = await client.orders.create({
          amount,
          currency: 'INR',
          receipt: order.orderNumber,
          notes: { orderId: String(order._id) }
        });
        order.razorpayOrderId = rpOrder.id;
        await order.save();
        return res.json({ intent: { ...rpOrder, key: process.env.RAZORPAY_KEY_ID } });
      } catch (rpError) {
        console.warn('Razorpay creation failed. Falling back to mock if allowed.', rpError.message);
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      const mockId = `order_mock_${crypto.randomBytes(8).toString('hex')}`;
      order.razorpayOrderId = mockId;
      await order.save();
      return res.json({
        intent: {
          id: mockId,
          amount,
          currency: 'INR',
          receipt: order.orderNumber,
          notes: { orderId: String(order._id) },
          mock: true
        }
      });
    }

    res.status(500).json({ message: 'Razorpay configuration missing or invalid in production' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment' });
  }
}

export async function confirmPayment(req, res) {
  try {
    const { orderId, method, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const order = await Order.findById(orderId).populate('items.medicine');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Not allowed to access this order' });
    if (order.paymentStatus === 'paid') return res.json({ order });

    if (method !== 'cod') {
      const isMock = razorpay_order_id && razorpay_order_id.startsWith('order_mock_');
      if (!razorpay_order_id || String(order.razorpayOrderId) !== String(razorpay_order_id)) {
        return res.status(400).json({ message: 'Payment order mismatch' });
      }
      if (isMock && process.env.NODE_ENV !== 'production') {
        order.paymentId = razorpay_payment_id || `pay_mock_${crypto.randomBytes(8).toString('hex')}`;
        order.razorpayOrderId = razorpay_order_id;
      } else {
        if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature || '')) {
          return res.status(400).json({ message: 'Invalid payment signature' });
        }
        order.paymentId = razorpay_payment_id;
        order.razorpayOrderId = razorpay_order_id;
      }
    }

    order.paymentMethod = method || order.paymentMethod;
    order.paymentStatus = method === 'cod' ? 'pending' : 'paid';
    await order.save();

    const notif = await Notification.create({
      user: order.customerId,
      title: 'Payment Update',
      body: `Payment status: ${order.paymentStatus} for ${order.orderNumber}`,
      type: 'payment',
      icon: 'payment'
    });

    try {
      getIO().to(`user:${order.customerId}`).emit('notification:new', notif);
    } catch (e) {}

    const user = await User.findById(order.customerId);
    if (user?.email) {
      const receipt = order.paymentStatus === 'paid' ? await buildReceiptBuffer(order) : null;
      await sendEmail(
        user.email,
        'Payment Update',
        `Payment status: ${order.paymentStatus} for ${order.orderNumber}`,
        receipt ? [{ filename: `receipt-${order.orderNumber}.pdf`, content: receipt }] : undefined
      );
    }
    if (user?.phone) {
      const message = `Payment ${order.paymentStatus} for ${order.orderNumber}. Download your receipt from MediReach orders.`;
      await sendSMS(user.phone, message);
      await sendWhatsApp(user.phone, message);
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
}

export async function getReceipt(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate('items.medicine');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Not allowed to access this receipt' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${order.orderNumber}.pdf`);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);
    renderReceipt(doc, order);
    doc.end();
  } catch (e) {
    res.status(500).json({ message: 'Failed to generate receipt' });
  }
}

export async function getReceipts(req, res) {
  try {
    const items = await Order.find({ customerId: req.user.id, paymentStatus: { $in: ['paid', 'pending'] } })
      .sort({ createdAt: -1 })
      .select('orderNumber totalAmount paymentStatus createdAt');
    res.json({ items });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch receipts' });
  }
}

export async function getReceiptsCsv(req, res) {
  try {
    const items = await Order.find({ customerId: req.user.id, paymentStatus: { $in: ['paid', 'pending'] } })
      .sort({ createdAt: -1 })
      .select('orderNumber totalAmount paymentStatus createdAt');

    const rows = [
      ['orderNumber', 'totalAmount', 'paymentStatus', 'createdAt'],
      ...items.map((i) => [i.orderNumber, i.totalAmount, i.paymentStatus, i.createdAt.toISOString()])
    ];

    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=receipts.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ message: 'Failed to generate CSV' });
  }
}

export async function logPaymentRetry(req, res) {
  try {
    const { orderId, reason } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!canAccessOrder(req, order)) return res.status(403).json({ message: 'Not allowed to access this order' });
    
    // Using a simpler logging for now
    console.log(`[Payment Retry] Order: ${order.orderNumber}, Reason: ${reason}`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: 'Failed to log retry' });
  }
}

export async function razorpayWebhook(req, res) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.body.toString(); // Ensure it's a string for HMAC
    
    if (!verifyWebhookSignature(rawBody, signature || '')) {
      console.warn('[Razorpay Webhook] Invalid signature');
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('[Razorpay Webhook] Parse error:', parseError);
      return res.status(400).json({ message: 'Invalid webhook payload' });
    }
    
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const order = await Order.findOne({ razorpayOrderId: payment.order_id }).populate('items.medicine');
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentId = payment.id;
        await order.save();

        const notif = await Notification.create({
          user: order.customerId,
          title: 'Payment Captured',
          body: `Payment captured for ${order.orderNumber}`,
          type: 'payment',
          icon: 'payment'
        });

        try {
          getIO().to(`user:${order.customerId}`).emit('notification:new', notif);
        } catch (e) {}

        const user = await User.findById(order.customerId);
        if (user?.email) {
          const receipt = await buildReceiptBuffer(order);
          await sendEmail(
            user.email,
            'Payment Captured',
            `Payment captured for ${order.orderNumber}`,
            [{ filename: `receipt-${order.orderNumber}.pdf`, content: receipt }]
          );
        }
        if (user?.phone) {
          const message = `Payment captured for ${order.orderNumber}. Your MediReach receipt is ready.`;
          await sendSMS(user.phone, message);
          await sendWhatsApp(user.phone, message);
        }
      }
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Webhook processing failed' });
  }
}
