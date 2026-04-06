import { getIO } from '../config/socket.js';

// District Nodes for regional simulation
const DHASHBOARD_NODES = [
  { lat: 10.9254, lng: 79.8385 }, // Central
  { lat: 10.9123, lng: 79.8456 }, // Nagore
  { lat: 10.9301, lng: 79.8290 }, // Poompuhar
  { lat: 10.9350, lng: 79.8350 }  // New Colony
];

export const simulateDelivery = (orderId) => {
  let progress = 0;
  const steps = 30; // Increased fidelity 
  const node = DHASHBOARD_NODES[Math.floor(Math.random() * DHASHBOARD_NODES.length)];
  const io = getIO();

  console.log(`[Simulator] Architecture Delivery Initialized: Order #${orderId.slice(-6)}`);

  const interval = setInterval(() => {
    progress += 1;
    
    // Simulate complex district trajectory 
    // Moving from random node towards a virtual customer destination (+0.01 deviation)
    const currentLat = node.lat + (progress * 0.0003);
    const currentLng = node.lng + (progress * 0.0003);
    
    const status = progress < 5 ? 'preparing' : 
                   progress < 10 ? 'packaging' : 
                   progress < 25 ? 'on way' : 'delivered';

    const telemetry = {
      orderId,
      location: { lat: currentLat, lng: currentLng },
      eta: Math.max(0, 15 - Math.floor(progress / 2)),
      progress: Math.floor((progress / steps) * 100),
      status
    };

    try {
      // Synchronize specialized rooms
      io.to(`order:${orderId}`).emit('order:location-update', telemetry);
      io.to('admin').emit('telemetry:pulse', { orderId, telemetry });

      if (progress >= steps) {
        clearInterval(interval);
        io.to(`order:${orderId}`).emit('order:status-update', { orderId, status: 'delivered' });
        console.log(`[Simulator] Protocol Successful: Order #${orderId.slice(-6)} Fulfillment Reached.`);
      }
    } catch (e) {
      clearInterval(interval);
      console.warn(`[Simulator] Node Interrupted: Order #${orderId.slice(-6)} Sync Lost.`);
    }
  }, 4000); // Higher fidelity updates (4s)
};
