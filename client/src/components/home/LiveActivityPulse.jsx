import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Activity, MapPin, Zap, User, Package, ShieldCheck } from 'lucide-react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function LiveActivityPulse() {
  const { socket } = useSocket();
  const { t } = useLanguage();
  const [activities, setActivities] = useState([
    { id: 'init_1', type: 'system', message: 'District Architecture Synchronized.', location: 'Karaikal Command', timestamp: new Date() },
    { id: 'init_2', type: 'node', message: 'Terminal Node Apollo_Central online.', location: 'Central Karaikal', timestamp: new Date() }
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
    <div className="bg-[#0a1628] border-b border-white/5 py-4 overflow-hidden relative group">
      <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-10 flex items-center gap-12">
        <div className="flex items-center gap-4 shrink-0 bg-white/5 px-6 py-2 rounded-xl border border-white/10 shadow-2xl">
           <div className="h-3 w-3 bg-brand-teal rounded-full animate-ping" />
           <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Live_Pulse</span>
        </div>

        <div className="flex-1 relative h-6 overflow-hidden">
           <AnimatePresence mode="popLayout">
              {activities.length > 0 && (
                <motion.div
                  key={activities[0].id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="flex items-center gap-8"
                >
                   <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                         {getIcon(activities[0].type)}
                      </div>
                      <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic truncate max-w-[400px]">
                         {activities[0].message}
                      </span>
                   </div>

                   <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-8">
                      <MapPin size={12} className="text-brand-teal" />
                      <span className="text-[9px] font-black text-brand-teal uppercase tracking-[0.2em] italic">
                         {activities[0].location || 'District_Node'}
                      </span>
                   </div>

                   <div className="hidden lg:block ml-auto text-[8px] font-black text-white/20 uppercase tracking-[0.3em] font-mono italic">
                      SYNC_TIME: {activities[0].timestamp.toLocaleTimeString([], { hour12: false })}
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-6 shrink-0 border-l border-white/10 pl-12 overflow-hidden">
           <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-8 w-8 rounded-lg border-2 border-[#0a1628] bg-white/5 flex items-center justify-center text-[8px] font-black text-white/50 shadow-2xl">0{i}</div>
              ))}
           </div>
           <span className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">Node_Sync_Active</span>
        </div>
      </div>
    </div>
  );
}
