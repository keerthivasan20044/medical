import { Link } from 'react-router-dom';
import { Home, ArrowLeft, ShieldAlert, Zap, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center text-center px-10 relative overflow-hidden">
      {/* Background Anomalies */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-[#028090] rounded-full blur-[160px] opacity-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 h-96 w-96 bg-[#02C39A] rounded-full blur-[140px] opacity-5" />
      
      {/* Glitch Logic */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 space-y-12"
      >
         <div className="space-y-4">
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="h-32 w-32 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto backdrop-blur-xl shadow-4xl mb-8"
            >
               <ShieldAlert size={60} className="text-[#02C39A]" />
            </motion.div>
            <div className="font-syne font-black text-[12rem] leading-none text-white/5 tracking-tighter absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">404</div>
            <h1 className="font-syne font-black text-6xl md:text-8xl text-white leading-none tracking-tighter relative z-10">
               Node Not <br />
               <span className="text-[#028090]">Synchronized.</span>
            </h1>
            <p className="font-dm text-white/30 text-xl italic max-w-lg mx-auto pt-6 leading-relaxed">The architecture you are attempting to access appears to be offline or relocated to a different district enclave.</p>
         </div>

         <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
            <Link
               to="/"
               className="h-20 px-12 bg-[#02C39A] text-[#0a1628] rounded-[2rem] font-syne font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#02C39A]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
            >
               <Home size={18} /> Restore Home Enclave
            </Link>
            <button
               onClick={() => window.history.back()}
               className="h-20 px-12 bg-white/5 border border-white/10 text-white rounded-[2rem] font-syne font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 group backdrop-blur-md"
            >
               <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" /> Previous Protocol
            </button>
         </div>

         <div className="pt-20 flex items-center justify-center gap-10">
            <div className="flex flex-col items-center gap-2">
               <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol ID</div>
               <div className="font-syne font-black text-white/40 text-xs">/ Section_MISSING_ERR_04</div>
            </div>
            <div className="h-10 w-px bg-white/5" />
            <div className="flex flex-col items-center gap-2">
               <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">District Pulse</div>
               <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-[#02C39A] rounded-full animate-ping" />
                  <div className="font-syne font-black text-white/40 text-xs tracking-widest uppercase">Live Enclave Sync</div>
               </div>
            </div>
         </div>
      </motion.div>
    </div>
  );
}

