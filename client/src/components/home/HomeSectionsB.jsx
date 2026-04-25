import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Store, MapPin, Clock, Truck, ShieldCheck, Heart, RefreshCw, Activity, Globe, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { addToCart } from '../../store/cartSlice.js';
import { medicines as mockMedicines, pharmacies } from '../../utils/data.js';
import MedicineCard from '../medicine/MedicineCard';
import { medicineService } from '../../services/apiServices';
import { normalizeUrl } from '../../utils/url';

export function FeaturedMedicines() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { items: cartItems } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCart({
      id: item._id || item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || item.image || '/assets/medicine_default.png',
      brand: item.brand,
      qty: 1
    }));
    toast.success(`${item.name} added to cart`);
  };

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const data = await medicineService.getAll({ limit: 12 });
        setItems(data?.items?.length > 0 ? data.items : mockMedicines);
      } catch (err) {
        setItems(mockMedicines);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 4
  };

  const getResponsiveItems = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return itemsPerPage.mobile;
    if (window.innerWidth < 1024) return itemsPerPage.tablet;
    return itemsPerPage.desktop;
  };

  const [perPage, setPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => setPerPage(getResponsiveItems());
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(items.length / perPage);
  const currentItems = items.slice(currentPage * perPage, (currentPage + 1) * perPage);

  return (
    <section className="py-8 md:py-16 bg-[#f8fafc] overflow-hidden min-h-[800px] flex flex-col justify-center relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0a1628 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 border-l-8 border-brand-teal pl-10">
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className={`h-4 w-4 rounded-full shadow-[0_0_10px_rgba(2,195,154,0.5)] ${loading ? 'bg-amber-500 animate-pulse' : 'bg-brand-teal'}`} />
                 <span className="text-[12px] font-black text-brand-teal uppercase tracking-[0.4em] italic">{t('openNow') || 'Open Now'}</span>
              </div>
              <h2 className="font-syne font-black text-[#0a1628] text-5xl md:text-7xl leading-[0.9] uppercase italic tracking-tighter">
                {(t('popularMeds') || '').includes('.') ? t('popularMeds').split('.').slice(0, -1).join('.') : t('popularMeds')} <span className="text-brand-teal">.</span>
              </h2>
              <p className="text-gray-400 font-dm text-xl max-w-xl italic font-bold leading-relaxed">{t('browseCuratedClusters') || 'Browse our verified pharmacy products.'}</p>
           </div>
           <div className="flex gap-6">
              <button 
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                disabled={currentPage === 0}
                className="h-20 w-20 rounded-[2rem] bg-white border-2 border-black/[0.03] flex items-center justify-center text-[#0a1628] hover:bg-brand-teal hover:text-[#0a1628] hover:border-brand-teal transition-all duration-500 shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed group/btn"
              >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} 
                disabled={currentPage === totalPages - 1}
                className="h-20 w-20 rounded-[2rem] bg-white border-2 border-black/[0.03] flex items-center justify-center text-[#0a1628] hover:bg-brand-teal hover:text-[#0a1628] hover:border-brand-teal transition-all duration-500 shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed group/btn"
              >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[500px] space-y-8">
             <div className="relative">
                <div className="h-24 w-24 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                <Activity size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-teal-500 animate-pulse" />
             </div>
             <span className="text-teal-500 font-syne font-black uppercase italic tracking-[0.3em]">Connecting...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-8 px-4 md:px-0">
              {items.slice(0, 8).map((med, idx) => (
                 <MedicineCard 
                   key={med.id || med._id} 
                   item={med} 
                   index={idx} 
                   onAdd={handleAddToCart} 
                   isAdded={cartItems.some(i => i.id === (med._id || med.id))} 
                 />
              ))}
           </div>

           <div className="flex justify-center pt-8 px-4 md:px-0">
              <Link to="/medicines" className="w-full sm:w-64">
                 <button className="w-full h-14 bg-slate-900 text-teal-400 font-bold text-xs uppercase tracking-widest rounded-xl shadow-xl flex items-center justify-center gap-4 border border-white/5">
                    View All Medicines <ArrowRight size={18} />
                 </button>
              </Link>
           </div>
          </>
        )}
      </div>
    </section>
  );
}

