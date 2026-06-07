import { sendEmail, sendWhatsApp } from '../utils/notify.js';
import { getIO } from '../config/socket.js';

/**
 * Unified Notification Service
 * Sends notifications via: WebSocket + Email + WhatsApp
 */

export async function notifyOrderPlaced(order, user) {
  const io = getIO();
  const orderId = order._id?.toString();
  
  // 1. Real-time WebSocket notification
  io.to(`user:${user._id}`).emit('notification', {
    type: 'order_placed',
    title: '📦 Order Placed',
    message: `Order #${orderId?.slice(-6)} confirmed!`,
    orderId,
    icon: '📦',
    timestamp: new Date()
  });

  // 2. Email notification
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Order Confirmed!</h2>
      <p>Your MediReach order has been placed successfully.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total:</strong> ₹${order.totalPrice}</p>
      <p>Your medicines will arrive in 2-3 hours.</p>
      <p><a href="${process.env.CLIENT_URL}/orders/${orderId}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Order</a></p>
      <p>Thank you for using MediReach!</p>
    </div>
  `;
  
  await sendEmail(
    user.email,
    '✅ Order Confirmed - MediReach',
    emailBody
  );

  // 3. WhatsApp notification
  await sendWhatsApp(
    user.phone,
    `✅ Your MediReach order #${orderId?.slice(-6)} is confirmed!\n\nTrack: ${process.env.CLIENT_URL}/track/${orderId}`
  );

  console.log(`[Notification] Order placed notification sent to ${user.email}`);
}

export async function notifyOrderStatusUpdate(order, user, newStatus) {
  const io = getIO();
  const orderId = order._id?.toString();
  
  const statusMessages = {
    confirmed: '✅ Order Confirmed',
    processing: '⏳ Being Processed',
    ready_for_pickup: '📦 Ready for Pickup',
    on_the_way: '🚗 On the Way',
    delivered: '✅ Delivered',
    cancelled: '❌ Cancelled'
  };

  const statusEmoji = {
    confirmed: '✅',
    processing: '⏳',
    ready_for_pickup: '📦',
    on_the_way: '🚗',
    delivered: '✅',
    cancelled: '❌'
  };

  // 1. WebSocket update
  io.to(`order:${orderId}`).emit('order:status', {
    orderId,
    status: newStatus,
    message: statusMessages[newStatus],
    updatedAt: new Date()
  });

  // 2. Email notification
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>${statusMessages[newStatus]}</h2>
      <p>Your order #${orderId?.slice(-6)} status has been updated.</p>
      <p><strong>New Status:</strong> ${statusMessages[newStatus]}</p>
      <p><a href="${process.env.CLIENT_URL}/orders/${orderId}" style="background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order</a></p>
    </div>
  `;

  await sendEmail(
    user.email,
    `${statusEmoji[newStatus]} ${statusMessages[newStatus]} - MediReach`,
    emailBody
  );

  // 3. WhatsApp notification
  await sendWhatsApp(
    user.phone,
    `${statusEmoji[newStatus]} ${statusMessages[newStatus]}\n\nOrder: #${orderId?.slice(-6)}\nView: ${process.env.CLIENT_URL}/track/${orderId}`
  );

  console.log(`[Notification] Order status update sent to ${user.email}`);
}

