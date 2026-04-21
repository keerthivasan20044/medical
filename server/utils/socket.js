/**
 * GPS Room Architecture
 * Delivery partner emits 'location:update'
 * Customer joins 'order_${orderId}' room and receives 'location:live'
 */
export const registerGPSHandlers = (io, socket) => {
  // Customer joins order room to track trajectory
  socket.on('track:order', (orderId) => {
    if (orderId) {
      socket.join(`order_${orderId}`);
      console.log(`[GPS Sync] Customer tracking order: ${orderId}`);
    }
  });

  // Delivery partner emits live coordinate stream
  socket.on('location:update', ({ orderId, lat, lng }) => {
    if (orderId && lat && lng) {
      io.to(`order_${orderId}`).emit('location:live', { lat, lng, timestamp: new Date() });
      console.log(`[GPS Stream] Trajectory update for ${orderId}: ${lat}, ${lng}`);
    }
  });
};