export function KaraikalPharmacies() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  
  const TABS = ['All', 'Open Now', 'Free Delivery', 'Top Rated', '24 Hours'];

  return (
    <section className="py-8 md:py-16 bg-white relative overflow-hidden">
       {/* Background Noise & HUD */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(10,22,40,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

       <div className="max-w-7xl mx-auto px-10 relative z-10 w-full">
          <div className="text-center space-y-8 mb-24 max-w-4xl mx-auto">
             <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#0a1628] text-brand-teal rounded-full font-syne font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl">
                <Globe size={14} className="animate-spin-slow" /> {t('districtNetwork')}
             </div>
             <h2 className="font-syne font-black text-[#0a1628] text-5xl md:text-8xl leading-none uppercase italic tracking-tighter">
                {t('pharmaciesNear')}
             </h2>
             <p className="text-gray-400 font-dm text-2xl italic font-bold">{t('verifiedLicensedPharmacies')}</p>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-4 hide-scrollbar justify-start md:justify-center mb-12">
             {[
                { id: 'All', label: t('all') || 'All' },
                { id: 'Open Now', label: t('openNow') || 'Open Now' },
                { id: 'Free Delivery', label: t('freeDel') || 'Free Delivery' },
                { id: 'Top Rated', label: t('topRatedShop') || 'Top Rated' },
                { id: '24 Hours', label: '24 Hours' }
             ].map(f => (
               <button 
                 key={f.id}
                 onClick={() => setActiveTab(f.id)}
                 className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all border-2 ${
                   activeTab === f.id 
                     ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-lg' 
                     : 'bg-white text-gray-400 border-gray-100 hover:border-brand-teal/30'
                 }`}
               >
                  {f.label}
               </button>
             ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
             {pharmacies.slice(0, 6).map((p, i) => (
               <motion.div
                 key={p.id}
                 initial={{ opacity: 0, y: 40 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05, duration: 0.8 }}
                 whileHover={{ y: -20 }}
                 className="group bg-white rounded-[3.5rem] border-2 border-black/[0.03] shadow-3xl hover:shadow-4xl hover:border-brand-teal/20 transition-all duration-700 overflow-hidden flex flex-col h-full relative"
               >
                  {/* Status Overlay */}
                  <div className="h-64 relative overflow-hidden shrink-0 shadow-inner">
                     <img src={normalizeUrl(p.images?.[0] || p.image || '/assets/pharmacy_pro.png')} alt={p.name} className="h-full w-full object-cover group-hover:scale-125 transition duration-1000 grayscale group-hover:grayscale-0" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     
                     <div className="absolute top-6 right-6 flex flex-col gap-3">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-brand-teal text-[#0a1628] text-[9px] font-black px-4 py-2 rounded-xl shadow-4xl uppercase italic tracking-widest">{t('openNow')}</motion.div>
                        <div className="bg-white/10 backdrop-blur-3xl text-white text-[9px] font-black px-4 py-2 rounded-xl border border-white/20 shadow-4xl flex items-center gap-2 uppercase italic tracking-widest"><Truck size={12} className="text-brand-teal" /> {t('freeDel')}</div>
                     </div>
                  </div>

                  <div className="p-10 flex-1 flex flex-col justify-between space-y-8 relative z-10">
                     <div className="space-y-4">
                        <div className="flex items-start justify-between gap-2 w-full">
                           <h3 className="font-syne font-black text-[#0a1628] text-xl md:text-2xl uppercase italic tracking-tighter leading-tight group-hover:text-brand-teal transition-colors flex-1 min-w-0 break-words line-clamp-1">{p.name}</h3>
                           <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-400 rounded-xl text-[#0a1628] font-black text-xs shadow-xl rotate-3 ml-2">
                              <Star size={14} fill="currentColor" /> {p.rating}
                           </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-syne font-black uppercase italic tracking-widest leading-none">
                           <MapPin size={16} className="text-brand-teal animate-bounce" /> {p.location || 'Karaikal Center'} · <span className="text-brand-teal">{p.distance || '0.5'} KM</span>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {[
                              { icon: '✓', label: t('verified') || 'Verified' },
                              { icon: '🏥', label: t('verifiedShop') || 'Licensed' },
                              { icon: '🕐', label: t('openNow') || 'Open 24 Hours' }
                            ].map(badge => (
                             <span key={badge.label} className="text-[10px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full flex items-center gap-1 group-hover:bg-brand-teal group-hover:text-white transition-all">
                                {badge.icon} {badge.label}
                             </span>
                           ))}
                        </div>
                     </div>

                     <div className="pt-8 border-t-2 border-dashed border-black/[0.05] flex items-center justify-between">
                        <div className="space-y-1">
                           <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest italic leading-none">{t('licenseNumber') || 'Pharmacy ID'}</div>
                           <div className="text-[#0a1628] font-black font-syne text-sm uppercase italic tracking-tighter">PH-KKL-{33+idx}</div>
                        </div>
                        <Link to={`/pharmacies/${p.id}`} className="h-16 w-16 bg-[#0a1628] text-brand-teal rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 shadow-4xl group/link">
                           <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>

          <div className="flex justify-center mt-12">
             <Link 
               to="/pharmacies" 
               className="mx-auto bg-brand-teal text-[#0a1628] font-black py-4 px-10 rounded-full flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-brand-teal/20 uppercase tracking-widest text-sm italic"
             >
               {t('findNear') || 'View All Pharmacies'} <ArrowRight size={20} />
             </Link>
          </div>
       </div>
    </section>
  );
}
