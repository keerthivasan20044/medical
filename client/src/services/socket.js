import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId, role) {
    this.socket = io(SOCKET_URL, {
      query: { userId, role },
      transports: ['websocket'],
      withCredentials: true
    });

    this.socket.on('connect', () => {
if (import.meta.env.DEV) { console.log(`[Socket] Connected as ${role} (ID: ${userId})`); }
      // Join specific rooms
      this.socket.emit('join', { userId, role });
      if (role === 'admin') this.socket.emit('join', { room: 'admin' });
      if (role === 'delivery') this.socket.emit('join', { room: 'delivery_pool' });
    });

    this.socket.on('disconnect', () => {
if (import.meta.env.DEV) { console.log('[Socket] Disconnected'); }
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Generic event listener
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Generic event emitter
  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
export const socket = socketService;
