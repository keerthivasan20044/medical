import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, Clock, Gift, ShoppingBag, Store, 
  MapPin, CheckCircle, ChevronRight, Copy, 
  ArrowRight, Heart, Sparkles, Filter, 
  Percent, Zap, Info, Share2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext.jsx';

const OFFERS = [
  { id: 1, pharmacy: 'Apollo Pharmacy', title: 'Buy ₹500 worth → FREE delivery', sub: 'No delivery fee', valid: 'Today only', code: 'APOLLO500', category: 'Medicines', color: 'from-[#028090] to-teal-500' },
  { id: 2, pharmacy: 'MedPlus', title: '20% off on Diabetes medicines', sub: 'Metformin, Glipizide, Januvia...', valid: 'This weekend', code: 'DIABCARE20', category: 'Medicines', color: 'from-blue-600 to-indigo-500' },
  { id: 3, pharmacy: 'Sri Murugan Medical', title: 'Flat ₹50 off on orders above ₹300', sub: 'Applicable on all products', valid: 'Ends 30 Mar', code: 'MURUGAN50', category: 'All', color: 'from-[#0a1628] to-slate-800' },
  { id: 4, pharmacy: 'Life Care Medicals', title: 'Buy 2 Vitamin packs get 1 FREE', sub: 'Multivitamins & Omega-3', valid: 'Till 31 Mar', category: 'Vitamins', color: 'from-orange-500 to-amber-500' },
  { id: 5, pharmacy: 'Karaikal Central', title: 'Night owl discount — 10% off', sub: 'Applicable from 10PM–6AM', valid: 'Daily', code: 'NIGHTKK10', category: 'All', color: 'from-indigo-900 to-purple-800' },
  { id: 6, pharmacy: 'Grace Pharmacy (Nagore)', title: 'Free delivery to Nagore area', sub: 'For orders above ₹200', valid: 'This week', code: 'NAGOREFREE', category: 'All', color: 'from-emerald-600 to-teal-400' },
  { id: 7, pharmacy: 'Sri Dhanvantri', title: '15% off on Inhalers', sub: 'Asthma Care', valid: 'Until 28 Mar', code: 'BREATHE15', category: 'Medicines', color: 'from-[#02C39A] to-[#028090]' },
  { id: 8, pharmacy: 'Life Care', title: '25% off on Child Vaccines', sub: 'Flu, Hep-B, Pneumococcal', valid: 'This month', code: 'VAXKID25', category: 'Vaccines', color: 'from-rose-500 to-pink-500' },
  { id: 9, pharmacy: 'MK Medical Kitchen', title: 'Buy 1 Get 1 on Skin Care', sub: 'Moisturizers & Sunscreens', valid: 'Weekend special', category: 'Baby Care', color: 'from-[#0a1628] to-teal-900' },
  { id: 10, pharmacy: 'Sri Murugan', title: 'Flat ₹100 cashback on UPI', sub: 'On orders above ₹1000', valid: 'Limited time', code: 'UPIKKL100', category: 'All', color: 'from-[#028090] to-blue-500' },
  { id: 11, pharmacy: 'Apollo Pharmacy', title: 'Free First Aid Kit', sub: 'On orders above ₹1500', valid: 'While stock lasts', category: 'All', color: 'from-teal-600 to-[#0a1628]' },
  { id: 12, pharmacy: 'MedPlus', title: '30% off on Baby Diapers', sub: 'Huggies & Pampers', valid: 'Today', code: 'BABY30', category: 'Baby Care', color: 'from-sky-500 to-indigo-400' }
];

const PROMO_CODES = [
  { code: 'FIRST50', desc: '₹50 off first order', details: 'Min. order ₹300' },
  { code: 'KARAIKAL20', desc: '20% off (max ₹100) for locals', details: 'Valid on all medicines' },
  { code: 'VACCINE25', desc: '25% off on all vaccine bookings', details: 'Online booking only' },
  { code: 'MEDIAPP10', desc: '10% off on app orders', details: 'Limited time offer' }
];

