import { useEffect, useState } from 'react';
import { socket } from '../services/socket.js';

export function useLiveLocationSender(orderId, enabled = true) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!enabled || !orderId || !navigator.geolocation) return;
    if (!socket.connected) socket.connect();

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          orderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setCoords({ lat: payload.lat, lng: payload.lng });
        socket.emit('delivery:location', payload);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orderId, enabled]);

  return coords;
}
