import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderTrack, setLocation, setEta, setStatusText } from '../store/trackingSlice.js';
import { socket } from '../services/socket.js';

export function useOrderTracking(orderId) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.tracking);

  useEffect(() => {
    if (!orderId) return;
    dispatch(fetchOrderTrack(orderId));
    if (!socket.connected) socket.connect();
    socket.emit('order:track-subscribe', { orderId });
    socket.on('order:location-update', (payload) => {
      if (payload.orderId !== orderId) return;
      dispatch(setLocation({ lat: payload.lat, lng: payload.lng }));
      if (payload.eta) dispatch(setEta(payload.eta));
    });
    socket.on('order:status-update', (payload) => {
      if (payload.orderId !== orderId) return;
      dispatch(setStatusText(payload.status));
    });
    return () => {
      socket.off('order:location-update');
      socket.off('order:status-update');
    };
  }, [orderId, dispatch]);

  return state;
}
