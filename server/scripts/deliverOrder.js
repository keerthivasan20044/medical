import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import { simulateDelivery } from '../services/gpsSimulator.js';

dotenv.config();

const orderId = process.argv[2];

if (!orderId) {
  console.error('[Error] Please provide an Order ID: npm run deliver <order_id>');
  process.exit(1);
}

const deliverOrderProtocol = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Protocol] Connected to Database Architecture');

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`[Error] Order ${orderId} not found in enclave.`);
      process.exit(1);
    }

    console.log(`[Protocol] Initiating Delivery Enclave for Order ${order.orderNumber}...`);
    
    // Update status to 'on way' to start UI tracking
    order.status = 'on way';
    await order.save();
    console.log('[Protocol] Order status synchronized: ON WAY');

    // Trigger GPS simulator
    console.log('[Protocol] Booting GPS Trajectory Simulator...');
    simulateDelivery(orderId);

    // Wait for simulation to finish (approx 100s in simulator logic)
    // For manual testing, we just leave it running
    console.log('[Protocol] Live Tracking Synchronized. Monitor the frontend for GPS pings.');

  } catch (err) {
    console.error(`[Fatal] Prototype Delivery Failure: ${err.message}`);
  }
};

deliverOrderProtocol();
