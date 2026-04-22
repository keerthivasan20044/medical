import crypto from 'crypto';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from '../config/socket.js';
import { sendEmail, sendSMS } from '../utils/notify.js';
import PDFDocument from 'pdfkit';
import Razorpay from 'razorpay';

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

function verifySignature(orderId, paymentId, signature) {
  const secret = process.env.RAZORPAY_KEY_SECRET || '';
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
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

export async function createPaymentIntent(req, res) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const amount = Math.round(Number(order.totalAmount || 0) * 100);
    const client = getRazorpayClient();
    
    if (client) {
      const rpOrder = await client.orders.create({
        amount,
        currency: 'INR',
        receipt: order.orderNumber,
        notes: { orderId: String(order._id) }
      });
      order.razorpayOrderId = rpOrder.id;
      await order.save();
      return res.json({ intent: rpOrder });
    }

    res.status(500).json({ message: 'Razorpay configuration missing' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment' });
  }
}

export async function confirmPayment(req, res) {
  try {
    const { orderId, method, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const order = await Order.findById(orderId).populate('items.medicine');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (method !== 'cod') {
      if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature || '')) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      order.paymentId = razorpay_payment_id;
      order.razorpayOrderId = razorpay_order_id;
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
    if (user?.phone) await sendSMS(user.phone, `Payment ${order.paymentStatus} for ${order.orderNumber}`);

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
}

export async function getReceipt(req, res) {
  try {
    const order = await Order.findById(req.params.id).populate('items.medicine');
    if (!order) return res.status(404).json({ message: 'Order not found' });

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
    const rawBody = req.body;
    if (!verifyWebhookSignature(rawBody, signature || '')) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    let payload;
    try {
      payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    } catch (parseError) {
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
        if (user?.phone) await sendSMS(user.phone, `Payment captured for ${order.orderNumber}`);
      }
    }

    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Webhook processing failed' });
  }
}
