import { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, Plus, RotateCw, ArrowUpDown, 
  Trash2, Edit2, AlertCircle, Package, Zap, 
  Activity, IndianRupee, X, CheckCircle, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const MOCK_MEDICINES = [
  { id: 1, name: 'Paracetamol 500mg', category: 'tablets', stock: 85, price: 45, mrp: 60, expiry: 'Mar 2027', batch: 'B25001', status: 'normal', demand: 'high' },
  { id: 2, name: 'Amoxicillin Syrup', category: 'syrups', stock: 5, price: 68, mrp: 85, expiry: 'Nov 2026', batch: 'B24892', status: 'low', demand: 'medium' },
  { id: 3, name: 'Metformin 500mg', category: 'tablets', stock: 120, price: 38, mrp: 50, expiry: 'Jun 2027', batch: 'B25002', status: 'normal', demand: 'low' },
  { id: 4, name: 'Flu Vaccine', category: 'vaccines', stock: 0, price: 450, mrp: 500, expiry: '—', batch: '—', status: 'out', demand: 'critical' },
  { id: 5, name: 'Insulin Glargine', category: 'injections', stock: 12, price: 850, mrp: 950, expiry: 'Aug 2026', batch: 'B24001', status: 'expiring', demand: 'high' }
];

export default function PharmacistInventory() {
  const { t } = useLanguage();
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredMeds = useMemo(() => {
    return medicines.filter(m => {
       const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
       const matchesCategory = category === 'all' || m.category === category;
       return matchesSearch && matchesCategory;
    });
  }, [search, category, medicines]);

  const handleDelete = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
    toast.success(t('medicineRemovedInventory'));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-40 pt-32 px-12 relative overflow-hidden">
      {/* Background Decals */}
      <div className="absolute top-0 right-0 h-full w-1/3 bg-[#02C39A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-1/2 w-1/4 bg-[#028090]/5 blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-16 relative z-10">
         
         {/* Telemetry Pulse Header */}
         <div className="grid lg:grid-cols-[1fr_500px] gap-12 items-end">
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-[10px] font-black text-[#02C39A] uppercase tracking-[0.4em] mb-4">
                  <Activity size={14} className="animate-pulse" /> {t('liveEnclaveInventorySync')}
               </div>
               <h1 className="font-syne font-black text-7xl text-[#0a1628] leading-none tracking-tighter">{t('inventoryArchitecture').split(' ')[0]} <br /><span className="text-[#028090]">{t('inventoryArchitecture').split(' ')[1]}.</span></h1>
               <p className="text-gray-400 font-dm italic text-lg opacity-60">Managing 5,240 SKU units across Apollo Pharmacy, New Colony.</p>
            </div>
            
            <div className="bg-[#0a1628] p-10 rounded-[4rem] text-white flex gap-12 shadow-4xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-grid opacity-5 group-hover:opacity-10 transition duration-700" />
               <div className="space-y-2 flex-1 relative z-10">
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{t('stockVelocity')}</div>
                  <div className="font-syne font-black text-4xl text-[#02C39A]">+12.4%</div>
                  <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none">{t('replenishmentEfficiency')}</div>
               </div>
               <div className="space-y-2 flex-1 relative z-10">
                  <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{t('enclaveRisk')}</div>
                  <div className="font-syne font-black text-4xl text-orange-400">03</div>
                  <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none">{t('criticalLowNodesDistrict')}</div>
               </div>
               <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center text-[#02C39A] backdrop-blur-xl border border-white/5 shadow-inner">
                  <Zap size={32} />
               </div>
            </div>
         </div>

         {/* Protocol Controls */}
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-10 border-t border-gray-100">
            <div className="flex-1 flex flex-col md:flex-row gap-6">
               <div className="flex-1 flex items-center bg-white rounded-[2.5rem] px-10 py-5 border border-gray-100 shadow-sm focus-within:border-[#028090]/30 transition-all duration-500 group">
                  <Search size={24} className="text-gray-300 group-focus-within:text-[#02C39A]" />
                  <input 
                     type="text" 
                     placeholder={t('searchInventoryPlaceholder')}
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="bg-transparent border-none outline-none font-dm text-sm px-6 w-full text-[#0a1628]" 
                  />
               </div>
               <div className="bg-white border border-gray-100 rounded-[2.5rem] px-8 py-5 shadow-sm flex items-center gap-4">
                  <Filter size={20} className="text-[#028090]" />
                  <select 
                     className="bg-transparent outline-none font-dm font-bold text-[10px] uppercase tracking-widest text-[#0a1628] leading-none"
                     value={category}
                     onChange={(e) => setCategory(e.target.value)}
                  >
                     <option value="all">{t('all')}</option>
                     <option value="tablets">{t('tablets')}</option>
                     <option value="syrups">{t('syrups')}</option>
                     <option value="vaccines">{t('vaccines')}</option>
                     <option value="injections">{t('injections')}</option>
                  </select>
               </div>
            </div>

            <div className="flex gap-4">
              <button className="h-20 w-20 bg-white text-[#0a1628] rounded-[2.5rem] flex items-center justify-center hover:rotate-180 transition-all duration-[1000ms] shadow-3xl border border-gray-50"><RotateCw size={24} /></button>
              <button 
                 onClick={() => setShowAddModal(true)}
                 className="px-12 py-5 bg-gradient-to-r from-[#02C39A] to-[#028090] text-white font-syne font-black text-xs uppercase tracking-widest rounded-full shadow-4xl shadow-[#02C39A]/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
              >
                 <Plus size={22} /> {t('addNewMedicineNode')}
              </button>
            </div>
         </div>

         {/* Medicine Table Architecture */}
         <div className="bg-white rounded-[5rem] border border-gray-100 shadow-3xl overflow-hidden">
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead className="bg-[#0a1628] text-white">
                     <tr>
                        <th className="px-16 py-10 text-[10px] font-black uppercase tracking-[0.3em]">{t('medicineNode')}</th>
                        <th className="px-8 py-10 text-[10px] font-black uppercase tracking-[0.3em]">{t('categoryArchitecture')}</th>
                        <th className="px-8 py-10 text-[10px] font-black uppercase tracking-[0.3em]"><div className="flex items-center gap-3">{t('available')} <ArrowUpDown size={14} className="text-[#02C39A]" /></div></th>
                        <th className="px-8 py-10 text-[10px] font-black uppercase tracking-[0.3em]">{t('pulseDemand')}</th>
                        <th className="px-8 py-10 text-[10px] font-black uppercase tracking-[0.3em]">{t('registryMetrics')}</th>
                        <th className="px-16 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-center">{t('protocolSync')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                     <AnimatePresence mode="popLayout">
                        {filteredMeds.map((m, idx) => (
                           <motion.tr 
                              layoutId={m.id}
                              key={m.id}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`transition-all border-l-[1rem] border-transparent hover:bg-gray-50/70 group/row ${
                                 m.status === 'low' ? 'border-amber-400 bg-amber-50/10' :
                                 m.status === 'out' ? 'border-red-500 bg-red-50/10' :
                                 m.status === 'expiring' ? 'border-orange-500 bg-orange-50/10' : ''
                              }`}
                           >
                              <td className="px-16 py-12">
                                 <div className="flex items-center gap-6">
                                    <div className={`h-16 w-16 rounded-[1.8rem] flex items-center justify-center font-black text-2xl text-[#0a1628] border-2 shadow-inner group-hover/row:scale-110 transition duration-500 ${
                                       m.status === 'low' ? 'bg-amber-100/50 border-amber-200' : 
                                       m.status === 'out' ? 'bg-red-100/50 border-red-200' : 'bg-gray-100 border-white'
                                    }`}>{m.name[0]}</div>
                                    <div className="space-y-1">
                                       <div className="font-syne font-black text-2xl text-[#0a1628] uppercase tracking-tighter leading-none">{m.name}</div>
                                       <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">{m.batch} {t('batchArchitectureNode')}</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-12">
                                 <div className="text-[9px] font-black text-[#028090] uppercase tracking-widest bg-emerald-50 px-5 py-2.5 rounded-full inline-block border border-emerald-100">{t(m.category)}</div>
                              </td>
                              <td className="px-8 py-12">
                                 <div className={`text-4xl font-syne font-black flex items-center gap-3 ${
                                    m.status === 'low' ? 'text-amber-500' : m.status === 'out' ? 'text-red-500' : 'text-[#0a1628]'
                                 }`}>
                                    {m.stock}
                                    {m.status === 'low' && <AlertCircle size={24} className="animate-bounce" />}
                                    {m.status === 'out' && <Package size={24} className="opacity-20 translate-y-1" />}
                                 </div>
                              </td>
                              <td className="px-8 py-12">
                                 <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${
                                    m.demand === 'critical' ? 'text-red-500 animate-pulse' :
                                    m.demand === 'high' ? 'text-[#02C39A]' : 'text-gray-300'
                                 }`}>
                                    <TrendingUp size={16} /> {t(m.demand)}
                                 </div>
                              </td>
                              <td className="px-8 py-12">
                                 <div className="space-y-2">
                                    <div className="flex items-center gap-3 font-syne font-black text-[#0a1628] text-lg">₹{m.price} <span className="text-[10px] text-gray-300 line-through font-bold">₹{m.mrp}</span></div>
                                    <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${m.status === 'expiring' ? 'text-orange-500' : 'text-gray-400'}`}>
                                       <Activity size={12} /> XP: {m.expiry}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-16 py-12">
                                 <div className="flex items-center justify-center gap-4">
                                    <button className="h-14 px-8 bg-[#0a1628] text-white font-syne font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-[#028090] transition-all shadow-xl flex items-center justify-center gap-4">{t('editNode')} <Edit2 size={14}/></button>
                                    <button 
                                       onClick={() => handleDelete(m.id)}
                                       className="h-14 w-14 bg-white border-2 border-gray-50 text-gray-300 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-lg active:scale-90"
                                    >
                                       <Trash2 size={20} />
                                    </button>
                                 </div>
                              </td>
                           </motion.tr>
                        ))}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
            
            <div className="p-16 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="h-12 w-12 bg-[#0a1628] text-[#02C39A] rounded-2xl flex items-center justify-center shadow-lg"><Info size={20}/></div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs">District medical protocol requires <br/>exact SKU counts for all Schedule H drugs.</div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="h-14 px-10 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-300 hover:bg-white transition-all cursor-pointer">Back Architecture</button>
                  <button className="h-14 px-10 bg-[#0a1628] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-[#028090] transition-all">Next Enclave Buffer &rarr;</button>
               </div>
            </div>
         </div>
      </div>

      {/* Add Medicine Modal Architecture */}
      <AnimatePresence>
         {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowAddModal(false)}
                  className="absolute inset-0 bg-[#0a1628]/80 backdrop-blur-3xl" 
               />
               <motion.div 
                  layoutId="modal-add"
                  initial={{ opacity: 0, scale: 0.9, y: 100 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: 100 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="relative z-10 w-full max-w-5xl bg-white rounded-[6rem] shadow-4xl overflow-hidden border border-white/20"
               >
                  <div className="h-40 bg-[#0a1628] flex items-center justify-between px-20 relative overflow-hidden">
                     <div className="absolute inset-0 bg-grid opacity-10" />
                     <div className="relative z-10 space-y-1">
                        <h2 className="font-syne font-black text-4xl text-white tracking-tighter">Add New <span className="text-[#02C39A]">{t('medicineNode')}</span></h2>
                        <p className="text-white/30 font-dm italic text-sm">Registering new therapeutic assets for the Karaikal district.</p>
                     </div>
                     <button onClick={() => setShowAddModal(false)} className="h-16 w-16 text-white/40 hover:text-white transition group border-2 border-white/10 rounded-[2rem] flex items-center justify-center hover:bg-white/5 active:scale-95"><X size={32}/></button>
                  </div>
                  
                  <div className="p-20 grid grid-cols-2 gap-16">
                     <div className="space-y-10">
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4 ml-2"><Package size={14}/> {t('therapeuticIdentification')}</label>
                           <input type="text" placeholder={t('medicineNamePlaceholder')} className="w-full p-7 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-[#02C39A]/40 transition-all font-dm text-lg placeholder:text-gray-300" />
                           <input type="text" placeholder={t('genericCodePlaceholder')} className="w-full p-7 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none transition-all font-dm text-lg placeholder:text-gray-300" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <select className="p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none font-dm font-bold text-sm text-gray-500 uppercase tracking-widest">
                              <option>{t('tablets')}</option>
                              <option>{t('syrups')}</option>
                              <option>{t('vaccines')}</option>
                              <option>{t('injections')}</option>
                           </select>
                           <input type="text" placeholder={t('manufacturingBrand')} className="p-6 bg-gray-50 border-2 border-gray-100 rounded-[2rem] outline-none font-dm text-lg" />
                        </div>
                     </div>

                     <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4 ml-2"><IndianRupee size={14}/> {t('nodeValuation')}</label>
                              <div className="relative">
                                 <IndianRupee size={20} className="absolute left-7 top-7 text-gray-200" />
                                 <input type="number" placeholder="0.00" className="w-full p-7 pl-16 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none font-syne font-black text-2xl" />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest opacity-0">.</label>
                              <div className="relative">
                                 <IndianRupee size={20} className="absolute left-7 top-7 text-gray-200" />
                                 <input type="number" placeholder="MRP" className="w-full p-7 pl-16 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none font-syne font-black text-2xl" />
                              </div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-4 ml-2"><Zap size={14}/> {t('stockMatrixUnits')}</label>
                           <div className="grid grid-cols-2 gap-6">
                              <input type="number" placeholder={t('totalUnits')} className="p-7 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none font-dm text-lg" />
                              <input type="text" placeholder={t('unitFormat')} className="p-7 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] outline-none font-dm text-lg" />
                           </div>
                        </div>
                     </div>

                     <div className="col-span-2 pt-16 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-6 group cursor-pointer">
                           <div className="relative h-10 w-10">
                              <input type="checkbox" id="rx" className="peer h-10 w-10 opacity-0 absolute z-10 cursor-pointer" />
                              <div className="absolute inset-0 bg-gray-100 border-2 border-gray-200 rounded-2xl transition-all peer-checked:bg-[#02C39A] peer-checked:border-[#02C39A]" />
                              <CheckCircle className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" size={24} />
                           </div>
                           <label htmlFor="rx" className="text-xl font-syne font-black text-[#0a1628] group-hover:text-[#028090] transition cursor-pointer">{t('rxProtocol')} <span className="text-[#02C39A] ml-2">(Schedule H)</span></label>
                        </div>
                        <button 
                           onClick={() => { setShowAddModal(false); toast.success(t('newMedicineSyncSuccess')); }}
                           className="px-20 py-8 bg-[#0a1628] text-[#02C39A] rounded-[3rem] font-syne font-black text-lg uppercase tracking-[0.3em] shadow-4xl hover:bg-[#02C39A] hover:text-white transition-all active:scale-95 flex items-center gap-6"
                        >
                           {t('authorizeRegistry')} <ArrowRight size={24} />
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