export async function notifyDeliveryStarted(order, user, deliveryPartner) {
  const io = getIO();
  const orderId = order._id?.toString();

  // 1. WebSocket with real-time location
  io.to(`order:${orderId}`).emit('delivery:started', {
    orderId,
    deliveryPartner: {
      name: deliveryPartner.name,
      phone: deliveryPartner.phone,
      vehicle: deliveryPartner.vehicle
    },
    message: 'Your delivery partner is on the way!',
    timestamp: new Date()
  });

  // 2. Email
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>🚗 Your Delivery is On the Way!</h2>
      <p>Your order #${orderId?.slice(-6)} is being delivered.</p>
      <p><strong>Driver:</strong> ${deliveryPartner.name}</p>
      <p><strong>Contact:</strong> ${deliveryPartner.phone}</p>
      <p><a href="${process.env.CLIENT_URL}/track/${orderId}" style="background: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Live</a></p>
    </div>
  `;

  await sendEmail(
    user.email,
    '🚗 Delivery Started - MediReach',
    emailBody
  );

  // 3. WhatsApp
  await sendWhatsApp(
    user.phone,
    `🚗 Your order is on the way!\n\nDriver: ${deliveryPartner.name}\n📞 ${deliveryPartner.phone}\n\nLive track: ${process.env.CLIENT_URL}/track/${orderId}`
  );

  console.log(`[Notification] Delivery started notification sent`);
}

export async function notifyOrderDelivered(order, user) {
  const io = getIO();
  const orderId = order._id?.toString();

  // 1. WebSocket
  io.to(`order:${orderId}`).emit('order:delivered', {
    orderId,
    message: 'Your order has been delivered!',
    timestamp: new Date()
  });

  // 2. Email with review request
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>✅ Order Delivered!</h2>
      <p>Your order #${orderId?.slice(-6)} has been delivered successfully.</p>
      <p>Thank you for shopping with MediReach!</p>
      <p><a href="${process.env.CLIENT_URL}/review/${orderId}" style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Rate & Review</a></p>
    </div>
  `;

  await sendEmail(
    user.email,
    '✅ Order Delivered - MediReach',
    emailBody
  );

  // 3. WhatsApp
  await sendWhatsApp(
    user.phone,
    `✅ Your order #${orderId?.slice(-6)} has been delivered!\n\nThank you for using MediReach. 🙏`
  );

  console.log(`[Notification] Order delivered notification sent`);
}

export async function notifyOTPGenerated(phone, otp, type = 'login') {
  const message = `Your MediReach ${type} OTP is ${otp}. Valid for 10 minutes.`;
  
  // Send via WhatsApp only for OTP (faster than email)
  await sendWhatsApp(phone, message);
  
  console.log(`[Notification] OTP sent to ${phone}`);
}

export async function notifyAppointmentReminder(appointment, patient) {
  const io = getIO();

  // 1. WebSocket
  io.to(`user:${patient._id}`).emit('notification', {
    type: 'appointment_reminder',
    title: '📅 Appointment Reminder',
    message: `Your appointment with Dr. ${appointment.doctor.name} is in 1 hour`,
    icon: '📅',
    timestamp: new Date()
  });

  // 2. Email
  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>📅 Appointment Reminder</h2>
      <p>Your appointment is scheduled in 1 hour.</p>
      <p><strong>Doctor:</strong> Dr. ${appointment.doctor.name}</p>
      <p><strong>Time:</strong> ${appointment.scheduledTime}</p>
      <p><a href="${process.env.CLIENT_URL}/appointments/${appointment._id}" style="background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Appointment</a></p>
    </div>
  `;

  await sendEmail(
    patient.email,
    '📅 Appointment Reminder - MediReach',
    emailBody
  );

  // 3. WhatsApp
  await sendWhatsApp(
    patient.phone,
    `📅 Appointment reminder!\n\nDoctor: Dr. ${appointment.doctor.name}\nTime: ${appointment.scheduledTime}\n\nView: ${process.env.CLIENT_URL}/appointments/${appointment._id}`
  );

  console.log(`[Notification] Appointment reminder sent`);
}

export async function notifyBroadcast(roleOrPharmacy, title, message, channel = 'role') {
  const io = getIO();
  
  // Send to all users with specific role or pharmacy
  const roomId = channel === 'role' ? `role:${roleOrPharmacy}` : `pharmacy:${roleOrPharmacy}`;
  
  io.to(roomId).emit('notification', {
    type: 'broadcast',
    title,
    message,
    timestamp: new Date()
  });

  console.log(`[Notification] Broadcast sent to ${roomId}`);
}
