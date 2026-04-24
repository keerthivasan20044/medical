import { useState, useMemo } from 'react';
import { Search, MapPin, Star, Clock, Truck, Timer, ShieldCheck, CheckCircle2, XCircle, Info, ChevronRight, Zap, ShoppingCart, Activity, Award, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pharmacies } from '../../utils/data.js';

export default function ComparePharmaciesPage() {
  const [selectedIds, setSelectedIds] = useState(['ph-1', 'ph-2', 'ph-3']); // Default 3

  const selectedPharmacies = useMemo(() => {
    return selectedIds.map(id => pharmacies.find(p => p.id === id)).filter(Boolean);
  }, [selectedIds]);

  const winner = useMemo(() => {
    if (selectedPharmacies.length === 0) return null;
    return [...selectedPharmacies].sort((a, b) => b.rating - a.rating)[0];
  }, [selectedPharmacies]);

  const togglePharmacy = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(idx => idx !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const features = [
    { label: 'Rating', key: 'rating', type: 'rating' },
    { label: 'Distance', key: 'distance', type: 'distance' },
    { label: 'Delivery Fee', key: 'deliveryFee', type: 'fee' },
    { label: 'Delivery Time', key: 'eta', type: 'text' },
    { label: 'Opening Hours', key: 'timings', type: 'text' },
    { label: 'Open 24 Hours', key: 'is24hr', type: 'boolean' },
    { label: 'Tablets', key: 'tablets', type: 'stock' },
    { label: 'Vaccines', key: 'vaccines', type: 'stock' },
    { label: 'Ayurvedic', key: 'ayurvedic', icon: 'special' },
    { label: 'UPI Payment', key: 'upi', type: 'service' },
    { label: 'COD Payment', key: 'cod', type: 'service' },
    { label: 'Parking', key: 'parking', type: 'facility' },
    { label: 'AC', key: 'ac', type: 'facility' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 font-dm">
      {/* Hero Section Protocol */}
      <section className="bg-[#0a1628] pt-32 pb-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(2,195,154,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10 space-y-12 text-center lg:text-left">
           <div className="flex items-center justify-center lg:justify-start gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-8">
              <span>Home</span> <ChevronRight size={14} className="opacity-40" /> <span>Compare Pharmacies</span>
           </div>
           
           <div className="space-y-6">
              <h1 className="font-syne font-black text-6xl lg:text-9xl text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                 Matrix <br/><span className="text-brand-teal">Comparison Hub</span>
              </h1>
              <p className="text-white/40 font-dm text-2xl italic max-w-xl leading-relaxed mx-auto lg:mx-0">
                 Synchronizing clinical parameters across district medical enclaves to identify the optimal delivery node.
              </p>
           </div>
        </div>
      </section>

      {/* Comparison Console Interface */}
      <div className="max-w-7xl mx-auto px-10 -mt-32 relative z-20 space-y-16">
         
         {/* Node Selector Hub */}
         <div className="bg-white border border-black/[0.03] p-12 rounded-[4.5rem] shadow-soft overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-12 min-w-max">
               <div className="space-y-2 shrink-0">
                  <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic leading-none">Selection</div>
                  <h3 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic leading-none">Select Pharmacies</h3>
               </div>
               <div className="flex gap-4">
                  {pharmacies.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => togglePharmacy(p.id)}
                      className={`h-20 px-8 rounded-3xl border font-syne font-black text-[10px] uppercase italic tracking-widest transition-all duration-700 flex items-center justify-center gap-4 ${selectedIds.includes(p.id) ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-4xl' : 'bg-gray-50 text-gray-300 border-black/[0.01] hover:text-[#0a1628] hover:border-[#0a1628]'}`}
                    >
                       {selectedIds.includes(p.id) ? <Trash2 size={16}/> : <Plus size={16}/>} {p.name}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         {/* Comparison Matrix Registry */}
         <div className="bg-white border border-black/[0.03] rounded-[5rem] overflow-hidden shadow-soft p-12 lg:p-20 relative">
            <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[80px]" />
            
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full border-separate border-spacing-y-8 min-w-[1000px]">
                  <thead>
                     <tr>
                        <th className="w-80 px-10 pb-10 text-left">
                           <div className="space-y-4">
                              <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none">Comparison</h3>
                              <div className="px-4 py-2 bg-brand-teal text-[#0a1628] rounded-xl text-[9px] font-black uppercase italic tracking-widest inline-block whitespace-nowrap">
                                 LIVE DATA
                              </div>
                           </div>
                        </th>
                        {selectedPharmacies.map(p => (
                          <th key={p.id} className="pb-10 relative px-6">
                             <div className="space-y-6">
                                <div className="h-40 w-full rounded-[2.5rem] overflow-hidden border border-black/[0.03] shadow-inner"><img src={p.images[0]} className="h-full w-full object-cover grayscale-[0.5]" /></div>
                                <div className="space-y-1">
                                   <div className="font-syne font-black text-2xl text-[#0a1628] uppercase italic tracking-tighter truncate">{p.name}</div>
                                   <div className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">{p.area}</div>
                                </div>
                                {winner?.id === p.id && (
                                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10 w-[90%] bg-amber-500 text-white font-syne font-black text-[9px] uppercase italic tracking-[0.3em] py-2 rounded-xl shadow-4xl flex items-center justify-center gap-3">
                                     <Award size={14}/> Best Choice
                                  </div>
                                )}
                             </div>
                          </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {features.map((f, i) => (
                        <tr key={f.key} className="group">
                           <td className="bg-gray-50/50 border border-black/[0.01] rounded-l-[2rem] px-10 py-10">
                              <div className="font-syne font-black text-[#0a1628] text-sm uppercase italic tracking-widest opacity-40 group-hover:opacity-100 transition-all">{f.label}</div>
                           </td>
                           {selectedPharmacies.map(p => (
                             <td key={p.id} className={`bg-gray-50/50 border-y border-black/[0.01] px-10 py-10 text-center ${selectedPharmacies.indexOf(p) === selectedPharmacies.length - 1 ? 'rounded-r-[2rem] border-r' : ''}`}>
                                {f.type === 'rating' && (
                                  <div className="flex items-center justify-center gap-3">
                                     <Star fill="#fbbf24" className="text-amber-400" size={18}/>
                                     <div className="font-syne font-black text-2xl text-[#0a1628] italic pt-1">{p.rating}</div>
                                  </div>
                                )}
                                {f.type === 'distance' && <div className="font-syne font-black text-xl text-[#0a1628] italic">{p.distance}KM</div>}
                                {f.type === 'fee' && <div className="font-syne font-black text-xl text-brand-teal italic">{p.deliveryFee === 0 ? 'FREE' : `₹${p.deliveryFee}`}</div>}
                                {f.type === 'text' && <div className="text-xs font-dm font-bold text-gray-400 italic uppercase">{p[f.key]}</div>}
                                {f.type === 'boolean' && (
                                  <div className="flex justify-center">
                                     {p[f.key] ? <CheckCircle2 size={24} className="text-emerald-500" /> : <XCircle size={24} className="text-red-300" />}
                                  </div>
                                )}
                                {f.type === 'stock' && (
                                  <div className="space-y-3 px-6">
                                     <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase italic">
                                        <span>Level</span>
                                        <span className={p.stock[f.key] > 60 ? 'text-emerald-500' : p.stock[f.key] > 30 ? 'text-orange-500' : 'text-red-500'}>
                                           {p.stock[f.key] > 60 ? 'High' : p.stock[f.key] > 30 ? 'Med' : 'Low'}
                                        </span>
                                     </div>
                                     <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.stock[f.key]}%` }} className={`h-full ${p.stock[f.key] > 60 ? 'bg-emerald-500' : p.stock[f.key] > 30 ? 'bg-orange-500' : 'bg-red-500'}`} />
                                     </div>
                                  </div>
                                )}
                                {f.type === 'service' && (
                                   <div className="flex justify-center">
                                      {p.services.some(s => s.toLowerCase().includes(f.key)) ? <CheckCircle2 size={24} className="text-emerald-500" /> : <XCircle size={24} className="text-red-300" />}
                                   </div>
                                )}
                                {f.type === 'facility' && (
                                   <div className="flex justify-center opacity-60">
                                      {/* Mock facilities for demo */}
                                      {Math.random() > 0.4 ? <CheckCircle2 size={24} className="text-emerald-500" /> : <XCircle size={24} className="text-red-200" />}
                                   </div>
                                )}
                             </td>
                           ))}
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Winning CTA Enclave */}
         {winner && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-[#0a1628] rounded-[5rem] p-16 lg:p-24 text-white relative overflow-hidden group shadow-4xl border border-white/5"
            >
               <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-10 rounded-full blur-[100px]" />
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                  <div className="space-y-8 text-center lg:text-left">
                     <div className="flex items-center justify-center lg:justify-start gap-6">
                        <div className="h-20 w-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-[#0a1628] shadow-4xl animate-pulse"><Award size={48}/></div>
                        <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.5em] italic">District Audit Results</div>
                     </div>
                     <h2 className="font-syne font-black text-5xl lg:text-7xl uppercase italic tracking-tighter leading-none">Best <br/><span className="text-brand-teal">{winner.name}</span></h2>
                     <p className="text-white/40 font-dm italic font-bold text-2xl max-w-xl">Identified as the best pharmacy based on current availability, rating, and distance metrics.</p>
                  </div>
                  <div className="flex flex-col gap-6 w-full lg:w-96">
                     <button className="h-24 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase italic tracking-[0.4em] rounded-[3rem] shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-6 group">
                        Visit Pharmacy <Zap size={24} className="group-hover:rotate-12 transition-all"/>
                     </button>
                     <button className="h-24 bg-white/5 border border-white/10 text-white font-syne font-black text-[10px] uppercase italic tracking-[0.3em] rounded-[3rem] hover:bg-white/10 transition-all flex items-center justify-center gap-6">
                        Order Now <ShoppingCart size={20}/>
                     </button>
                  </div>
               </div>
            </motion.div>
         )}
      </div>
    </div>
  );
}
