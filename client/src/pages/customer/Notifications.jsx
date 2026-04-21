import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Package, ShieldCheck, Tag, Info, 
  Trash2, CheckCircle, Clock, ArrowRight,
  MoreVertical, Calendar, Zap, Activity, Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_NOTIFS = [
  { id: 1, type: 'order', title: 'Payload Dispatched', desc: 'Your medical enclave sync #5821 is currently in transit to Karaikal Node.', status: 'Active', time: '10:30 AM', date: 'Today', icon: Truck, bg: 'bg-brand-teal/10 text-brand-teal', read: false },
  { id: 2, type: 'system', title: 'Clinical Pulse Synchronized', desc: 'Account verification completed for secure procurement protocols.', status: 'System', time: '09:15 AM', date: 'Today', icon: Activity, bg: 'bg-blue-50 text-blue-500', read: false },
  { id: 3, type: 'prescription', title: 'Clinical Manifest Verified', desc: 'Your uploaded prescription for Novamox has been approved by the pharmacist enclave.', status: 'Medical', time: 'Yesterday', date: 'Yesterday', icon: ShieldCheck, bg: 'bg-emerald-50 text-emerald-500', read: true },
  { id: 4, type: 'offer', title: 'Matrix Promo Activated', desc: 'Get 20% off on all Wellness nodes using protocol code ME20.', status: 'Offer', time: '2 days ago', date: 'Earlier', icon: Tag, bg: 'bg-purple-50 text-purple-500', read: true }
];



export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [activeFilter, setActiveFilter] = useState('All');

  const groupedNotifs = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Earlier: [] };
    notifs.forEach(n => {
      if (groups[n.date]) groups[n.date].push(n);
      else groups.Earlier.push(n);
    });
    return groups;
  }, [notifs]);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotif = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32 pt-8 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
         <div className="space-y-4">
            <div className="px-5 py-2 bg-[#0a1628] rounded-xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
               <Bell size={14} className="animate-shake" /> Transmission Stream
            </div>
            <h1 className="font-syne font-black text-5xl md:text-7xl text-[#0a1628] uppercase italic leading-none tracking-tighter">
               Terminal <span className="text-brand-teal">Alerts</span>
            </h1>
         </div>
         
         <div className="flex gap-4">
            <button 
               onClick={markAllRead}
               className="h-16 px-8 bg-white border border-black/[0.03] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl hover:bg-[#0a1628] hover:text-brand-teal transition-all shadow-soft"
            >
               Reset Hub
            </button>
            <button className="h-16 w-16 bg-[#0a1628] rounded-2xl flex items-center justify-center text-brand-teal shadow-4xl active:scale-95 transition-all"><MoreVertical size={24}/></button>
         </div>
      </div>

      {/* Main List */}
      <div className="space-y-16">
         {Object.entries(groupedNotifs).map(([date, items]) => items.length > 0 && (
            <div key={date} className="space-y-8">
               <div className="flex items-center gap-6">
                  <div className="h-px flex-1 bg-black/[0.03]" />
                  <h3 className="font-syne font-black text-xs text-gray-300 uppercase italic tracking-[0.4em] whitespace-nowrap">{date} Matrix</h3>
                  <div className="h-px flex-1 bg-black/[0.03]" />
               </div>

               <div className="grid gap-6">
                  <AnimatePresence mode="popLayout">
                     {items.map((n, idx) => (
                        <motion.div
                           layout
                           key={n.id}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ delay: idx * 0.05 }}
                           className={`bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center shadow-soft hover:shadow-4xl transition-all duration-700 relative overflow-hidden group ${!n.read ? 'border-l-[12px] border-brand-teal' : 'border-l-[12px] border-gray-100'}`}
                        >
                           <div className={`h-16 w-16 rounded-3xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-700 group-hover:scale-110 ${n.bg}`}>
                              <n.icon size={28} />
                           </div>

                           <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-[#0a1628]">{n.status} Protocol</span>
                                 <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">{n.time}</span>
                              </div>
                              <h4 className={`font-syne font-black text-xl md:text-2xl uppercase italic tracking-tighter transition ${!n.read ? 'text-[#0a1628]' : 'text-gray-400'}`}>{n.title}</h4>
                              <p className="text-gray-400 font-dm italic text-base font-bold leading-relaxed">{n.desc}</p>
                           </div>

                           <div className="flex gap-4 w-full md:w-auto">
                              <button className="flex-1 md:flex-none h-14 px-8 bg-gray-50 text-[#0a1628] font-syne font-black text-[9px] uppercase italic tracking-widest rounded-xl hover:bg-[#0a1628] hover:text-white transition-all">View</button>
                              <button 
                                 onClick={() => deleteNotif(n.id)}
                                 className="h-14 w-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              >
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>
         ))}

         {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-12">
               <div className="relative">
                  <div className="h-48 w-48 bg-gray-50 rounded-[4rem] flex items-center justify-center text-gray-100 shadow-inner">
                     <Bell size={96} />
                  </div>
                  <div className="absolute -bottom-6 -right-6 h-20 w-20 bg-white shadow-4xl rounded-3xl flex items-center justify-center text-brand-teal border border-black/[0.03] animate-pulse">
                     <CheckCircle size={32} />
                  </div>
               </div>
               <div className="text-center space-y-4">
                  <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">Null Stream Activity</h3>
                  <p className="text-gray-400 font-dm italic text-lg font-bold max-w-sm mx-auto">Your clinical transmission hub is currently synchronized and silent.</p>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
