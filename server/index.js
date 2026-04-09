import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import http from 'http';

import { connectDB } from './config/db.js';
import { initSocket } from './config/socket.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import pharmacyRoutes from './routes/pharmacyRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import { getPublicStats } from './controllers/publicController.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const server = http.createServer(app);
initSocket(server);

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
];

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

// Razorpay webhook needs raw body
app.use('/api/payments/webhook/razorpay', express.raw({ type: 'application/json' }));

app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook/razorpay') return next();
  return express.json()(req, res, next);
});

app.use(cookieParser());
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({ status: 'MediPharm API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'MediPharm API Synchronized' }));
app.get('/api/public/stats', getPublicStats);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect to DB immediately
const dbPromise = connectDB().catch(err => {
  console.error('Failed to connect to DB during initialization:', err);
});

const PORT = process.env.PORT || 5001;

// Only listen if not running as a Vercel function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  dbPromise.then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

export default app;
