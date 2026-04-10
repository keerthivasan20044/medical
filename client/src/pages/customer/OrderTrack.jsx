import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck,
  CheckCircle,
  Home,
  MessageCircle,
  Package,
  Phone,
  Pill,
  Truck,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Navigation,
  MoreVertical,
  ChevronUp
} from 'lucide-react';
import { useOrderTracking } from '../../hooks/useOrderTracking.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

const STEPS = [
  { key: 'placed', label: 'Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: BadgeCheck },
  { key: 'preparing', label: 'Preparing', icon: CheckCircle },
  { key: 'on way', label: 'On Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home }
];

export default function OrderTrack() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { location, eta, statusText } = useOrderTracking(id || '');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['5', '8', '2', '1']);

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
      {/* Satellite Map Interface */}
      <div className="relative flex-1 min-h-[50vh] overflow-hidden">
        {/* Synthetic Map Grid */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #028090 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        {/* Pulsing Target Zone */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute left-[30%] top-[60%] h-40 w-40 bg-[#02C39A] rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"
        />

        {/* Route Path SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600">
           <motion.path 
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 2, ease: "easeInOut" }}
             d="M800,150 Q750,300 500,320 T200,500" 
             fill="none" 
             stroke="#028090" 
             strokeWidth="3" 
             strokeDasharray="10,10"
             className="opacity-40"
           />
           <motion.path 
             initial={{ pathLength: 0 }}
             animate={{ pathLength: 1 }}
             transition={{ duration: 2, ease: "easeInOut" }}
             d="M800,150 Q750,300 500,320 T200,500" 
             fill="none" 
             stroke="#02C39A" 
             strokeWidth="3" 
             className="opacity-20"
           />
        </svg>

        {/* Dynamic Nodes */}
        {/* User Node */}
        <div className="absolute left-[200px] top-[500px] -translate-x-1/2 -translate-y-1/2 text-center group">
           <div className="h-10 w-10 bg-[#0a1628] border-2 border-[#02C39A] rounded-2xl flex items-center justify-center text-[#02C39A] shadow-xl group-hover:scale-110 transition">
              <Home size={18} />
           </div>
           <div className="mt-2 text-[9px] font-black uppercase tracking-widest bg-[#0a1628] px-2 py-0.5 rounded-md border border-white/10">Destination Node</div>
        </div>

        {/* Pharmacy Node */}
        <div className="absolute left-[800px] top-[150px] -translate-x-1/2 -translate-y-1/2 text-center group">
           <div className="h-10 w-10 bg-[#0a1628] border-2 border-[#028090] rounded-2xl flex items-center justify-center text-[#028090] shadow-xl group-hover:scale-110 transition">
              <Pill size={18} />
           </div>
           <div className="mt-2 text-[9px] font-black uppercase tracking-widest bg-[#0a1628] px-2 py-0.5 rounded-md border border-white/10">Source Node</div>
        </div>

        {/* Agent Node (Moving) */}
        <motion.div 
          animate={{ x: [800, 500, 480], y: [150, 320, 340] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-center group z-30"
        >
           <div className="h-14 w-14 bg-white rounded-3xl flex items-center justify-center text-[#0a1628] shadow-2xl ring-8 ring-[#02C39A]/10 animate-bounce-slow">
              <Truck size={24} />
           </div>
           <div className="mt-2 text-[9px] font-black uppercase tracking-widest bg-white text-[#0a1628] px-3 py-1 rounded-full shadow-xl">Agent Moving</div>
        </motion.div>

        {/* Top Floating HUD */}
        <div className="absolute top-10 left-10 right-10 flex items-start justify-between z-40">
           <Link to="/orders" className="h-12 w-12 bg-[#0a1628] border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white hover:text-[#0a1628] transition shadow-2xl">
              <ArrowLeft size={20} />
           </Link>
           <div className="flex flex-col items-end gap-3">
              <div className="bg-[#0a1628]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-3 shadow-2xl flex items-center gap-6">
                 <div className="text-right">
                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-[.2em] mb-1">Estimated Arrival</div>
                    <div className="text-2xl font-syne font-black text-[#02C39A]">{eta || '8 min'}</div>
                 </div>
                 <div className="h-8 w-px bg-white/10" />
                 <div className="text-right">
                    <div className="text-[9px] text-white/40 font-bold uppercase tracking-[.2em] mb-1">Status Sync</div>
                    <div className="text-2xl font-syne font-black">{statusText || 'ON WAY'}</div>
                 </div>
              </div>
              <div className="bg-[#02C39A] text-[#0a1628] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                 <ShieldCheck size={14}/> Node Link Secured
              </div>
           </div>
        </div>
      </div>

      {/* Protocol Control Sheet */}
      <motion.div 
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        className="bg-white text-[#0a1628] rounded-t-[4rem] p-12 min-h-[40vh] shadow-4xl relative z-50 border-t border-gray-100"
      >
        <div className="absolute top-4 left-1/2 -translate-x-1/2 h-1.5 w-16 bg-gray-100 rounded-full" />
        
        <div className="max-w-5xl mx-auto space-y-10">
           {/* Order Header */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-gray-50">
              <div className="space-y-1">
                 <div className="text-[10px] font-black text-[#028090] uppercase tracking-widest">Protocol ID: {id}</div>
                 <h2 className="font-syne font-black text-4xl">Architecture Synchronization</h2>
                 <p className="text-gray-400 font-dm italic">Visualizing the logistics stream to your location enclave.</p>
              </div>
              <div className="flex -space-x-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="h-12 w-12 rounded-2xl border-4 border-white bg-gray-50 flex items-center justify-center font-black text-xs">RK</div>
                 ))}
                 <div className="h-12 w-12 rounded-2xl border-4 border-white bg-[#028090] text-white flex items-center justify-center font-black text-xs">+</div>
              </div>
           </div>

           {/* Stats Row */}
           <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white hover:shadow-xl transition duration-500">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#028090] shadow-sm"><Package size={20}/></div>
                 <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Cargo Node</div>
                    <div className="font-syne font-black">2x Medicine Node</div>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white hover:shadow-xl transition duration-500">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#02C39A] shadow-sm"><Navigation size={20}/></div>
                 <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Protocol Distance</div>
                    <div className="font-syne font-black">1.4 km remaining</div>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white hover:shadow-xl transition duration-500">
                 <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm"><ShieldCheck size={20}/></div>
                 <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Secure PIN</div>
                    <div className="font-syne font-black">*** {otp.join('')}</div>
                 </div>
              </div>
           </div>

           {/* Progress Protocol */}
           <div className="py-10">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="font-syne font-black text-xl uppercase tracking-tighter">Event Logs</h4>
                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" /> Live Pulse Sync
                 </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                 {STEPS.map((s, idx) => {
                    const Icon = s.icon;
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    return (
                       <div key={s.key} className={`space-y-4 text-center ${idx === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                          <div className={`h-16 rounded-3xl flex items-center justify-center relative transition duration-700 ${
                             isDone ? 'bg-[#02C39A] text-white shadow-lg shadow-[#02C39A]/20' : 
                             isCurrent ? 'bg-[#0a1628] text-white animate-pulse' : 
                             'bg-gray-100 text-gray-300'
                          }`}>
                             <Icon size={24} />
                             {idx < STEPS.length - 1 && (
                                <div className={`hidden md:block absolute left-full top-1/2 -translate-y-1/2 w-full h-[2px] z-[-1] ${isDone ? 'bg-[#02C39A]' : 'bg-gray-100'}`} />
                             )}
                          </div>
                          <div className={`text-[10px] font-black uppercase tracking-widest ${isDone || isCurrent ? 'text-[#0a1628]' : 'text-gray-300'}`}>
                             {s.label}
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}


