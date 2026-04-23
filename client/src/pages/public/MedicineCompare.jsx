import { useState, useMemo } from 'react';
import { Search, X, Star, ShoppingBag, Plus, Info, Globe, ShieldCheck, FileText, ChevronRight, Activity, Zap, Award, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { medicines } from '../../utils/data.js';
import { useLanguage } from '../../context/LanguageContext';


export default function MedicineComparePage() {
  const { t } = useLanguage();
  const [compareIds, setCompareIds] = useState([]);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const compareItems = useMemo(() => 
    compareIds.map(id => medicines.find(m => m.id === id)).filter(Boolean), 
    [compareIds]
  );

  const availableToCompare = useMemo(() => 
    medicines.filter(m => !compareIds.includes(m.id) && m.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [compareIds, searchQuery]
  );

  const addToCompare = (id) => {
    if (compareIds.length < 3) {
      setCompareIds([...compareIds, id]);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const removeFromCompare = (id) => {
    setCompareIds(compareIds.filter(cid => cid !== id));
  };

  const features = [
    { label: 'Clinical Price', icon: Zap, val: m => `\u20B9${m.price}` },
    { label: 'Terminal MRP', icon: Award, val: m => `\u20B9${m.mrp}` },
    { label: 'Rx Protocol', icon: FileText, val: m => m.requiresRx ? 'Required' : 'Not Req.' },
    { label: 'Therapeutic Enclave', icon: Info, val: m => m.category },
    { label: 'Audit Performance', icon: Star, val: m => `${m.rating} ★ (${m.reviewsCount})` },
    { label: 'Inventory State', icon: Activity, val: m => m.stockCount > 0 ? 'Optimal' : 'Offline' }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48">
      {/* Hero: Comparison Logic Hub */}
      <section className="bg-[#0a1628] pt-32 pb-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(2,195,154,0.1),transparent_50%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 bg-brand-teal/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-10 relative z-10 space-y-12">
            <div className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-8 leading-none">
               <Link to="/" className="hover:text-brand-teal transition-all">Home</Link>
               <ChevronRight size={14} className="opacity-40" />
               <Link to="/medicines" className="hover:text-brand-teal transition-all">Medicines</Link>
               <ChevronRight size={14} className="opacity-40" />
               <span className="text-brand-teal">{t('compareProtocols')}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
               <div className="space-y-6">
                  <h1 className="font-syne font-black text-6xl lg:text-9xl text-white leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
                     {t('protocolUplink').split(' ')[0]} <br/><span className="text-brand-teal">{t('protocolUplink').split(' ')[1]}</span>
                  </h1>
                  <p className="text-white/40 font-dm text-2xl italic leading-relaxed max-w-xl">{t('clinicalTrajectories')}</p>
               </div>
               
               {compareIds.length > 0 && (
                 <button 
                   onClick={() => setCompareIds([])}
                   className="h-16 px-10 bg-white/5 border border-white/10 text-white font-syne font-black text-[9px] uppercase italic tracking-widest rounded-2xl hover:bg-red-500 hover:border-red-500 transition-all duration-700 flex items-center gap-4 active:scale-95 shadow-4xl"
                 >
                    <X size={18}/> {t('clearCompare')}
                 </button>
               )}
            </div>
        </div>
      </section>

      {/* Comparison Matrix Table Terminal */}
      <div className="max-w-[1400px] mx-auto px-10 -mt-20 relative z-20">
         <div className="bg-white border border-black/[0.03] rounded-[5rem] shadow-4xl overflow-hidden p-10 lg:p-20">
            <div className="grid grid-cols-[250px_1fr_1fr_1fr] gap-4">
               
               {/* Label Column Node */}
               <div className="space-y-12 pt-[450px]">
                  {features.map(f => (
                    <div key={f.label} className="h-24 flex items-center gap-4 border-b border-black/[0.02] last:border-0 group select-none">
                       <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500"><f.icon size={18}/></div>
                       <span className="font-syne font-black text-[10px] text-gray-300 uppercase italic tracking-widest group-hover:text-[#0a1628] transition-colors">{f.label}</span>
                    </div>
                  ))}
               </div>

               {/* Item Columns Matrix */}
               {[0, 1, 2].map(idx => {
                 const m = compareItems[idx];
                 return (
                   <div key={idx} className={`space-y-12 relative ${idx < 2 ? 'border-r border-black/[0.03] pr-4' : ''}`}>
                      {m ? (
                        <>
                          <div className="space-y-10 px-8 text-center pb-12 border-b-2 border-brand-teal/10">
                             <div className="relative aspect-square w-full rounded-[4rem] overflow-hidden bg-gray-50 border border-black/[0.03] shadow-soft group">
                                <img src={m.images[0]} alt={m.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                                <button 
                                  onClick={() => removeFromCompare(m.id)}
                                  className="absolute top-6 right-6 h-12 w-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all scale-75 group-hover:scale-100 shadow-4xl border border-black/[0.03]"
                                >
                                   <X size={20}/>
                                </button>
                             </div>
                             <div className="space-y-2">
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{m.brand}</div>
                                <h3 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic leading-none truncate group-hover:text-brand-teal transition-colors tracking-tighter">{m.name}</h3>
                                <div className="text-[10px] font-black text-brand-teal italic uppercase tracking-[0.2em]">{m.generic}</div>
                             </div>
                          </div>

                          {/* Attribute Values Grid */}
                          <div className="space-y-12 px-8">
                             {features.map(f => (
                               <div key={f.label} className="h-24 flex flex-col items-center justify-center text-center border-b border-black/[0.02] last:border-0 group">
                                  <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic group-hover:text-brand-teal transition-colors tracking-tighter">{f.val(m)}</div>
                               </div>
                             ))}
                          </div>

                          <div className="px-8 pt-10">
                             <button className="w-full h-20 bg-[#0a1628] text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-[0.3em] rounded-[2.5rem] shadow-4xl hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-700 flex items-center justify-center gap-6 group">
                                <ShoppingBag size={20} className="group-hover:rotate-12 transition-transform"/> Initialize Payload
                             </button>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-8 bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-black/[0.05] min-h-[800px]">
                           <div className="h-32 w-32 bg-white rounded-[3.5rem] flex items-center justify-center text-gray-200 border border-black/[0.03] shadow-soft group-hover:scale-110 transition-transform"><Plus size={48} className="animate-pulse"/></div>
                           <div className="space-y-4">
                              <h4 className="font-syne font-black text-2xl text-[#0a1628] uppercase italic tracking-tighter">{t('addMedicine')}</h4>
                              <p className="text-gray-300 font-dm italic font-bold">{t('initializeDescription') || 'Initialize a new medical node for comparison.'}</p>
                           </div>
                           <button 
                             onClick={() => setShowSearch(true)}
                             className="h-16 px-10 bg-white border border-black/[0.03] text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl hover:bg-brand-teal transition-all duration-500 shadow-4xl active:scale-95"
                           >
                              Target Node
                           </button>
                        </div>
                      )}
                   </div>
                 );
               })}
            </div>
         </div>
      </div>

      {/* Comparison Target Search Overlay Terminal */}
      <AnimatePresence>
         {showSearch && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[1000] bg-[#0a1628]/95 backdrop-blur-2xl flex items-center justify-center p-10 lg:p-40"
           >
              <div className="w-full max-w-5xl space-y-12">
                 <div className="flex justify-between items-center text-white">
                    <h2 className="font-syne font-black text-6xl uppercase italic tracking-tighter"><span className="text-brand-teal">Target</span> Search</h2>
                    <button onClick={() => setShowSearch(false)} className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:text-red-500 hover:border-red-500 transition-all active:scale-95"><X size={32}/></button>
                 </div>
                 
                 <div className="h-24 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center px-10 gap-8 focus-within:border-brand-teal transition-all group overflow-hidden">
                    <Search className="text-white/20 group-focus-within:text-brand-teal group-focus-within:scale-110 transition-all duration-700" size={32} />
                    <input 
                      type="text" 
                      placeholder="Identify clinical node name..." 
                      className="bg-transparent flex-1 font-syne font-black text-3xl italic outline-none text-white placeholder-white/10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                 </div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-h-[60vh] overflow-y-auto pr-10 no-scrollbar">
                    {availableToCompare.map((m, idx) => (
                      <motion.button 
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => addToCompare(m.id)}
                        className="bg-white/5 border border-white/5 p-8 rounded-[3rem] text-left hover:bg-white/10 hover:border-brand-teal transition-all group active:scale-95 overflow-hidden relative"
                      >
                         <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal opacity-[0.02] rounded-full blur-[40px] pointer-events-none" />
                         <div className="flex items-center gap-6 relative z-10">
                            <div className="h-20 w-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                               <img src={m.images[0]} alt={m.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000" />
                            </div>
                            <div className="space-y-1 overflow-hidden">
                               <div className="text-[10px] font-black text-brand-teal uppercase italic tracking-widest">{m.brand}</div>
                               <h4 className="font-syne font-black text-white text-xl uppercase italic tracking-tighter truncate leading-none">{m.name}</h4>
                               <div className="text-[9px] font-black text-white/40 italic uppercase tracking-widest">\u20B9{m.price} &bull; {m.category}</div>
                            </div>
                         </div>
                      </motion.button>
                    ))}
                 </div>
              </div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
