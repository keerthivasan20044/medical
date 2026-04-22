import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Pill, Users, Truck, Store, MapPin, ChevronRight, ArrowRight, Activity, Zap, Cpu, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { systemService } from '../../services/apiServices.js';

const DEFAULT_STATS = [
  { icon: Store, num: 50, label: 'statsPharmacies', suffix: '+' },
  { icon: Pill, num: 5000, label: 'statsMedicines', suffix: '+' },
  { icon: Truck, num: 30, label: 'statsDelivery', suffix: '' },
  { icon: Users, num: 10, label: 'statsCustomers', suffix: 'K+' }
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
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await systemService.getStats();
        if (data) {
           setStats([
             { icon: Store, num: 8, label: 'statsPharmacies', suffix: '' },
             { icon: Pill, num: 5000, label: 'statsMedicines', suffix: '+' },
             { icon: Truck, num: 22, label: 'statsDelivery', suffix: 'min' },
             { icon: Users, num: 10, label: 'statsCustomers', suffix: 'K+' }
           ]);
        }
      } catch (e) {} finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="bg-[#0a1628] py-12 md:py-16 relative overflow-hidden">
      {/* Background HUD Graphics */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-brand-teal/5 rounded-full blur-[200px] opacity-20" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 w-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] md:rounded-[4rem] overflow-hidden backdrop-blur-3xl shadow-4xl group/stats">
           {stats.map((s, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1, duration: 0.8 }}
               className="p-8 md:p-12 border-white/5 border-b md:border-b-0 md:border-r last:border-r-0 hover:bg-brand-teal/5 transition-all duration-700 group text-center lg:text-left relative overflow-hidden"
             >
                {/* Micro-Interaction Shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 relative z-10">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 justify-center lg:justify-start">
                         <div className="h-12 w-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-500 shadow-inner group-hover:rotate-12">
                            <s.icon size={22} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] group-hover:text-brand-teal transition-colors italic pr-16">{t(s.label)}</h4>
                            <div className="h-1 w-8 bg-brand-teal/20 rounded-full group-hover:w-full transition-all duration-700" />
                         </div>
                      </div>
                      <div className="font-syne font-black text-white text-6xl md:text-7xl tracking-tighter group-hover:translate-x-4 transition-transform duration-700 leading-none italic shadow-brand-teal/20">
                         <Counter value={s.num} suffix={s.suffix} />
                      </div>
                   </div>
                   <div className="hidden lg:block shrink-0 px-6">
                      <div className="h-20 w-1.5 bg-white/5 rounded-full overflow-hidden relative">
                         <motion.div 
                            animate={{ y: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: i * 0.5 }}
                            className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent via-brand-teal to-transparent shadow-[0_0_15px_#02C39A]"
                         />
                      </div>
                   </div>
                </div>
                
                {/* HUD Data Text */}
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <Activity size={12} className="text-brand-teal animate-pulse" />
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] italic">Live: Store 0{i+1}</span>
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
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/[0.03] rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#028090]/[0.03] rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 border-l-8 border-brand-teal pl-6 md:pl-10">
            <div className="space-y-6">
               <h2 className="font-syne font-black text-[#0a1628] text-4xl md:text-5xl lg:text-7xl leading-tight uppercase italic tracking-tighter text-center lg:text-left w-full px-4 break-words">
                  Shop by Category
               </h2>
               <p className="text-gray-400 font-dm text-xl max-w-xl italic font-bold leading-relaxed">Browse our curated health categories.</p>
            </div>
             <Link to="/medicines" className="group flex items-center justify-center lg:justify-start gap-4 md:gap-6 font-syne font-black text-lg md:text-xl uppercase italic tracking-widest text-[#0a1628] hover:text-brand-teal transition-all duration-500 bg-gray-50 px-8 py-4 md:px-10 md:py-5 rounded-[1.5rem] md:rounded-[2rem] hover:shadow-4xl">
               {t('exploreCatalog')} <ArrowRight className="group-hover:translate-x-4 transition-transform duration-500 text-brand-teal" />
            </Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className={`group relative ${c.bg} rounded-[3.5rem] p-10 border-4 border-white shadow-3xl hover:shadow-4xl transition-all duration-700 overflow-hidden h-96 flex flex-col justify-between`}
              >
                 {/* Category Background Icon */}
                 <div className="absolute -right-10 -top-10 text-[180px] opacity-[0.03] group-hover:rotate-12 group-hover:scale-125 transition-all duration-1000 select-none">
                    {c.icon}
                 </div>

                 <div className="relative z-10 space-y-4">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-black/[0.03] group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                       {c.icon}
                    </div>
                    <div>
                       <h3 className="font-syne font-black text-[#0a1628] text-3xl uppercase italic tracking-tighter leading-none">{c.name}</h3>
                       <div className="flex items-center gap-2 mt-2">
                          <div className="h-1 w-8 bg-[#0a1628]/10 rounded-full group-hover:bg-brand-teal group-hover:w-full transition-all duration-700" />
                          <p className="text-gray-400 font-syne font-black uppercase text-[10px] tracking-widest italic whitespace-nowrap">{c.count}</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="relative z-10 flex items-center justify-between">
                    <Link to={`/medicines?category=${c.name}`} className="h-14 px-8 bg-white rounded-2xl flex items-center justify-center text-[#0a1628] font-syne font-black uppercase italic tracking-widest text-[10px] shadow-2xl hover:bg-[#0a1628] hover:text-white transition-all duration-500 group-hover:translate-x-2">
                       Shop Now
                    </Link>
                    <div className="h-10 w-10 bg-[#0a1628]/5 rounded-full flex items-center justify-center text-[#0a1628]/20 group-hover:text-brand-teal transition-colors">
                       <Database size={18} />
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}