export default function Offers() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('All');
  const [timeLeft, setTimeLeft] = useState(15795); // 04:23:15 in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(t('codeCopied', { code }));
  };

  const filteredOffers = activeTab === 'All' ? OFFERS : OFFERS.filter(o => o.category === activeTab);

  return (
    <div className="bg-white min-h-screen pb-20 pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-500 py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid opacity-10" />
         <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
            <h1 className="font-syne font-black text-6xl md:text-8xl text-white tracking-tighter drop-shadow-2xl">{t('todaysBestOffers').split(' ').slice(0,-2).join(' ')} <br /><span className="text-orange-200">{t('todaysBestOffers').split(' ').slice(-2).join(' ')}</span></h1>
            <p className="text-white/80 font-dm text-lg md:text-2xl max-w-2xl mx-auto italic">{t('offersHeroDesc')}</p>
         </div>
         <div className="absolute -bottom-8 -left-8 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
         <div className="absolute -top-8 -right-8 h-64 w-64 bg-orange-200/20 rounded-full blur-3xl" />
      </section>

      {/* Deal of the Day Banner */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
         <div className="bg-[#0a1628] rounded-[4rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-3xl overflow-hidden group">
            <div className="absolute top-0 right-0 h-48 w-48 bg-[#028090] rounded-full blur-[100px] opacity-20" />
            <div className="space-y-6 relative z-10">
               <div className="bg-orange-500 text-white text-[10px] font-black px-6 py-2 rounded-full inline-flex items-center gap-2 uppercase tracking-widest shadow-xl animate-pulse">
                  <Zap size={14} /> Flash Sale
               </div>
               <h2 className="font-syne font-black text-4xl md:text-6xl text-white leading-tight">{t('discountVitamins').split(' ').slice(0,3).join(' ')} <br /><span className="text-[#02C39A]">{t('discountVitamins').split(' ').slice(3).join(' ')}</span></h2>
            </div>
            
            <div className="flex flex-col items-center gap-6 relative z-10">
               <div className="text-center space-y-2">
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{t('timeRemaining')}</div>
                  <div className="font-syne font-black text-5xl md:text-7xl text-white tracking-[0.2em]">{formatTime(timeLeft)}</div>
               </div>
               <button className="px-16 py-6 bg-white text-[#0a1628] rounded-full font-syne font-black text-lg uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-white/10 shadow-2xl">
                  {t('shopAllVitamins')} &rarr;
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 space-y-16">
         {/* Filter Tabs */}
         <div className="flex flex-wrap items-center justify-center gap-3">
            {['All', 'Medicines', 'Vaccines', 'Vitamins', 'Baby Care'].map(cat => (
               <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-[#0a1628] text-white shadow-2xl scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
               >
                  {cat}
               </button>
            ))}
         </div>

         {/* Offer Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
               {filteredOffers.map((offer, idx) => (
                  <motion.div
                     layout
                     key={offer.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ delay: idx * 0.05 }}
                     className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-3xl hover:-translate-y-2 transition-all duration-500"
                  >
                     <div className={`h-48 bg-gradient-to-br p-10 flex flex-col justify-between ${offer.color}`}>
                        <div className="flex justify-between items-start">
                           <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-white"><ShoppingBag size={24}/></div>
                           <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">{offer.category}</div>
                        </div>
                        <h3 className="text-white font-syne font-black text-2xl leading-tight">{offer.pharmacy}</h3>
                     </div>
                     <div className="p-10 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-2">
                           <h4 className="font-syne font-black text-xl text-[#0a1628]">{offer.title}</h4>
                           <p className="text-sm font-dm text-gray-400 italic">{offer.sub}</p>
                        </div>
                        <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <div className="flex items-center gap-2 text-[#028090]"><Clock size={14}/> {offer.valid}</div>
                           {offer.code && <div className="text-gray-300">Code: <span className="text-[#0a1628]">{offer.code}</span></div>}
                        </div>
                        <div className="mt-auto pt-6 flex gap-3">
                           {offer.code ? (
                              <button 
                                 onClick={() => copyCode(offer.code)}
                                 className="flex-1 py-4 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition flex items-center justify-center gap-3"
                              >
                                 <Copy size={16} /> {t('copyCodeLabel')}
                              </button>
                           ) : (
                              <button className="flex-1 py-4 bg-[#0a1628] text-white rounded-2xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition flex items-center justify-center gap-3">
                                 {t('viewProduct')}
                              </button>
                           )}
                           <button className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition"><Heart size={20} /></button>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
         </div>

         {/* Promo Codes Section */}
         <section className="py-24 space-y-12">
            <div className="text-center space-y-2">
               <h2 className="font-syne font-black text-5xl text-[#0a1628]">Promo Codes</h2>
               <p className="text-gray-400 font-dm italic">Use these codes at checkout for extra savings.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               {PROMO_CODES.map((promo, i) => (
                  <motion.div 
                     key={promo.code}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     className="bg-[#f8fafc] border-2 border-dashed border-gray-100 rounded-[3rem] p-10 text-center space-y-6 hover:border-[#02C39A] transition-all group"
                  >
                     <div className="space-y-2">
                        <div className="text-[10px] font-black text-[#028090] uppercase tracking-widest">{t(promo.details) || promo.details}</div>
                        <div className="font-syne font-black text-3xl text-[#0a1628] group-hover:scale-110 transition">{promo.code}</div>
                     </div>
                     <p className="text-sm font-dm text-gray-400 italic leading-relaxed">{t(promo.desc) || promo.desc}</p>
                     <button onClick={() => copyCode(promo.code)} className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition shadow-sm">{t('copyCodeLabel')}</button>
                  </motion.div>
               ))}
            </div>
         </section>
      </div>
    </div>
  );
}
