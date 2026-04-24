import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, Truck, ShieldCheck, Heart, ChevronRight, Share2, Plus, Minus, Info, CheckCircle2, ShoppingBag, Zap, Award, Tag, Pill, AlertTriangle, FileText, Globe, Search, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { medicines as mockMedicines, pharmacies as mockPharmacies } from '../../utils/data.js';
import { addToCart } from '../../store/cartSlice.js';
import MedicineCard from '../../components/medicine/MedicineCard';
import { useLanguage } from '../../context/LanguageContext';
import { medicineService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';
import { Loader2 } from 'lucide-react';

export default function MedicineDetailPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState(null);
  const [openAccordions, setOpenAccordions] = useState(['Description']);
  const [isFavorite, setIsFavorite] = useState(false);
  const { items: cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    setMedicine(null);
    setLoading(true);
    fetchMedicineDetails();
    window.scrollTo(0, 0);
    setQty(1);
    setActiveImg(0);
  }, [id]);

  const fetchMedicineDetails = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getById(id);
      setMedicine(data);
    } catch (err) {
      console.warn('Node fetch failed, attempting fallback protocol...', err);
      const fallback = mockMedicines.find(m => m.id === id || m._id === id);
      setMedicine(fallback);
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (title) => {
    setOpenAccordions(prev => 
      prev.includes(title) ? prev.filter(a => a !== title) : [...prev, title]
    );
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: medicine?._id || medicine?.id,
      name: medicine?.name,
      price: medicine?.price,
      image: normalizeUrl(medicine?.images?.[0] || '/assets/medicine_default.png'),
      brand: medicine?.brand,
      quantity: qty
    }));
    toast.success(`${qty} units added to cart.`);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] space-y-6">
      <Loader2 className="animate-spin text-brand-teal" size={48}/>
      <p className="font-syne font-black text-[#0a1628] uppercase italic tracking-widest">Loading Details...</p>
    </div>
  );

  if (!medicine) return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6">
       <div className="text-center space-y-8 max-w-xl">
          <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-brand-teal animate-pulse"><Pill size={40}/></div>
          <h2 className="font-syne font-black text-3xl md:text-5xl text-white uppercase italic tracking-tighter">MEDICINE NOT FOUND</h2>
          <Link to="/medicines">
             <button className="h-16 px-10 bg-brand-teal text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest italic flex items-center gap-4 mx-auto">
                <ChevronRight size={18} className="rotate-180"/> BACK TO SHOP
             </button>
          </Link>
       </div>
    </div>
  );

  const pharmacyId = medicine.pharmacyId || medicine.pharmacy;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-64 font-dm">
      {/* Breadcrumb Terminal */}
      <section className="bg-[#f8fafc] pt-24 pb-6 md:pt-32 md:pb-12">
         <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex flex-wrap items-center gap-3 text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">
               <Link to="/" className="hover:text-brand-teal hidden md:block">{t('home') || 'Home'}</Link>
               <ChevronRight size={12} className="opacity-40 hidden md:block" />
               <Link to="/medicines" className="hover:text-brand-teal">{t('medicines') || 'Medicines'}</Link>
               <ChevronRight size={12} className="opacity-40" />
               <span className="text-brand-teal truncate max-w-[150px]">{medicine.name}</span>
            </div>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10 md:gap-20">
         
         {/* LEFT — Image gallery Terminal */}
         <div className="lg:col-span-6 space-y-6 md:space-y-10">
            <div className="relative aspect-square rounded-[2rem] md:rounded-[4rem] bg-white border border-black/[0.03] shadow-sm overflow-hidden group">
               <img 
                 src={normalizeUrl(medicine.images?.[activeImg] || medicine.images?.[0] || '/assets/medicine_default.png')} 
                 alt={medicine.name} 
                 onError={(e) => { e.target.src = '/assets/medicine_default.png'; }}
                 className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-1000 hover:scale-105"
               />
               <div className="absolute top-4 right-4 md:top-10 md:right-10 flex flex-col gap-4 z-20">
                  <button onClick={() => setIsFavorite(!isFavorite)} className={`h-11 w-11 md:h-16 md:w-16 bg-white border rounded-xl md:rounded-3xl flex items-center justify-center transition-all duration-300 shadow-xl ${isFavorite ? 'bg-red-500 border-red-500 text-white' : 'border-black/[0.03] text-gray-300'}`}>
                     <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'animate-heartbeat' : ''} />
                  </button>
               </div>
            </div>

            <div className="flex gap-4 md:gap-6 justify-center">
               {(medicine.images || []).map((img, i) => (
                 <button 
                   key={i} 
                   onClick={() => setActiveImg(i)}
                   className={`h-16 w-16 md:h-24 md:w-24 rounded-2xl md:rounded-3xl overflow-hidden border-2 transition-all duration-500 p-1 bg-white ${activeImg === i ? 'border-brand-teal shadow-mint scale-105' : 'border-transparent grayscale opacity-40'}`}
                 >
                    <img src={normalizeUrl(img)} className="w-full h-full object-cover rounded-xl" alt="thumbnail" />
                 </button>
               ))}
            </div>
         </div>

         {/* RIGHT — Product Details Matrix */}
         <div className="lg:col-span-6 space-y-8 md:space-y-12">
            <div className="space-y-4 md:space-y-6">
               <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 md:px-6 py-2 bg-brand-teal/5 text-brand-teal text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-brand-teal/10 rounded-xl flex items-center gap-2">
                     <Pill size={12}/> {medicine.category}
                  </div>
                  {medicine.requiresRx && (
                     <div className="px-4 md:px-6 py-2 bg-purple-50 text-purple-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-purple-100 rounded-xl flex items-center gap-2">
                        <FileText size={12}/> PRESCRIPTION REQUIRED
                     </div>
                  )}
               </div>

               <div className="space-y-2">
                  <div className="text-gray-400 font-dm font-bold italic text-base md:text-xl">{medicine.brand}</div>
                  <h1 className="font-syne font-black text-3xl md:text-6xl text-[#0a1628] leading-[0.9] tracking-tighter uppercase italic">{medicine.name}</h1>
                  <div className="text-brand-teal font-dm font-black italic text-lg md:text-2xl uppercase tracking-tighter opacity-60">FORMULA: {medicine.generic}</div>
               </div>
            </div>

            <div className="space-y-8 md:space-y-10 bg-white border border-black/[0.03] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-soft">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-1 md:space-y-2">
                     <div className="text-[9px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Price</div>
                     <div className="flex items-center gap-4 md:gap-6">
                        <span className="font-syne font-black text-teal-600 text-4xl md:text-6xl italic leading-none uppercase tracking-tighter select-none">₹{medicine.price}</span>
                        {medicine.mrp > medicine.price && (
                           <div className="flex flex-col">
                              <span className="text-gray-200 line-through font-dm italic text-base md:text-2xl font-bold leading-none select-none">₹{medicine.mrp}</span>
                              <span className="text-red-500 font-syne font-black italic text-[8px] md:text-[9px] uppercase pt-1 tracking-widest">{medicine.discount}% OFF</span>
                           </div>
                        )}
                     </div>
                  </div>
                  <div className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 md:gap-2 self-start md:self-auto ${medicine.stock > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                     <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${medicine.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                     {medicine.stock > 0 ? `${medicine.stock} IN STOCK` : 'UNAVAILABLE'}
                  </div>
               </div>

               <Link to={`/pharmacies/${pharmacyId}`} className="block">
                  <div className="flex items-center gap-4 md:gap-6 p-6 md:p-8 bg-gray-50/50 rounded-[2rem] border border-black/[0.02] group transition-all duration-700">
                     <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-inner text-brand-teal group-hover:bg-[#0a1628] transition-all shrink-0">
                        <Store size={20}/>
                     </div>
                     <div className="flex-1">
                        <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic leading-none">Sold by</div>
                        <div className="font-syne font-black text-[#0a1628] text-lg uppercase italic group-hover:text-brand-teal transition-colors tracking-tighter truncate">{medicine.pharmacyName}</div>
                     </div>
                     <ChevronRight size={16} className="text-gray-200 group-hover:text-brand-teal group-hover:translate-x-2 transition-all" />
                  </div>
               </Link>

               <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                  <div className="h-14 md:h-20 bg-gray-50 border border-black/[0.03] rounded-xl md:rounded-[2.2rem] flex items-center px-6 md:px-10 justify-between md:gap-10">
                     <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-gray-400 hover:text-navy"><Minus size={18}/></button>
                     <span className="font-syne font-black text-lg md:text-2xl text-navy italic w-8 text-center">{qty}</span>
                     <button onClick={() => setQty(Math.min(10, qty + 1))} className="text-gray-400 hover:text-navy"><Plus size={18}/></button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 h-14 md:h-20 bg-navy text-teal-400 font-syne font-black text-[9px] md:text-xs uppercase italic tracking-[0.2em] rounded-xl md:rounded-[2.2rem] shadow-xl hover:bg-teal-500 hover:text-navy transition-all flex items-center justify-center gap-3 md:gap-4"
                  >
                     <ShoppingBag size={18} className="md:size-5"/> ADD TO CART
                  </button>
               </div>
            </div>

            <div className="bg-[#0a1628] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 text-white space-y-6 md:space-y-8 shadow-4xl border-l-[12px] md:border-l-[16px] border-l-brand-teal relative overflow-hidden">
               <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-5 rounded-full blur-[80px]" />
               <div className="flex items-center gap-6 relative z-10">
                  <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-brand-teal">
                     <Truck size={24}/>
                  </div>
                  <h4 className="font-syne font-black text-xl md:text-2xl uppercase italic tracking-tighter">Delivery Details</h4>
               </div>
               <div className="space-y-4 relative z-10">
                  <p className="text-white/60 font-dm font-bold italic text-base md:text-lg leading-relaxed">
                     Delivery from <span className="text-brand-teal">{medicine.pharmacyName}</span> confirmed for <span className="text-white">TODAY 6PM</span> via Delivery Team.
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Accordions */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-32 space-y-4 md:space-y-8">
         {[
            { title: 'Description', content: medicine.description, icon: Info },
            { title: 'How to use', content: medicine.dosage, icon: Zap },
            { title: 'Storage Info', content: medicine.storage, icon: ShieldCheck }
         ].map(section => (
            <div key={section.title} className="bg-white border border-black/[0.03] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-soft">
               <button 
                 onClick={() => toggleAccordion(section.title)}
                 className="w-full h-20 md:h-24 px-8 md:px-12 flex items-center justify-between group"
               >
                  <div className="flex items-center gap-4 md:gap-6">
                     <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-teal group-hover:bg-[#0a1628] transition-all"><section.icon size={18}/></div>
                     <span className="font-syne font-black text-base md:text-xl text-[#0a1628] uppercase italic tracking-tighter">{section.title}</span>
                  </div>
                  <ChevronRight size={20} className={`text-gray-200 transition-all transform ${openAccordions.includes(section.title) ? 'rotate-90 text-brand-teal' : ''}`} />
               </button>
               <AnimatePresence>
                  {openAccordions.includes(section.title) && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                       <div className="px-8 md:px-12 pb-8 md:pb-12 pt-2 text-gray-400 font-dm font-bold italic text-lg leading-relaxed">{section.content}</div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         ))}
      </section>

       {/* Sticky Quick-Action Bar Node */}
       <AnimatePresence>
          <motion.div 
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            className="fixed bottom-[80px] md:hidden inset-x-4 z-[100] bg-navy h-20 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between px-6 gap-6"
          >
             <div className="flex flex-col">
                <div className="text-[8px] font-black text-white/30 uppercase italic tracking-widest">Price</div>
                <div className="font-syne font-black text-teal-400 text-2xl italic leading-none select-none">₹{medicine.price}</div>
             </div>
             <button 
               onClick={handleAddToCart}
               className="flex-1 h-12 bg-teal-500 text-navy font-syne font-black text-[9px] uppercase italic tracking-widest rounded-xl shadow-lg active:scale-95 transition-all"
             >
                ADD TO CART
             </button>
          </motion.div>
       </AnimatePresence>
    </div>
  );
}
