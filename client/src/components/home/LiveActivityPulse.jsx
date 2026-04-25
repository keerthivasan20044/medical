import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity, MapPin, Zap, User, Package, ShieldCheck } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useLanguage } from '../../context/LanguageContext';

export default function LiveActivityPulse() {
  const { socket } = useSocket();
  const { t } = useLanguage();
  const [activities, setActivities] = useState([
    { id: 'init_1', type: 'system', message: 'App updated.', location: 'Karaikal HQ', timestamp: new Date() },
    { id: 'init_2', type: 'pharmacy', message: 'Apollo Pharmacy is now open.', location: 'Central Karaikal', timestamp: new Date() }
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleNewActivity = (data) => {
      const newActivity = {
        ...data,
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(data.timestamp || Date.now())
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 5));
    };

    socket.on('activity:new', handleNewActivity);
    return () => socket.off('activity:new', handleNewActivity);
  }, [socket]);

  const getIcon = (type) => {
    switch (type) {
      case 'order_placed': return <Package size={14} className="text-brand-teal" />;
      case 'order_update': return <Zap size={14} className="text-amber-500" />;
      case 'user_joined': return <User size={14} className="text-blue-500" />;
      case 'user_login': return <ShieldCheck size={14} className="text-emerald-500" />;
      default: return <Activity size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-y border-white/10 relative z-10">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
        <span className="text-teal-400 text-xs font-bold tracking-widest uppercase italic">{t('liveSync') || 'Live Updates'}</span>
      </div>
      <div className="flex-1 px-6 overflow-hidden">
        <AnimatePresence mode="popLayout">
           {activities.length > 0 && (
             <motion.div
               key={activities[0].id}
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -20, opacity: 0 }}
               className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate"
             >
                {activities[0].message.replace('_', ' ')}
             </motion.div>
           )}
        </AnimatePresence>
      </div>
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic shrink-0">{t('deliveryLabel') || 'Delivery'} {t('activeStatus') || 'Active'}</span>
    </div>
  );
}
