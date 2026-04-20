import { useState } from 'react';
import { MapPin, Star, Navigation, Clock, Activity, ShieldCheck, ChevronRight, X, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { normalizeUrl } from '../../utils/url';

export default function KaraikalMap({ pharmacies }) {
  const [activePin, setActivePin] = useState(null);

  // Normalize map bounds (approximate Karaikal area)
  // lat (10.82 - 10.95), lng (79.80 - 79.85)
  const mapBounds = {
    top: 10.95,
    bottom: 10.82,
    left: 79.80,
    right: 79.86
  };

  const calculatePosition = (lat, lng) => {
    const top = ((mapBounds.top - lat) / (mapBounds.top - mapBounds.bottom)) * 100;
    const left = ((lng - mapBounds.left) / (mapBounds.right - mapBounds.left)) * 100;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="relative w-full h-full bg-[#f0f9f8] p-10 overflow-hidden font-dm">
      {/* Abstract Map Infrastructure Protocol */}
      <div className="absolute inset-0 z-0">
         {/* Coastal / Sea Visualization */}
         <div className="absolute top-0 right-0 w-1/4 h-full bg-[#02C39A]/5 blur-[80px]" />
         
         {/* Grid Matrix Protcol */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(10,22,40,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(10,22,40,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
         
         {/* Road Node Visualization Matrix */}
         <div className="absolute top-[30%] left-0 w-full h-[6px] bg-white shadow-sm border border-black/[0.02] rotate-12" />
         <div className="absolute top-0 left-[40%] h-full w-[6px] bg-white shadow-sm border border-black/[0.02] -rotate-6" />
         <div className="absolute top-[60%] left-0 w-full h-[4px] bg-white/60 -rotate-12 border border-black/[0.01]" />
         <div className="absolute top-0 left-[60%] h-full w-[4px] bg-white/60 rotate-45 border border-black/[0.01]" />
      </div>

      {/* User Location Node Hub */}
      <div 
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        style={calculatePosition(10.9250, 79.8350)}
      >
         <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 bg-[#0a1628]/5 rounded-full animate-ping absolute" />
            <div className="h-10 w-10 bg-[#0a1628] rounded-xl flex items-center justify-center text-brand-teal shadow-4xl border border-brand-teal/20">
               <MapPin size={24} />
            </div>
            <div className="absolute top-full mt-4 bg-[#0a1628] px-4 py-2 rounded-lg text-[9px] font-black text-white uppercase italic tracking-widest shadow-lg whitespace-nowrap">Resident Node Hub</div>
         </div>
      </div>

      {/* District Boundaries / Coverage Circles Terminal */}
      <div 
        className="absolute z-0 h-[400px] w-[400px] border-4 border-dashed border-[#02C39A]/10 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={calculatePosition(10.9250, 79.8350)}
      >
         <div className="h-40 w-40 bg-[#02C39A]/5 rounded-full blur-[40px]" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 text-[10px] font-black text-brand-teal opacity-40 uppercase tracking-[0.5em] italic">5KM RADIUS GRID</div>
      </div>

      {/* Pharmacy Pins Matrix */}
      {pharmacies.map((p, i) => {
      const coords = p.gps || p.coordinates || { lat: 10.9254, lng: 79.8386 };
         const pos = calculatePosition(coords.lat, coords.lng);
         const isActive = activePin?.id === p.id;

         return (
            <div 
               key={p.id}
               className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
               style={pos}
            >
               <button 
                  onClick={() => setActivePin(p)}
                  className={`relative flex items-center justify-center transition-all duration-700 active:scale-95 group ${isActive ? 'z-30' : 'hover:scale-125 hover:z-25'}`}
               >
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white font-syne font-black text-xs uppercase italic tracking-tighter shadow-xl border-2 transition-all duration-700 ${isActive ? 'bg-[#0a1628] border-brand-teal scale-125' : p.is24hr ? 'bg-blue-500 border-white' : 'bg-brand-teal border-[#0a1628]'}`}>
                     {i + 1}
                  </div>
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 h-6 w-6 bg-white rounded-full flex items-center justify-center text-brand-teal shadow-lg animate-bounce border border-brand-teal/20"><Navigation size={12} /></div>
                  )}
               </button>

               {/* Popup Matrix Console */}
               <AnimatePresence>
                  {isActive && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-full mb-8 left-1/2 -translate-x-1/2 w-80 bg-white rounded-[3rem] shadow-4xl border border-black/[0.05] overflow-hidden z-50 pointer-events-auto"
                     >
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActivePin(null); }}
                          className="absolute top-6 right-6 h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all z-10"
                        ><X size={20}/></button>

                        <div className="h-32 w-full relative">
                           <img src={normalizeUrl(p.images?.[0] || p.image || '/assets/pharmacy_pro.png')} alt={p.name} className="h-full w-full object-cover grayscale-[0.2]" />
                           <div className="absolute inset-x-4 bottom-4 flex justify-between items-center z-10">
                              <div className="px-3 py-1 bg-[#0a1628]/80 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase italic tracking-widest">{p.area} Node</div>
                              <div className={`px-2 py-1 rounded text-[8px] font-black uppercase italic ${p.status.includes('OPEN') ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'}`}>{p.status}</div>
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        <div className="p-8 space-y-6">
                           <div className="space-y-1">
                              <h4 className="font-syne font-black text-lg text-[#0a1628] uppercase italic tracking-tighter">{p.name}</h4>
                              <div className="flex items-center gap-2">
                                 <Star fill="#fbbf24" className="text-amber-400" size={14} />
                                 <span className="font-syne font-black text-[10px] text-[#0a1628] italic">{p.rating}</span>
                                 <span className="text-[10px] font-bold text-gray-300 italic">({p.reviewsCount} AUDITS)</span>
                              </div>
                           </div>

                           <div className="flex items-center justify-between py-4 border-y border-black/[0.03]">
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-brand-teal"><Clock size={14}/></div>
                                 <div className="text-[9px] font-black text-gray-400 uppercase italic tracking-widest">{p.timings || '8:00 AM - 10:00 PM'}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-500"><Navigation size={14}/></div>
                                 <div className="text-[9px] font-black text-emerald-600 uppercase italic tracking-widest">{p.distance} KM</div>
                              </div>
                           </div>

                           {/* Mini Live Stock Protcol */}
                           <div className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase italic">
                                 <span>Live Stock Registry</span>
                                 <span className="text-brand-teal">8.5 / 10 Active</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    className="h-full bg-brand-teal"
                                 />
                              </div>
                           </div>

                           <Link to={`/pharmacies/${p.id}`} className="block">
                              <button className="w-full h-14 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl shadow-4xl flex items-center justify-center gap-3 transition-all hover:bg-brand-teal hover:text-[#0a1628]">
                                 <Pill size={16}/> Initialize Node Uplink
                              </button>
                           </Link>
                        </div>
                        <div className="absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2 h-4 w-4 bg-white rotate-45 border-r border-b border-black/[0.05]" />
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         );
      })}

      {/* Map Legend Console Protocol */}
      <div className="absolute bottom-10 right-10 bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-black/[0.03] shadow-4xl space-y-6 hidden md:block">
         <div className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest border-b border-black/[0.03] pb-3">District Node Legend</div>
         <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="h-6 w-6 bg-brand-teal rounded-lg border-2 border-[#0a1628]" />
               <span className="text-[10px] font-black text-[#0a1628] uppercase italic">Standard Node</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-6 w-6 bg-blue-500 rounded-lg border-2 border-white" />
               <span className="text-[10px] font-black text-[#0a1628] uppercase italic">24/7 Redundant Node</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="h-6 w-6 bg-[#0a1628] rounded-full animate-ping" />
               <span className="text-[10px] font-black text-[#0a1628] uppercase italic">High Demand Focal Point</span>
            </div>
         </div>
      </div>

      <div className="absolute top-10 left-10 z-10">
         <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.5em] italic">District Enclave Visualization</div>
         <div className="text-4xl font-syne font-black text-[#0a1628] uppercase italic tracking-tighter">Karaikal Grid</div>
      </div>
    </div>
  );
}
