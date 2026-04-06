import { motion } from 'framer-motion';
import { 
  MapPin, Store, Truck, Navigation, 
  Satellite, Search, ShieldCheck, 
  ArrowRight, Compass, Maximize2, X 
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * High-fidelity district-wide enclave map.
 */
// District Bounding Matrix Sync
const BOUNDS = {
  lat: [10.81, 10.94], // Karaikal district N/S bounds
  lng: [79.82, 79.85]  // Karaikal district E/W bounds
};

const projectNode = (gps) => {
  if (!gps || !gps.lat || !gps.lng) return { top: '50%', left: '50%' };
  const top = (1 - (gps.lat - BOUNDS.lat[0]) / (BOUNDS.lat[1] - BOUNDS.lat[0])) * 100;
  const left = ((gps.lng - BOUNDS.lng[0]) / (BOUNDS.lng[1] - BOUNDS.lng[0])) * 100;
  return { top: `${Math.max(10, Math.min(90, top))}%`, left: `${Math.max(10, Math.min(90, left))}%` };
};

export function KaraikalMap({ pharmacies = [], showPins = true }) {
  return (
    <div data-animate="fade-up" className="h-[700px] w-full bg-[#0a1628] rounded-[4rem] md:rounded-[6rem] overflow-hidden relative shadow-4xl group transition-all duration-[3000ms] border-2 border-white/5 mx-auto">
       <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center grayscale opacity-20 filter contrast-125 saturate-50 group-hover:scale-110 transition duration-[20s]" />
       <div className="absolute inset-0 bg-grid opacity-10" />
       <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-60" />
       
       <div className="absolute top-12 left-12 flex flex-col gap-6 z-20">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 space-y-4 shadow-3xl">
             <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-[0.4em] flex items-center gap-4 animate-pulse"><Satellite size={14} /> District Satellite Active</div>
             <div className="space-y-1">
                <h3 className="font-syne font-black text-3xl text-white tracking-tighter">Karaikal <span className="text-white/20">Enclave</span></h3>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] italic">Telemetry Version 0.2.2</p>
             </div>
             <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="flex -space-x-3">
                   {[...Array(4)].map((_, i) => <div key={i} className="h-10 w-10 bg-white/10 rounded-2xl border-2 border-[#0a1628] flex items-center justify-center text-[11px] font-black text-white/60 shadow-xl">{i+1}</div>)}
                </div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">+12 Clinical Nodes <br/>Pulse Online</div>
             </div>
          </div>
          <div className="flex gap-4">
             <button title="Full Enclave" className="h-16 w-16 bg-white/5 hover:bg-white/10 text-white rounded-3xl flex items-center justify-center backdrop-blur-xl transition shadow-2xl border border-white/10"><Maximize2 size={24}/></button>
             <button title="Orient GPS" className="h-16 w-16 bg-white/5 hover:bg-white/10 text-white rounded-3xl flex items-center justify-center backdrop-blur-xl transition shadow-2xl border border-white/10"><Compass size={24}/></button>
          </div>
       </div>

       {showPins && pharmacies.map((p, i) => {
         const pos = projectNode(p.gps);
         return (
           <motion.div 
             key={p.id}
             initial={{ opacity: 0, scale: 0 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 1 + (i * 0.15), duration: 1, type: 'spring' }}
             className="absolute z-20"
             style={{ top: pos.top, left: pos.left }}
           >
              <div className="relative group/pin cursor-pointer">
                 <div className="absolute -inset-10 bg-[#02C39A] rounded-full blur-3xl opacity-0 group-hover/pin:opacity-40 transition-all duration-700 animate-pulse-ring" />
                 <Link to={`/pharmacies/${p.id}`} className="h-16 w-16 bg-white text-[#0a1628] rounded-[2rem] flex items-center justify-center shadow-4xl relative z-10 hover:bg-[#02C39A] hover:text-white transition-all duration-700 group-hover/pin:scale-125 group-hover/pin:-translate-y-4">
                    <MapPin size={28} />
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-[#0a1628] border-2 border-white rounded-full flex items-center justify-center text-[8px] font-black text-[#02C39A]">{i+1}</div>
                 </Link>
                 <div className="absolute top-1/2 left-24 -translate-y-1/2 opacity-0 group-hover/pin:opacity-100 transition duration-700 pointer-events-none scale-75 group-hover/pin:scale-100 origin-left">
                    <div className="bg-[#0a1628] border border-white/10 p-8 rounded-[3.5rem] shadow-4xl text-white space-y-3 backdrop-blur-3xl min-w-[280px]">
                       <div className="flex items-center justify-between">
                          <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-widest">{p.distance || '0.2'} Enclave Dist</div>
                          <ShieldCheck size={14} className="text-[#02C39A]" />
                       </div>
                       <div className="space-y-1">
                          <div className="font-syne font-black text-xl uppercase tracking-tighter leading-none">{p.name}</div>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest italic truncate">{p.location}</p>
                       </div>
                       <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                          <div className={`h-2 w-2 rounded-full ${p.status === 'OPEN' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`} />
                          <div className="text-[10px] font-black uppercase tracking-widest text-white/60">{p.status || 'Verified'}</div>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
         );
       })}

       <div className="absolute bottom-10 right-10 flex items-center gap-6 z-20">
          <div className="bg-white/95 backdrop-blur-md px-10 py-5 rounded-full shadow-2xl flex items-center gap-6 border border-white">
             <div className="h-3 w-3 bg-[#02C39A] rounded-full animate-pulse-ring shadow-mint" />
             <div className="space-y-1">
                <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none">Scanning Protocol</div>
                <div className="text-[10px] font-syne font-black text-[#0a1628] uppercase tracking-widest">Active Medical Enclave Range</div>
             </div>
          </div>
          <button className="px-12 py-5 bg-[#0a1628] text-[#02C39A] rounded-full font-syne font-black text-xs uppercase tracking-widest flex items-center gap-4 hover:bg-[#02C39A] hover:text-white transition shadow-4xl">
             Relocate Search Node <ArrowRight size={18} />
          </button>
       </div>
    </div>
  );
}

/**
 * Animated real-time navigation architecture.
 */
export function LiveTrackMap({ order, liveLocation = { lat: 0, lng: 0 } }) {
  return (
    <div className="h-[500px] w-full bg-gray-50 rounded-[4rem] overflow-hidden relative border border-gray-100 shadow-inner group">
       <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center grayscale contrast-75 brightness-110 opacity-30" />
       <div className="absolute inset-0 bg-blue-500/5" />
       
       {/* Delivery Trace Area */}
       <div className="absolute top-1/2 left-1/4 right-1/4 h-2 bg-gray-100 rounded-full border border-gray-200 shadow-inner -translate-y-1/2" />
       
       <motion.div 
         animate={{ x: ['10%', '60%'] }} 
         transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
         className="absolute top-1/2 -translate-y-1/2 left-0 z-20"
       >
          <div className="relative group/rider">
             <div className="absolute -inset-8 bg-[#028090] rounded-full blur-2xl opacity-40 animate-pulse" />
             <div className="h-20 w-20 bg-[#0a1628] text-white rounded-[2rem] flex items-center justify-center shadow-4xl relative z-10 border-4 border-white animate-bounce-slow">
                <Truck size={32} className="text-[#02C39A]" />
             </div>
             <div className="absolute -top-24 left-1/2 -translate-x-1/2 px-10 py-5 bg-white border border-gray-100 rounded-3xl shadow-4xl space-y-1 whitespace-nowrap group-hover/rider:scale-110 transition duration-500">
                <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest text-center">Rider Enclave</div>
                <div className="font-syne font-black text-[#0a1628] uppercase text-sm">Rajan Kumar <span className="text-[#02C39A] ml-2">12 MIN</span></div>
             </div>
          </div>
       </motion.div>

       <div className="absolute top-1/2 -translate-y-1/2 right-[25%] h-14 w-14 bg-white border-2 border-dashed border-[#028090] rounded-2xl flex items-center justify-center text-[#028090] z-10 shadow-2xl">
          <Store size={26} />
       </div>
       <div className="absolute top-1/2 -translate-y-1/2 left-[25%] h-14 w-14 bg-white border-4 border-[#0a1628] rounded-2xl flex items-center justify-center text-[#0a1628] z-10 shadow-2xl">
          <MapPin size={26} />
       </div>
       
       <div className="absolute top-10 right-10 flex flex-col items-end gap-3 z-30">
          <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border border-white flex items-center gap-4 group cursor-pointer hover:bg-white transition duration-500">
             <div className="h-4 w-4 bg-[#028090] rounded-full flex items-center justify-center text-white"><X size={10} /></div>
             <div className="text-[10px] font-black uppercase tracking-widest text-[#0a1628]">Order #MED-0042 Enclave</div>
          </div>
       </div>

       <div className="absolute bottom-10 left-10 flex-col gap-2 z-30">
          <h4 className="font-syne font-black text-white mix-blend-difference text-3xl opacity-20 uppercase selection:bg-emerald-500">Node Tracker Enclave</h4>
       </div>
    </div>
  );
}

/**
 * Single node location enclave.
 */
export function PharmacyLocatorMap({ pharmacyId }) {
  return (
    <div className="h-[400px] w-full bg-gray-50 rounded-[3.5rem] overflow-hidden relative shadow-inner border border-gray-100 group">
       <div className="absolute inset-0 bg-[url('/assets/hospital_pro.png')] bg-cover bg-center grayscale opacity-10 group-hover:scale-105 transition duration-[5s]" />
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
          <div className="relative">
             <div className="absolute -inset-10 bg-[#02C39A] rounded-full blur-3xl opacity-20 animate-pulse" />
             <div className="h-20 w-20 bg-[#0a1628] text-[#02C39A] rounded-[2.5rem] flex items-center justify-center shadow-4xl relative z-10 border-4 border-white"><MapPin size={32} /></div>
          </div>
          <div className="bg-white/95 backdrop-blur-md px-10 py-4 rounded-full shadow-2xl border border-gray-100 text-center space-y-1">
             <div className="font-syne font-black text-[#0a1628] text-lg uppercase tracking-widest italic">Apollo Pharmacy Enclave</div>
             <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">10.9254° N, 79.8380° E Protocol</div>
          </div>
       </div>
       <button className="absolute bottom-10 right-10 h-16 w-16 bg-white text-[#0a1628] rounded-2xl flex items-center justify-center shadow-4xl hover:bg-[#0a1628] hover:text-[#02C39A] transition border border-gray-100"><Navigation size={28} /></button>
    </div>
  );
}
