export const registerChatHandlers = (io, socket) => {
  // Join Chat Node
  socket.on('chat:join', ({ orderId, userId }) => {
    socket.join(`chat:${orderId}`);
    console.log(`[Chat] User ${userId} synchronized with order chat: ${orderId}`);
  });

  // Message Synchronization
  socket.on('chat:send', (payload) => {
    const { orderId, senderId, senderName, text } = payload;
    const message = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      text,
      timestamp: new Date()
    };
    
    // Broadcast to chat room
    io.to(`chat:${orderId}`).emit('chat:receive', message);
    console.log(`[Chat] Real-time message synced for order ${orderId}`);
  });
};
