import { useEffect, useState } from 'react';
import { deliveryService } from '../services/apiServices.js';

export function useLiveLocationSender(orderId, enabled = true) {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!enabled || !orderId || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const payload = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed
        };
        setCoords({ lat: payload.lat, lng: payload.lng });
        setError('');
        deliveryService.updateLocation(orderId, payload).catch((requestError) => {
          setError(requestError.response?.data?.message || 'Unable to share live location.');
        });
      },
      (positionError) => setError(positionError.message || 'Location permission is required.'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orderId, enabled]);

  return { coords, error };
}
