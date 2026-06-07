import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5001`
    : 'http://localhost:5001';

function getSocketUrl() {
  const rawUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || DEFAULT_SOCKET_URL;
  try {
    const url = new URL(rawUrl, typeof window !== 'undefined' ? window.location.origin : DEFAULT_SOCKET_URL);
    if (url.pathname.endsWith('/api')) url.pathname = url.pathname.slice(0, -4) || '/';
    return url.origin + (url.pathname === '/' ? '' : url.pathname.replace(/\/$/, ''));
  } catch {
    return DEFAULT_SOCKET_URL;
  }
}

const SOCKET_URL = getSocketUrl();

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId, role) {
    if (this.socket?.connected) return this.socket;
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      this.connected = true;
      if (import.meta.env.DEV) { console.log(`[Socket] Connected as ${role} (ID: ${userId})`); }
      this.socket.emit('node:register');
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
