import { Server } from 'socket.io';
import { registerChatHandlers } from '../sockets/chatHandler.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

let io;

const allowedSocketOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  /^http:\/\/10\.\d+\.\d+\.\d+:(5173|5174|5175|5176|4173)$/,
  /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+:(5173|5174|5175|5176|4173)$/,
  /^http:\/\/192\.168\.\d+\.\d+:(5173|5174|5175|5176|4173)$/
];

function parseCookies(cookieString) {
  const list = {};
  if (!cookieString) return list;
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: allowedSocketOrigins,
      credentials: true
    },
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 60000
  });

  // Debug logging for connection issues
  if (process.env.DEBUG_SOCKET === 'true') {
    io.engine.on('connection_error', (err) => {
      console.error('[Socket.IO] Connection error:', err.code, err.message);
    });
  }

  // Real-time JWT Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      const token = cookies.accessToken || socket.handshake.query?.token || socket.handshake.auth?.token;
      const JWT_SECRET = process.env.JWT_SECRET;

      if (token && JWT_SECRET) {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('isActive role pharmacyId').lean();
        if (!user?.isActive) {
          socket.user = null;
          return next();
        }
        socket.user = { ...decoded, role: user.role, pharmacyId: user.pharmacyId };
        console.log(`[Socket Auth] Secure connection established for: ${decoded.name} (${user.role})`);
      } else {
        socket.user = null;
        console.log('[Socket Auth] Connection established for anonymous/guest user');
      }
      next();
    } catch (err) {
      console.warn('[Socket Auth] Handshake verification rejected/ignored:', err.message);
      socket.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    const userRole = socket.user?.role;

    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Node Sync] User ${userId} joined room.`);
    }
    if (userRole) {
      socket.join(`role:${userRole}`);
      console.log(`[Node Sync] Role ${userRole} joined room.`);
    }

    socket.on('node:register', ({ pharmacyId } = {}) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`[Node Sync] User ${userId} registered room.`);
      }
      if (userRole) {
        socket.join(`role:${userRole}`);
        console.log(`[Node Sync] Role ${userRole} registered room.`);
      }
      if (pharmacyId && userRole === 'pharmacist' && String(socket.user?.pharmacyId) === String(pharmacyId)) {
        socket.join(`pharmacy:${pharmacyId}`);
        console.log(`[Node Sync] Pharmacy ${pharmacyId} registered room.`);
      }
    });

    socket.on('pharmacy:join', ({ pharmacyId }) => {
      if (pharmacyId && userRole === 'pharmacist' && String(socket.user?.pharmacyId) === String(pharmacyId)) {
        socket.join(`pharmacy:${pharmacyId}`);
        console.log(`[Pharmacy Node] Joined Room: ${pharmacyId}`);
      }
    });

    socket.on('order:track-subscribe', async ({ orderId } = {}) => {
      if (!orderId || !userId) return;
      const order = await Order.findById(orderId).select('customerId deliveryPartner pharmacyId').lean().catch(() => null);
      if (!order) return;
      const allowed = userRole === 'admin'
        || String(order.customerId) === String(userId)
        || String(order.deliveryPartner) === String(userId)
        || (userRole === 'pharmacist' && String(order.pharmacyId) === String(socket.user?.pharmacyId));
      if (allowed) socket.join(`order:${orderId}`);
    });

    // Architecture Chat Enclave
    registerChatHandlers(io, socket);
  });
}

export function getIO() {
  if (!io) throw new Error('Socket not initialized');
  return io;
}
