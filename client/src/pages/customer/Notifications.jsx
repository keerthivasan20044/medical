import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../store/notificationsSlice.js';
import { 
  Bell, Package, Truck, Heart, Tag, Settings, 
  Trash2, CheckCircle, Clock, AlertCircle, 
  Store, Video, ArrowRight, X, User, BellOff, 
  Layout, ShieldCheck, ChevronRight, Activity, Zap, MapPin, XCircle, Gift
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Notifications() {
  const dispatch = useDispatch();
  const { items: notifs, status } = useSelector(s => s.notifications);
  const [activeTab, setActiveTab] = useState('All');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
     if (status === 'idle') dispatch(fetchNotifications());
  }, [status, dispatch]);

  const getIcon = (type) => {
     switch(type) {
        case 'order': return { icon: Package, color: 'text-blue-600 bg-blue-50' };
        case 'prescription': return { icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' };
        case 'success': return { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' };
        case 'status': return { icon: Zap, color: 'text-brand-teal bg-brand-teal/10' };
        case 'proximity': return { icon: MapPin, color: 'text-orange-600 bg-orange-50' };
        case 'assignment': return { icon: Truck, color: 'text-blue-600 bg-blue-50' };
        case 'stock': return { icon: Activity, color: 'text-red-600 bg-red-50' };
        case 'error': return { icon: XCircle, color: 'text-red-600 bg-red-50' };
        default: return { icon: Bell, color: 'text-gray-600 bg-gray-50' };
     }
  };

  const filteredNotifs = useMemo(() => {
    if (activeTab === 'All') return notifs;
    return notifs.filter(n => n.type === activeTab.toLowerCase());
  }, [activeTab, notifs]);

  const groupedNotifs = useMemo(() => {
    return filteredNotifs.reduce((acc, n) => {
      const date = n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase() : 'TODAY';
      if (!acc[date]) acc[date] = [];
      acc[date].push(n);
      return acc;
    }, {});
  }, [filteredNotifs]);

  const handleDelete = (id) => {
    dispatch(markNotificationRead(id));
    toast.success('Notification archived');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-10 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-gray-50">
        <div className="space-y-4">
           <div className="h-20 w-20 rounded-[2rem] bg-[#0a1628] text-white flex items-center justify-center shadow-3xl shadow-[#0a1628]/20 relative group">
              <Bell size={32} className="group-hover:rotate-12 transition duration-500" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-[#02C39A] rounded-full border-4 border-white" />
           </div>
           <div>
             <h1 className="font-syne font-black text-5xl text-[#0a1628]">Notifications</h1>
             <p className="text-gray-400 mt-1 font-dm italic">Your real-time healthcare architecture stream in Karaikal.</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={() => setShowSettings(!showSettings)} className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${showSettings ? 'bg-[#0a1628] text-white' : 'bg-gray-50 text-gray-400 hover:bg-white border border-gray-100'}`}><Settings size={20} /></button>
           <button onClick={() => setNotifs([])} className="h-14 px-8 bg-white border border-red-50 text-red-500 font-syne font-bold text-xs uppercase tracking-widest hover:bg-red-50 transition rounded-2xl mb-auto">Clear All</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
         {/* Main List */}
         <div className="space-y-12">
            {/* Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
               {['All', 'Orders', 'Delivery', 'Health', 'Offers', 'System'].map(t => (
                 <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === t ? 'bg-[#0a1628] text-white shadow-xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                 >
                    {t}
                 </button>
               ))}
            </div>

            <div className="space-y-16">
               {Object.entries(groupedNotifs).length > 0 ? (
                 Object.entries(groupedNotifs).map(([date, items]) => (
                    <div key={date} className="space-y-8">
                       <h3 className="font-syne font-black text-xs text-gray-400 uppercase tracking-[0.3em] pl-2 border-l-4 border-gray-100">{date}</h3>
                       <div className="space-y-6">
                          <AnimatePresence mode="popLayout">
                             {items.map((n, idx) => (
                                <motion.div
                                   layout
                                   key={n._id || n.id}
                                   initial={{ opacity: 0, x: -20 }}
                                   animate={{ opacity: 1, x: 0 }}
                                   exit={{ opacity: 0, scale: 0.95 }}
                                   transition={{ delay: idx * 0.05 }}
                                   className={`bg-white border border-gray-50 p-8 rounded-[3.5rem] flex items-start gap-8 hover:shadow-3xl hover:border-brand-teal/20 transition-all group overflow-hidden relative ${!n.isRead ? 'border-l-8 border-l-brand-teal' : ''}`}
                                >
                                   <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-lg ${getIcon(n.type).color}`}>
                                      {(() => {
                                        const VisualNode = getIcon(n.type).icon;
                                        return <VisualNode size={26} />;
                                      })()}
                                   </div>
                                   <div className="grow space-y-2">
                                      <div className="flex items-center justify-between">
                                         <h4 className="font-syne font-black text-xl text-[#0a1628] group-hover:text-brand-teal transition">{n.title}</h4>
                                         <div className="flex flex-col items-end">
                                            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{n.time || 'JUST NOW'}</span>
                                            <span className="text-[8px] font-black text-brand-teal uppercase mt-1 opacity-0 group-hover:opacity-100 transition">{n.type} ALERT</span>
                                         </div>
                                      </div>
                                      <p className="text-gray-400 font-dm italic leading-relaxed text-sm">{n.message || n.body}</p>
                                      <div className="pt-6 flex gap-6">
                                         <button className="text-[10px] font-black text-[#0a1628] border-b-2 border-gray-100 hover:border-brand-teal transition uppercase tracking-widest flex items-center gap-2 group/btn">
                                            View Detail <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition" />
                                         </button>
                                         <button onClick={() => handleDelete(n._id || n.id)} className="text-[10px] font-black text-red-400 hover:text-red-500 transition uppercase tracking-widest">Archive</button>
                                      </div>
                                   </div>
                                </motion.div>
                             ))}
                          </AnimatePresence>
                       </div>
                    </div>
                 ))
               ) : (
                 <div className="py-24 text-center space-y-8 bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-100">
                    <div className="h-32 w-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-300 opacity-50 shadow-inner">
                       <BellOff size={64} />
                    </div>
                    <div>
                       <h3 className="font-syne font-black text-3xl text-[#0a1628]">All clear!</h3>
                       <p className="text-gray-400 text-lg font-dm max-w-xs mx-auto italic mt-2">Your medical architecture stream is currently empty. We'll alert you for new updates.</p>
                    </div>
                 </div>
               )}
            </div>
         </div>

         {/* Sidebar / Settings Toggle */}
         <div className="space-y-12 sticky top-32">
            <div className="bg-[#0a1628] text-white p-12 rounded-[4rem] shadow-3xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 h-48 w-48 bg-[#028090] rounded-full blur-[100px] opacity-20" />
               <h3 className="font-syne font-black text-2xl mb-10 flex items-center gap-4 relative z-10 text-[#02C39A]">
                  <Settings size={22} /> Preferences
               </h3>
               
               <div className="space-y-10 relative z-10">
                  {[
                     { label: 'Orders', icon: Package },
                     { label: 'Delivery', icon: Truck },
                     { label: 'Health', icon: Heart },
                     { label: 'Offers', icon: Tag },
                     { label: 'System', icon: Bell }
                  ].map(s => (
                     <div key={s.label} className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 bg-white/5 rounded-2xl flex items-center justify-center text-white/40"><s.icon size={18} /></div>
                           <span className="text-sm font-syne font-black uppercase tracking-widest">{s.label}</span>
                        </div>
                        <div className="h-7 w-12 bg-white/10 rounded-full p-1 border border-white/10 relative cursor-pointer ring-1 ring-white/10 group-hover:border-[#02C39A]/40 transition">
                           <motion.div animate={{ x: 20 }} className="h-5 w-5 bg-[#02C39A] rounded-full shadow-lg shadow-[#02C39A]/30" />
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-12 pt-8 border-t border-white/5 text-center relative z-10">
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Synced to Architecture</div>
               </div>
            </div>

            <div className="p-12 bg-[#028090]/5 border border-[#028090]/10 rounded-[4rem] space-y-8 shadow-sm">
               <h4 className="font-syne font-black text-xl text-[#0a1628]">Quick Actions</h4>
               <div className="space-y-4">
                  {[
                     { label: 'View Active Orders', icon: Package, color: 'orange' },
                     { label: 'Join Consultation', icon: Video, color: 'blue' }
                  ].map(btn => (
                     <button key={btn.label} className="w-full flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-gray-50 hover:border-[#028090] hover:shadow-2xl transition-all group overflow-hidden relative">
                        <div className="flex items-center gap-5 relative z-10">
                           <div className={`h-12 w-12 rounded-2xl bg-${btn.color}-50 text-${btn.color}-600 flex items-center justify-center group-hover:bg-[#028090] group-hover:text-white transition-all`}>
                              <btn.icon size={20} />
                           </div>
                           <span className="text-xs font-black text-[#0a1628] uppercase tracking-widest">{btn.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#028090] translate-x-0 group-hover:translate-x-2 transition relative z-10" />
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
