import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Pill, Users, Truck, Store, MapPin, ChevronRight, ArrowRight, Activity, Zap, Cpu, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { systemService } from '../../services/apiServices.js';

const DEFAULT_STATS = [
  { icon: Store, num: 8, label: 'statsPharmacies', suffix: '', color: 'text-brand-teal' },
  { icon: Pill, num: 5000, label: 'statsMedicines', suffix: '+', color: 'text-blue-500' },
  { icon: Users, num: 1200, label: 'statsCustomers', suffix: '+', color: 'text-emerald-500' },
  { icon: Truck, num: 22, label: 'statsDelivery', suffix: 'm', color: 'text-amber-500' }
];

const CATEGORIES = [
  { id: 1, name: 'Tablets', count: '500+ items', bg: 'bg-blue-50', icon: '💊' },
  { id: 2, name: 'Syrups', count: '120+ items', bg: 'bg-green-50', icon: '🧴' },
  { id: 3, name: 'Vaccines', count: '45+ items', bg: 'bg-purple-50', icon: '💉' },
  { id: 4, name: 'Injections', count: '80+ items', bg: 'bg-orange-50', icon: '🩺' },
  { id: 5, name: 'Baby Care', count: '200+ items', bg: 'bg-pink-50', icon: '👶' },
  { id: 6, name: 'Ayurvedic', count: '150+ items', bg: 'bg-emerald-50', icon: '🌿' },
  { id: 7, name: 'Surgical', count: '90+ items', bg: 'bg-red-50', icon: '🩹' },
  { id: 8, name: 'Vitamins', count: '300+ items', bg: 'bg-yellow-50', icon: '⚡' }
];

const Counter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      let timer = setInterval(() => {
          start += end / (duration / 10);
          if (start >= end) {
              setCount(end);
              clearInterval(timer);
          } else {
              setCount(Math.floor(start));
          }
      }, 10);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export function StatsCounter() {
  const { t } = useLanguage();
  return (
    <section className="bg-[#0a1628] py-10 md:py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
           {DEFAULT_STATS.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] border border-black/[0.03] shadow-sm flex flex-col items-center text-center gap-3 md:gap-6 group hover:shadow-xl transition-all duration-500"
              >
                 <div className={`h-10 w-10 md:h-20 md:w-20 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center ${s.color} group-hover:bg-navy transition-all duration-500`}>
                    <s.icon size={20} className="md:size-10" />
                 </div>
                 <div className="space-y-0.5 md:space-y-2">
                    <div className="font-syne font-black text-xl md:text-5xl text-navy italic leading-none">
                       <Counter value={s.num} suffix={s.suffix} />
                    </div>
                    <div className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-tight">{t(s.label)}</div>
                 </div>
              </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}

export function Categories() {
  const { t } = useLanguage();
  return (
    <section className="py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
            <div className="space-y-6 text-center lg:text-left">
               <div className="px-5 py-2 bg-brand-teal/10 rounded-xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic mx-auto lg:mx-0">
                  <Cpu size={14} className="animate-pulse" /> {t('activeStatus') || 'Status'}
               </div>
               <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-7xl leading-tight uppercase italic tracking-tighter">
                  {t('shopCategoryTitleMain') || 'Shop by'} <span className="text-brand-teal">{t('shopCategoryTitleSub') || 'Category'}</span>
               </h2>
            </div>
            <Link to="/medicines" className="group flex items-center justify-center gap-4 font-syne font-black text-xs uppercase italic tracking-widest text-[#0a1628] bg-gray-50 px-10 py-5 rounded-2xl hover:bg-[#0a1628] hover:text-brand-teal transition-all duration-500 shadow-soft">
               {t('exploreCatalog') || 'Explore Catalog'} <ArrowRight className="group-hover:translate-x-3 transition-transform" />
            </Link>
         </div>

         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                className={`group relative ${c.bg} rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border-2 border-white shadow-soft hover:shadow-xl transition-all duration-700 overflow-hidden h-72 md:h-96 flex flex-col justify-between`}
              >
                 <div className="absolute -right-6 -top-6 text-[120px] md:text-[180px] opacity-[0.03] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000 select-none">
                    {c.icon}
                 </div>

                 <div className="relative z-10 space-y-4">
                    <div className="h-12 w-12 md:h-16 md:w-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg border border-black/[0.03] group-hover:rotate-12 transition-all">
                       {c.icon}
                    </div>
                    <div>
                       <h3 className="font-syne font-black text-[#0a1628] text-xl md:text-3xl uppercase italic tracking-tighter leading-none">{c.name}</h3>
                       <p className="text-gray-400 font-syne font-black uppercase text-[8px] md:text-[10px] tracking-widest italic mt-2">{c.count}</p>
                    </div>
                 </div>
                 
                 <div className="relative z-10">
                    <Link to={`/medicines?category=${c.name}`} className="h-12 md:h-14 px-6 md:px-8 bg-white rounded-xl md:rounded-2xl inline-flex items-center justify-center text-[#0a1628] font-syne font-black uppercase italic tracking-widest text-[9px] md:text-[10px] shadow-soft hover:bg-[#0a1628] hover:text-brand-teal transition-all">
                       {t('buyNow') || 'Shop Now'}
                    </Link>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}
