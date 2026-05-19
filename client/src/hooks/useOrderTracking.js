import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderTrack, setLocation, setEta, setStatusText } from '../store/trackingSlice.js';
import { socketService } from '../services/socket.js';

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
    if (!listeningRef.current) {
      listeningRef.current = true;

      sock.on('order:location-update', (payload) => {
        if (payload.orderId !== orderId) return;
        dispatch(setLocation({ lat: payload.lat, lng: payload.lng }));
        if (payload.eta) dispatch(setEta(payload.eta));
      });

      sock.on('order:status-update', (payload) => {
        if (payload.orderId !== orderId) return;
        dispatch(setStatusText(payload.status));
      });
    }

    return () => {
      sock.off('order:location-update');
      sock.off('order:status-update');
      listeningRef.current = false;
    };
  }, [orderId, user?.id, user?.role, dispatch]);

  return state;
}
