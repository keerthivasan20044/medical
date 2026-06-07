import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderTrack, setLocation, setEta, setStatusText } from '../store/trackingSlice.js';
import { socketService } from '../services/socket.js';

function getPayloadLocation(payload) {
  const source = payload?.location || payload?.liveLocation || payload;
  const lat = Number(source?.lat);
  const lng = Number(source?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
    lat,
    lng,
    accuracy: payload?.accuracy ?? source?.accuracy,
    heading: payload?.heading ?? source?.heading,
    speed: payload?.speed ?? source?.speed,
    timestamp: payload?.timestamp || source?.timestamp || new Date().toISOString()
  };
}

export function useOrderTracking(orderId) {
  const dispatch  = useDispatch();
  const state     = useSelector((s) => s.tracking);
  const user      = useSelector((s) => s.auth?.user);
  const listeningRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    // 1. Fetch initial state from REST
    dispatch(fetchOrderTrack(orderId));

    // 2. Ensure socket is connected (uses existing connection if already up)
    const sock = socketService.connect(user?.id, user?.role || 'customer');

    // 3. Subscribe to the order's tracking room
    sock.emit('order:track-subscribe', { orderId });

    // 4. Attach event listeners (guard against duplicate registration)
    const handleLocationUpdate = (payload) => {
        if (String(payload.orderId) !== String(orderId)) return;
        const nextLocation = getPayloadLocation(payload);
        if (nextLocation) dispatch(setLocation(nextLocation));
        if (payload.eta) dispatch(setEta(payload.eta));
        if (payload.status || payload.mainStatus) dispatch(setStatusText(payload.mainStatus || payload.status));
      };

    const handleStatusUpdate = (payload) => {
        if (String(payload.orderId) !== String(orderId)) return;
        dispatch(setStatusText(payload.status));
      };

    if (!listeningRef.current) {
      listeningRef.current = true;

      sock.on('order:location-update', handleLocationUpdate);
      sock.on('order:status-update', handleStatusUpdate);
    }

    return () => {
      sock.off('order:location-update', handleLocationUpdate);
      sock.off('order:status-update', handleStatusUpdate);
      listeningRef.current = false;
    };
  }, [orderId, user?.id, user?.role, dispatch]);

  return state;
}
