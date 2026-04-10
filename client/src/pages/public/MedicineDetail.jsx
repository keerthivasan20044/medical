import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Truck, ShieldCheck, Heart, ChevronRight, Share2, Plus, Minus, Info, CheckCircle2, ShoppingBag, Zap, Award, Tag, Pill, AlertTriangle, FileText, Globe, Search, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { medicines, pharmacies } from '../../utils/data.js';
import { addItem } from '../../store/cartSlice.js';
import MedicineCard from '../../components/medicine/MedicineCard.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function MedicineDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openAccordions, setOpenAccordions] = useState(['Description']);
  const [isFavorite, setIsFavorite] = useState(false);
  const { items: cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const medicine = useMemo(() => medicines.find(m => m.id === id), [id]);
  const pharmacy = useMemo(() => pharmacies.find(p => p.id === (medicine?.pharmacyId || '')), [medicine]);
  const similarMedicines = useMemo(() => 
    medicines.filter(m => m.category === medicine?.category && m.id !== id).slice(0, 4), 
    [medicine, id]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setQty(1);
    setActiveImg(0);
  }, [id]);

  if (!medicine) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-10">
         <div className="text-center space-y-8 max-w-xl">
            <div className="h-32 w-32 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center mx-auto text-brand-teal shadow-3xl animate-pulse"><Pill size={64}/></div>
            <h2 className="font-syne font-black text-5xl text-white uppercase italic tracking-tighter">{t('skuNotFound')}</h2>
            <p className="text-white/40 font-dm text-xl italic font-bold leading-relaxed">{t('skuNotFoundDesc')} "{id}"</p>
            <Link to="/medicines">
               <button className="h-20 px-16 bg-brand-teal text-[#0a1628] font-syne font-black text-xs uppercase tracking-[0.3em] shadow-mint hover:scale-[1.05] active:scale-95 transition-all italic flex items-center gap-4 mx-auto">
                  <ChevronRight size={20} className="rotate-180"/> {t('returnRegistry')}
               </button>
            </Link>
         </div>
      </div>
    );
  }

  const toggleAccordion = (title) => {
    setOpenAccordions(prev => 
      prev.includes(title) ? prev.filter(a => a !== title) : [...prev, title]
    );
  };

  const handleAddToCart = () => {
    dispatch(addItem({
      id: medicine._id || medicine.id,
      name: medicine.name,
      price: medicine.price,
      image: medicine.images?.[0] || '/assets/medicine_default.png',
      brand: medicine.brand,
      qty
    }));
    toast.success(`${qty} units of ${medicine.name} added to payload.`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48">
      {/* Breadcrumb Terminal */}
      <section className="bg-[#f8fafc] pt-32 pb-12">
         <div className="max-w-7xl mx-auto px-10">
            <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">
               <Link to="/" className="hover:text-brand-teal transition-all">{t('home') || 'Home'}</Link>
               <ChevronRight size={14} className="opacity-40" />
               <Link to="/medicines" className="hover:text-brand-teal transition-all">{t('medicines') || 'Medicines'}</Link>
               <ChevronRight size={14} className="opacity-40" />
               <span className="text-gray-300/40">{medicine.category}</span>
               <ChevronRight size={14} className="opacity-40" />
               <span className="text-brand-teal">{medicine.name}</span>
            </div>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-10 grid lg:grid-cols-12 gap-20">
         
         {/* LEFT — Image gallery Terminal */}
         <div className="lg:col-span-6 space-y-10">
            <div className="relative aspect-square rounded-[4rem] bg-white border border-black/[0.03] shadow-soft overflow-hidden group">
               <img 
                 src={medicine.images[activeImg] || medicine.images[0]} 
                 alt={medicine.name} 
                 className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 hover:scale-110 cursor-zoom-in"
               />
               <div className="absolute top-10 right-10 flex flex-col gap-4 z-20">
                  <button onClick={() => setIsFavorite(!isFavorite)} className={`h-16 w-16 bg-white border rounded-3xl flex items-center justify-center transition-all duration-500 shadow-4xl group/fav ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'border-black/[0.03] text-gray-300 hover:text-red-500'}`}>
                     <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-heartbeat' : 'group-hover/fav:scale-110'} />
                  </button>
                  <button className="h-16 w-16 bg-white border border-black/[0.03] rounded-3xl flex items-center justify-center text-gray-300 hover:text-brand-teal transition-all duration-500 shadow-4xl group/share">
                     <Share2 size={24} className="group-hover:rotate-12" />
                  </button>
               </div>
            </div>

            <div className="flex gap-6 justify-center">
               {(medicine.images || []).map((img, i) => (
                 <button 
                   key={i} 
                   onClick={() => setActiveImg(i)}
                   className={`h-24 w-24 rounded-3xl overflow-hidden border-4 transition-all duration-500 p-1 flex items-center justify-center bg-white ${activeImg === i ? 'border-brand-teal shadow-mint scale-105' : 'border-transparent grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:scale-105'}`}
                 >
                    <img src={img} className="w-full h-full object-cover rounded-2xl" alt="thumbnail" />
                 </button>
               ))}
            </div>
         </div>

         {/* RIGHT — Product Details Matrix */}
         <div className="lg:col-span-6 space-y-12">
            <div className="space-y-6">
               <div className="flex flex-wrap items-center gap-4">
                  <div className="px-6 py-2 bg-[#028090]/5 text-[#028090] text-[10px] font-black uppercase tracking-widest italic border border-[#028090]/10 rounded-xl flex items-center gap-2">
                     <Pill size={14}/> {medicine.category}
                  </div>
                  {medicine.requiresRx && (
                     <div className="px-6 py-2 bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest italic border border-purple-100 rounded-xl flex items-center gap-2">
                        <FileText size={14}/> {t('rxProtocol')}
                     </div>
                  )}
               </div>

               <div className="space-y-2">
                  <div className="text-gray-400 font-dm font-bold italic text-xl">{medicine.brand}</div>
                  <h1 className="font-syne font-black text-6xl lg:text-7xl text-[#0a1628] leading-[0.9] tracking-tighter uppercase italic">{medicine.name}</h1>
                  <div className="text-brand-teal font-dm font-black italic text-2xl uppercase tracking-tighter opacity-60">{t('molecularNode')}: {medicine.generic}</div>
               </div>

               <div className="flex items-center gap-10">
                  <div className="flex items-center gap-4">
                     <div className="flex text-amber-500 gap-0.5"><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/></div>
                     <span className="text-gray-300 font-syne font-black font-xs italic uppercase tracking-widest">({medicine.reviewsCount} {t('audits')})</span>
                  </div>
                  <div className="h-8 w-[2px] bg-black/[0.03]" />
                  <div className="text-gray-300 font-syne font-black font-xs italic uppercase tracking-widest flex items-center gap-3">
                     <Globe size={18} className="text-brand-teal animate-pulse" /> {t('soldInKKL')} {medicine.soldCount}+ TIMES
                  </div>
               </div>
            </div>

            <div className="space-y-10 bg-white border border-black/[0.03] p-12 rounded-[4rem] shadow-soft">
               <div className="flex items-end justify-between">
                  <div className="space-y-2">
                     <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{t('terminalPrice')}</div>
                     <div className="flex items-center gap-6">
                        <span className="font-syne font-black text-brand-teal text-6xl italic leading-none uppercase tracking-tighter">₹{medicine.price}</span>
                        {medicine.mrp > medicine.price && (
                           <div className="flex flex-col">
                              <span className="text-gray-200 line-through font-dm italic text-2xl font-bold font-dm leading-none">₹{medicine.mrp}</span>
                              <span className="text-red-500 font-syne font-black italic text-xs uppercase pt-1 tracking-widest">{medicine.discount}% {t('offPayload')}</span>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 ${medicine.stockCount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                     <div className={`h-2 w-2 rounded-full animate-pulse ${medicine.stockCount > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                     {medicine.stockCount > 0 ? `${medicine.stockCount} ${t('unitsInStock')}` : t('nodeOffline')}
                  </div>
               </div>

               <div className="flex items-center gap-6 p-10 bg-gray-50/50 rounded-[2.5rem] border border-black/[0.02] group relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-brand-teal opacity-[0.03] skew-x-[-20deg]" />
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-inner text-brand-teal group-hover:bg-[#0a1628] transition-all duration-700 relative z-10">
                     <Store size={24}/>
                  </div>
                  <div className="space-y-0.5 relative z-10">
                     <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">{t('distributorNode')}</div>
                     <Link to={`/pharmacies/${pharmacy?.id}`} className="font-syne font-black text-[#0a1628] text-xl uppercase italic group-hover:text-brand-teal transition-colors tracking-tighter">{medicine.pharmacyName}</Link>
                  </div>
                  <div className="ml-auto bg-brand-teal/10 px-4 py-2 rounded-xl text-[9px] font-black text-brand-teal uppercase italic tracking-widest group-hover:bg-[#0a1628] group-hover:text-white transition-all duration-700 relative z-10">{t('verifiedNode')}</div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-black/[0.03] p-8 rounded-[2.5rem] space-y-4 hover:shadow-4xl transition-all duration-700 group/item">
                     <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover/item:rotate-12 transition-transform"><Globe size={18}/></div>
                     <div className="space-y-1">
                        <div className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">{t('globalReach')}</div>
                        <div className="font-syne font-black text-[#0a1628] text-lg italic uppercase">{medicine.manufacturer?.split(' ')[0]}</div>
                     </div>
                  </div>
                  <div className="bg-white border border-black/[0.03] p-8 rounded-[2.5rem] space-y-4 hover:shadow-4xl transition-all duration-700 group/item">
                     <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover/item:rotate-12 transition-transform"><Tag size={18}/></div>
                     <div className="space-y-1">
                        <div className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest">{t('protocolType')}</div>
                        <div className="font-syne font-black text-[#0a1628] text-lg italic uppercase">{medicine.type}</div>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row gap-6">
                  <div className="h-20 bg-gray-50 border border-black/[0.03] rounded-[2.2rem] flex items-center px-10 gap-10">
                     <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-[#0a1628] transition-all"><Minus size={24}/></button>
                     <span className="font-syne font-black text-2xl text-[#0a1628] italic w-12 text-center">{qty}</span>
                     <button onClick={() => setQty(Math.min(10, qty + 1))} className="text-gray-400 hover:text-[#0a1628] transition-all"><Plus size={24}/></button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-20 bg-gradient-to-r from-brand-teal to-[#1a3a4a] text-white font-syne font-black text-xs uppercase italic tracking-[0.3em] rounded-[2.2rem] shadow-mint hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-6"
                  >
                     <ShoppingBag size={24}/> {t('initPayload')}
                  </button>
               </div>

               <button className="w-full h-20 bg-white border-2 border-brand-teal text-brand-teal font-syne font-black text-[10px] uppercase italic tracking-[0.3em] rounded-[2.2rem] hover:bg-brand-teal hover:text-white transition-all duration-700 active:scale-95 shadow-soft shadow-mint/20">
                  {t('instantUplink')}
               </button>
            </div>

            <div className="bg-[#0a1628] rounded-[4rem] p-12 text-white space-y-8 shadow-4xl border-l-[16px] border-l-brand-teal group relative overflow-hidden">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center shadow-3xl text-brand-teal group-hover:rotate-12 transition-all duration-700">
                     <Truck size={28}/>
                  </div>
                  <h4 className="font-syne font-black text-2xl uppercase italic tracking-tighter leading-none">{t('logisticsProtocol')}</h4>
               </div>
               <div className="space-y-6">
                  <p className="text-white/60 font-dm font-bold italic text-lg leading-relaxed">
                     <span className="text-brand-teal">{t('deliverToday')} 6PM</span>. Delivering from <span className="underline decoration-brand-teal/40 decoration-4 underline-offset-8">{pharmacy?.name}</span>.
                  </p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                     <div className="flex items-center gap-4">
                        <div className="h-3 w-3 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic text-white/40 leading-none">{t('regionalLatency')}</span>
                     </div>
                     <div className="text-brand-teal font-syne font-black italic text-xs uppercase tracking-widest">{t('districtNode')} [609602]</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Accordion Specification Cluster */}
      <section className="max-w-7xl mx-auto px-10 py-32 space-y-8">
         {[
            { title: t('specDescription'), content: medicine.description, icon: Info },
            { title: t('specDosage'), content: medicine.dosage, icon: Zap },
            { title: t('specSideEffects'), content: medicine.sideEffects, icon: AlertTriangle },
            { title: t('specStorage'), content: medicine.storage, icon: ShieldCheck },
            { title: t('specManufacturer'), content: medicine.manufacturer, icon: Award }
         ].map(section => (
           <div key={section.title} className="bg-white border border-black/[0.03] rounded-[3rem] overflow-hidden shadow-soft">
              <button 
                onClick={() => toggleAccordion(section.title)}
                className="w-full h-24 px-12 flex items-center justify-between group"
              >
                 <div className="flex items-center gap-6">
                    <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all duration-500"><section.icon size={20}/></div>
                    <span className="font-syne font-black text-xl text-[#0a1628] uppercase italic tracking-tighter group-hover:translate-x-2 transition-transform">{section.title}</span>
                 </div>
                 <ChevronRight 
                   size={24} 
                   className={`text-gray-300 transition-all duration-700 transform ${openAccordions.includes(section.title) ? 'rotate-90 text-brand-teal' : ''}`}
                 />
              </button>
              <AnimatePresence>
                 {openAccordions.includes(section.title) && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                   >
                      <div className="px-12 pb-12 pt-4">
                         <div className="h-[2px] w-16 bg-brand-teal/20 rounded-full mb-8" />
                         <p className="text-gray-400 font-dm font-bold italic text-xl leading-relaxed max-w-4xl">{section.content}</p>
                      </div>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
         ))}
      </section>

      {/* Similar Nodes Horizontal Scroll */}
      <section className="max-w-7xl mx-auto px-10 py-32 space-y-16">
         <div className="flex items-center justify-between">
            <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-8">
               <div className="h-2 w-24 bg-brand-teal rounded-full" /> {t('similarNodes')}
            </h3>
            <Link to="/medicines" className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic hover:translate-x-4 transition-all flex items-center gap-4">{t('initUniversalSync')} <ChevronRight size={16}/></Link>
         </div>
         <div className="grid md:grid-cols-4 gap-12">
            {similarMedicines.map(m => (
              <MedicineCard 
                key={m._id || m.id} 
                item={m} 
                onAdd={(item) => dispatch(addItem({ ...item, id: item._id || item.id, image: item.images?.[0], qty: 1 }))}
                isAdded={cartItems.some(item => item.id === (m._id || m.id))}
              />
            ))}
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-10 py-32 space-y-16 border-t border-black/[0.03]">
          <h3 className="font-syne font-black text-4xl text-[#0a1628] uppercase italic leading-none flex items-center gap-8">
             <div className="h-2 w-24 bg-brand-teal rounded-full" /> {t('residentAudits')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
             {[1,2,3].map(i => (
                <div key={i} className="bg-white p-12 rounded-[4.5rem] border border-black/[0.03] space-y-8 shadow-soft hover:shadow-4xl transition-all duration-1000 border-l-[16px] border-gray-50 hover:border-brand-teal group">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-6">
                         <div className="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-syne font-black text-xl italic group-hover:bg-[#0a1628] group-hover:text-brand-teal transition-all">U</div>
                         <div className="space-y-0.5">
                            <div className="font-syne font-black text-[#0a1628] text-xl uppercase italic tracking-tighter">{t('auditNode')}</div>
                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">{t('districtNode')}</div>
                         </div>
                      </div>
                      <div className="flex text-amber-500 gap-0.5 group-hover:scale-110 transition-transform"><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /><Star fill="currentColor" size={14} /></div>
                   </div>
                   <p className="text-gray-400 font-dm italic text-lg leading-relaxed font-bold italic">"Synchronized delivery was exceptionally fast. Optimal clinical experience in Karaikal enclave."</p>
                </div>
             ))}
          </div>
      </section>

      {/* Sticky Quick-Action Bar Node */}
      <AnimatePresence>
         <motion.div 
           initial={{ y: 200 }}
           animate={{ y: 0 }}
           className="fixed bottom-10 inset-x-10 z-[100] bg-[#0a1628]/95 backdrop-blur-3xl h-24 rounded-[3rem] border border-white/10 shadow-4xl flex lg:hidden items-center justify-between px-10 gap-8"
         >
            <div className="flex items-center gap-6">
               <div className="font-syne font-black text-brand-teal text-3xl italic">₹{medicine.price}</div>
               <div className="h-8 w-px bg-white/10" />
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-14 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase italic tracking-widest rounded-2xl shadow-mint"
            >
               Add Payload
            </button>
         </motion.div>
      </AnimatePresence>
    </div>
  );
}
