import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001', {
  withCredentials: true
});

/**
 * GPS Trajectory Tracker Hook
 * Connects the terminal to the live logistics stream.
 */
export const useGPSTracking = (orderId) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    // Join the order room
    socket.emit('track:order', orderId);

    // Listen for live trajectory updates
    socket.on('location:live', (data) => {
      console.log(`[GPS Terminal] Live update for ${orderId}:`, data);
      setLocation(data);
    });

    return () => {
      socket.off('location:live');
    };
  }, [orderId]);

  // Delivery partner emit function
  const updateLocation = (lat, lng) => {
    if (!orderId) return;
    socket.emit('location:update', { orderId, lat, lng });
  };

  return { location, updateLocation };
};

export default socket;
