import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Truck, Package, MessageSquare } from 'lucide-react';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect for all users to maintain 'Sync Status'
    if (!socket.connected) {
      socket.connect();
    }
    
    if (user) {
      socket.emit('user:join', { id: user.id || user._id, role: user.role });
    }

    function onConnect() { setIsConnected(true); }
    function onDisconnect() { setIsConnected(false); }

    // REAL-TIME PULSE HANDLERS
    function onOrderUpdate(data) {
      toast.custom((t) => (
        <div className={`bg-[#0a1628] border border-brand-teal/20 text-white p-6 rounded-[2rem] shadow-4xl flex items-center gap-6 transform transition-all hover:scale-105 ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
           <div className="h-12 w-12 bg-brand-teal rounded-2xl flex items-center justify-center text-white"><Package size={20} /></div>
           <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-teal">District Sync Update</div>
              <div className="text-sm font-syne font-black mt-1">Order #{data?.orderId?.slice(-6) || "N/A"} is now: {data.status}.</div>
           </div>
        </div>
      ), { duration: 4000 });
    }

    function onDeliveryTelemetry(data) {
        if (data.status === 'delivered') {
          toast.success(`Protocol Successful: Order #${data?.orderId?.slice(-6) || "N/A"} reached destination!`, {
            icon: <ShieldCheck className="text-emerald-500" />,
            className: "rounded-3xl font-syne font-black text-sm uppercase tracking-widest"
          });
        }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('order:status-update', onOrderUpdate);
    socket.on('order:location-update', onDeliveryTelemetry);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('order:status-update', onOrderUpdate);
      socket.off('order:location-update', onDeliveryTelemetry);
      // Removed socket.disconnect() to prevent re-connection loops during state changes
    };
  }, [user?.id, user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
