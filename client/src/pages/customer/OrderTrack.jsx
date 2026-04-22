import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck, CheckCircle, Home, MessageCircle, Package, 
  Phone, Pill, Truck, ArrowLeft, ShieldCheck, Clock, 
  Navigation, MoreVertical, ChevronUp, Star, Map as MapIcon, Activity
} from 'lucide-react';
import { useOrderTracking } from '../../hooks/useOrderTracking.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const STEPS = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: BadgeCheck },
  { key: 'preparing', label: 'Preparing', icon: Pill },
  { key: 'on way', label: 'On Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home }
];

export default function TrackingPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { location: realLocation, eta, statusText } = useOrderTracking(id || '');
  const [simCoords, setSimCoords] = useState({ x: 800, y: 150 });

  useEffect(() => {
    // Simulating movement for demo
    const interval = setInterval(() => {
      setSimCoords(prev => {
         const targetX = 200;
         const targetY = 500;
         const dx = (targetX - prev.x) * 0.05;
         const dy = (targetY - prev.y) * 0.05;
         if (Math.abs(targetX - prev.x) < 5) return prev;
         return { x: prev.x + dx, y: prev.y + dy };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentStep = useMemo(() => {
    const normalized = (statusText || '').toLowerCase();
    if (normalized.includes('deliver')) return 4;
    if (normalized.includes('on way') || normalized.includes('dispatch')) return 3;
    if (normalized.includes('prepare')) return 2;
    if (normalized.includes('confirm')) return 1;
    return 0;
  }, [statusText]);

  return (
    <div className="min-h-screen bg-[#0a1628] text-white overflow-hidden flex flex-col">
      
      {/* Full-width Satellite Map Interface */}
      <section className="relative h-[45vh] md:h-[65vh] w-full overflow-hidden shrink-0">
        {/* Synthetic Map Grid */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #028090 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* Pulsing Target Zone */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute left-[200px] top-[500px] h-40 w-40 bg-[#02C39A] rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"
        />

        {/* Route Path SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 1000 600">
           <path d="M800,150 Q750,300 500,320 T200,500" fill="none" stroke="#028090" strokeWidth="3" strokeDasharray="12,12" />
        </svg>

        {/* Dynamic Nodes */}
  <div className="absolute left-[200px] top-[500px] -translate-x-1/2 -translate-y-1/2 text-center z-20">
     <div className="h-10 w-10 bg-[#0a1628] border-2 border-[#02C39A] rounded-2xl flex items-center justify-center text-[#02C39A] shadow-xl"><Home size={18} /></div>
     <div className="mt-2 text-[8px] font-black uppercase tracking-widest bg-[#0a1628] px-2 py-0.5 rounded-md border border-white/10">Delivery Address</div>
  </div>

  <div className="absolute left-[800px] top-[150px] -translate-x-1/2 -translate-y-1/2 text-center z-20">
     <div className="h-10 w-10 bg-[#0a1628] border-2 border-[#028090] rounded-2xl flex items-center justify-center text-[#028090] shadow-xl"><Pill size={18} /></div>
     <div className="mt-2 text-[8px] font-black uppercase tracking-widest bg-[#0a1628] px-2 py-0.5 rounded-md border border-white/10">Pharmacy</div>
  </div>

        {/* Driver Agent Node */}
        <motion.div 
          animate={{ x: simCoords.x, y: simCoords.y }}
          transition={{ duration: 1.1, ease: "linear" }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-center z-30 group"
        >
           <div className="h-16 w-16 bg-white rounded-3xl flex items-center justify-center text-[#0a1628] shadow-2xl ring-8 ring-[#02C39A]/10 animate-bounce-slow">
              <Truck size={28} />
           </div>
           <div className="mt-4 px-4 py-1.5 bg-white text-[#0a1628] font-syne font-black text-[9px] uppercase tracking-widest rounded-full shadow-2xl">Tracking Active</div>
        </motion.div>

        {/* Floating Controls */}
        <div className="absolute top-10 left-10 z-40">
           <Link to="/orders" className="h-12 w-12 bg-[#0a1628] border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-[#0a1628] transition shadow-2xl">
              <ArrowLeft size={20} />
           </Link>
        </div>
      </section>

      {/* Live Status Card */}
      <motion.section 
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="bg-white text-[#0a1628] rounded-t-[3rem] flex-1 p-6 md:p-16 relative z-50 shadow-4xl border-t border-gray-100 mt-[-2rem]"
      >
         <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Live Driver Header */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-b border-gray-50 pb-8">
               <div className="flex items-center gap-4 md:gap-8">
                  <div className="relative shrink-0">
                     <div className="h-16 w-16 md:h-24 md:w-24 bg-gray-100 rounded-2xl md:rounded-[2.5rem] overflow-hidden border-2 md:border-4 border-white shadow-xl">
                        <img src="https://ui-avatars.com/api/?name=Rakesh+Kumar&background=028090&color=fff" className="h-full w-full object-cover" />
                     </div>
                     <div className="absolute -bottom-1 -right-1 h-6 w-6 md:h-8 md:w-8 bg-emerald-500 border-2 md:border-4 border-white rounded-full flex items-center justify-center text-white"><CheckCircle size={12}/></div>
                  </div>
                  <div className="space-y-1 min-w-0">
                     <div className="text-[8px] md:text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] italic">Delivery Partner</div>
                     <h2 className="font-syne font-black text-xl md:text-4xl italic uppercase leading-tight truncate">Rakesh Kumar</h2>
                     <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex text-amber-500 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                        <span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic truncate">PY-01-AX-4829</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                  <div className="text-left md:text-right">
                     <div className="text-[8px] md:text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em] mb-1 leading-none">Arrival</div>
                     <div className="font-syne font-black text-3xl md:text-5xl text-brand-teal italic tracking-tighter">{eta || '8 min'}</div>
                  </div>
                  <div className="hidden md:block h-12 w-px bg-gray-100 mx-2" />
                  <div className="flex gap-2">
                     <a href="tel:9876543210" className="h-12 w-12 md:h-20 md:w-20 bg-[#0a1628] rounded-xl md:rounded-[2rem] flex items-center justify-center text-brand-teal shadow-4xl hover:bg-brand-teal hover:text-white transition-all scale-animation">
                        <Phone size={20} />
                     </a>
                     <button className="h-12 w-12 md:h-20 md:w-20 bg-gray-50 border border-gray-100 rounded-xl md:rounded-[2rem] flex items-center justify-center text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all">
                        <MessageCircle size={20} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Real-time Status Progress */}
            <div className="space-y-10">
               <div className="flex items-center justify-between">
                  <h4 className="font-syne font-black text-xl uppercase italic tracking-tighter">Order History</h4>
                  <div className="flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase italic tracking-widest leading-none">
                     <Activity size={14} className="animate-pulse" /> Live Updates
                  </div>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {STEPS.map((s, idx) => {
                     const Icon = s.icon;
                     const isDone = idx < currentStep;
                     const isCurrent = idx === currentStep;
                     return (
                        <div key={s.key} className="space-y-4">
                           <div className={`h-16 rounded-[1.8rem] flex items-center justify-center relative transition duration-700 ${
                              isDone ? 'bg-[#02C39A] text-white shadow-xl shadow-[#02C39A]/20' : 
                              isCurrent ? 'bg-[#0a1628] text-brand-teal animate-pulse shadow-4xl' : 
                              'bg-gray-100 text-gray-300'
                           }`}>
                              <Icon size={24} />
                              {idx < STEPS.length - 1 && (
                                 <div className={`hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-full h-1 z-[-1] ${isDone ? 'bg-[#02C39A]' : 'bg-gray-100'}`} />
                              )}
                           </div>
                           <div className={`text-[9px] font-black uppercase text-center tracking-widest ${isDone || isCurrent ? 'text-[#0a1628]' : 'text-gray-300'}`}>
                              {s.label}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

            <div className="p-6 md:p-10 bg-gray-50 rounded-[2rem] md:rounded-[3rem] border border-black/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 group overflow-hidden relative">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-0 group-hover:opacity-5 rounded-full blur-[80px] transition-opacity" />
               <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-brand-teal shadow-soft shrink-0"><ShieldCheck size={28}/></div>
                  <div className="space-y-0.5">
                     <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Delivery OTP</div>
                     <div className="font-syne font-black text-lg md:text-2xl text-[#0a1628] uppercase italic leading-none">Code: 5821</div>
                  </div>
               </div>
               <div className="w-full md:w-auto flex md:flex-col justify-between items-center md:items-end gap-2">
                  <div className="hidden md:block text-[10px] font-black text-gray-300 uppercase tracking-widest italic mb-2">Actions</div>
                  <button className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-[#0a1628] text-brand-teal rounded-xl font-syne font-black text-[9px] uppercase italic tracking-[0.3em] shadow-4xl">Cancel</button>
               </div>
            </div>

         </div>
      </motion.section>
    </div>
  );
}
