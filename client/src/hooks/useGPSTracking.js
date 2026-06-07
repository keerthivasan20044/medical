import { useEffect, useState } from 'react';
import { deliveryService } from '../services/apiServices.js';
import { socketService } from '../services/socket.js';

/**
 * GPS Trajectory Tracker Hook
 * Connects the page to the live logistics stream.
 */
export const useGPSTracking = (orderId) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    const socket = socketService.connect();

    // Join the order room
    socket.emit('order:track-subscribe', { orderId });

    // Listen for live trajectory updates
    const handleLocation = (data) => {
      if (String(data.orderId) !== String(orderId)) return;
      const source = data?.location || data?.liveLocation || data;
      const lat = Number(source?.lat);
      const lng = Number(source?.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setLocation({ ...data, lat, lng });
      }
    };
    socket.on('order:location-update', handleLocation);

    return () => {
      socket.off('order:location-update', handleLocation);
    };
  }, [orderId]);

  // Delivery partner updates pass through the authenticated API.
  const updateLocation = (lat, lng) => {
    if (!orderId) return;
    return deliveryService.updateLocation(orderId, { lat, lng });
  };

  return { location, updateLocation };
};
