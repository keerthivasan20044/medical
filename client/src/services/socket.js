import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId, role) {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SOCKET_URL, {
      query: { userId, role },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      this.connected = true;
      if (import.meta.env.DEV) { console.log(`[Socket] Connected as ${role} (ID: ${userId})`); }
      // Join specific rooms
      this.socket.emit('join', { userId, role });
      if (role === 'admin') this.socket.emit('join', { room: 'admin' });
      if (role === 'delivery') this.socket.emit('join', { room: 'delivery_pool' });
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      if (import.meta.env.DEV) { console.log('[Socket] Disconnected'); }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket && typeof this.socket.on === 'function') {
      this.socket.on(event, callback);
    }
  }

  // Generic event remover
  off(event, callback) {
    if (this.socket && typeof this.socket.off === 'function') {
      this.socket.off(event, callback);
    }
  }

  // Generic event emitter
  emit(event, data) {
    if (this.socket && typeof this.socket.emit === 'function') {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
export const socket = socketService;
