import { Server } from 'socket.io';
import { registerChatHandlers } from '../sockets/chatHandler.js';
import { registerGPSHandlers } from '../utils/socket.js';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
      ],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('node:register', ({ id, role, pharmacyId }) => {
      if (id) {
        socket.join(`user:${id}`);
        console.log(`[Node Sync] User ${id} joined room.`);
      }
      if (role) {
        socket.join(`role:${role}`);
        console.log(`[Node Sync] Role ${role} joined room.`);
      }
      if (pharmacyId) {
        socket.join(`pharmacy:${pharmacyId}`);
        console.log(`[Node Sync] Pharmacy ${pharmacyId} joined room.`);
      }
    });

    socket.on('pharmacy:join', ({ pharmacyId }) => {
      if (pharmacyId) {
        socket.join(`pharmacy:${pharmacyId}`);
        console.log(`[Pharmacy Node] Joined Room: ${pharmacyId}`);
      }
    });

    socket.on('order:track-subscribe', ({ orderId }) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('delivery:location', (payload) => {
      io.to(`order:${payload.orderId}`).emit('order:location-update', payload);
    });

    // Architecture Chat Enclave
    registerChatHandlers(io, socket);
    
    // GPS Trajectory Mapping
    registerGPSHandlers(io, socket);
  });
}

export function getIO() {
  if (!io) throw new Error('Socket not initialized');
  return io;
}
