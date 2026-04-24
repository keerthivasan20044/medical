import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
if (import.meta.env.DEV) { console.log('[Socket] Connected to Master Node Architecture'); }
      setIsConnected(true);
      newSocket.emit('join:user', userId);
    });

    newSocket.on('disconnect', () => {
if (import.meta.env.DEV) { console.log('[Socket] Disconnected from Architecture'); }
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [userId]);

  return { socket, isConnected };
};

export const useOrderLiveTracking = (orderId, userId) => {
  const { socket, isConnected } = useSocket(userId);
  const [location, setLocation] = useState({ lat: 10.9254, lng: 79.8385 }); // Karaikal Center
  const [status, setStatus] = useState('placed');
  const [eta, setEta] = useState(15);

  useEffect(() => {
    if (!socket || !orderId) return;

    socket.emit('join:order', orderId);

    socket.on('order:status', (data) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
if (import.meta.env.DEV) { console.log(`[Order] Status Synchronized: ${data.status}`); }
      }
    });

    socket.on('order:location', (data) => {
      if (data.orderId === orderId) {
        setLocation(data.location);
        setEta(data.eta);
if (import.meta.env.DEV) { console.log(`[Order] GPS Ping Received: ${data.location.lat}, ${data.location.lng}`); }
      }
    });

    return () => {
      socket.off('order:status');
      socket.off('order:location');
    };
  }, [socket, orderId]);

  return { location, status, eta, isConnected };
};
