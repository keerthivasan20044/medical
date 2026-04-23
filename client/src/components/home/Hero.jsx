import { Search, MapPin, ArrowRight, Star, Pill, Package, Truck, Zap, Activity, Cpu, Globe, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const CheckCircle = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const PHARMACIES = [
  { id: 1, name: 'Apollo Pharmacy', area: 'New Colony', rating: 4.7, status: 'Open', dist: '0.8km', rot: '-rotate-2', img: '/assets/pharmacy_pro.png' },
  { id: 2, name: 'MedPlus', area: 'Collectorate St', rating: 4.5, status: 'Open', dist: '1.2km', rot: 'rotate-1', mt: 'mt-6', img: '/assets/pharmacy_pro.png' },
  { id: 3, name: 'Sri Murugan Medical', area: 'Bus Stand', rating: 4.9, status: '24hr', dist: '0.5km', rot: 'rotate-2', img: '/assets/pharmacy_pro.png' },
  { id: 4, name: 'Life Care', area: 'Poompuhar St', rating: 4.6, status: 'Open', dist: '2.1km', rot: '-rotate-1', mt: '-mt-4', img: '/assets/pharmacy_pro.png' }
];

const FloatingBadge = ({ icon: Icon, text, pos, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ repeat: Infinity, repeatType: "reverse", duration: 3, delay }}
    className={`absolute ${pos} bg-white/10 backdrop-blur-3xl border border-white/20 px-6 py-3.5 rounded-[2rem] flex items-center gap-4 shadow-4xl z-20 group`}
  >
     <div className="h-10 w-10 rounded-xl bg-brand-teal/20 text-brand-teal flex items-center justify-center group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-500 shadow-inner"><Icon size={20} /></div>
     <span className="text-white text-[11px] font-black font-syne whitespace-nowrap uppercase tracking-[0.3em] italic group-hover:text-brand-teal transition-colors">{text}</span>
  </motion.div>
);

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section 
       className="relative min-h-[90vh] lg:min-h-screen bg-[#0a1628] flex items-center overflow-hidden w-full pt-16 md:pt-20 lg:pt-0"
       style={{ maxWidth: '100vw' }}
    >
      {/* Background Enhancements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e3a5f_0%,#0a1628_70%)] opacity-80" />
      
      {/* Design Elements (Modern Medical Style) */}
      <div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] bg-brand-teal rounded-full blur-[250px] opacity-[0.08]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[1000px] w-[1000px] bg-[#028090] rounded-full blur-[250px] opacity-[0.1]" />
      <div className="absolute top-[30%] left-[40%] h-[600px] w-[600px] bg-blue-500 rounded-full blur-[200px] opacity-5" />

      {/* Grid Pattern (Interface Grid) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Animated Health Particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [-20, -150, -20], 
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 10 + Math.random() * 10, 
            delay: Math.random() * 10 
          }}
          className="absolute h-1.5 w-1.5 bg-brand-teal/30 rounded-full shadow-[0_0_10px_#02C39A]"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%` 
          }}
        />
      ))}

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 md:py-32 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 relative z-10 w-full items-center">
        {/* Left Side: Main Dashboard */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-2 rounded-full w-fit">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <div>
              <p className="text-white font-bold text-sm">12 Active Pharmacies</p>
              <p className="text-gray-400 text-xs">Available Now</p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6 w-full overflow-hidden px-5 pt-6 pb-4">
             <h1
               className="font-black text-white leading-[0.9]"
               style={{
                 fontSize: 'clamp(2.4rem, 7vw, 5rem)',
                 wordBreak: 'normal',
                 overflowWrap: 'normal',
                 hyphens: 'none',
                 whiteSpace: 'normal'
               }}
             >
               Order Medicines Online Today
             </h1>
             <p className="text-teal-400 italic text-sm mt-2 w-full truncate">
                karaikal medicine hub
             </p>
          </div>



          <p 
             className="text-gray-300 text-sm text-center leading-relaxed w-full px-6 font-dm italic font-bold lg:text-left lg:px-0"
             style={{ maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word' }}
          >
             Order medicines from trusted local pharmacies. Fast delivery to your door across Karaikal, Nagore, and Poompuhar.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-2 px-4 w-full">
             <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white">
                🟢 12 Active Shops
             </span>
             <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white">
                🚴 22 Min Delivery
             </span>
             <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-white">
                💊 5,000 Medicines
             </span>
          </div>

          <div className="px-4 w-full flex flex-col gap-4">
             <Link 
                to="/medicines" 
                className="w-full bg-brand-teal text-[#0a1628] font-syne font-black py-5 rounded-2xl flex items-center justify-center gap-2 text-base uppercase italic tracking-widest shadow-4xl shadow-brand-teal/30 hover:scale-[1.02] active:scale-95 transition-all"
                style={{ maxWidth: '100%' }}
             >
                Start Shopping <ArrowRight size={18} className="flex-shrink-0" />
             </Link>
             <Link to="/pharmacies" className="w-full border-2 border-white/10 text-white font-syne font-black py-5 rounded-2xl flex items-center justify-center gap-4 text-base uppercase italic tracking-widest backdrop-blur-3xl hover:bg-white/5 transition-all">
                <MapPin size={20} className="text-brand-teal" /> Find Shops
             </Link>
          </div>

          <div className="w-full px-4 space-y-4">
             <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 w-full border border-white/10 focus-within:border-brand-teal/20 transition-all">
                <Activity size={16} className="text-teal-400 flex-shrink-0" />
                <input 
                   type="text" 
                   placeholder="Search for medicines..." 
                   className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-sm min-w-0 font-syne font-black uppercase italic tracking-tighter"
                />
             </div>
             <button className="w-full bg-brand-teal text-[#0a1628] font-syne font-black py-4 rounded-2xl text-sm uppercase italic tracking-widest hover:shadow-mint transition-all">
                Find
             </button>

             <div className="flex flex-col items-center lg:items-start gap-4 pt-4">
                <p className="text-teal-400 text-xs font-bold tracking-widest uppercase italic">TRUSTED NETWORK</p>
                <div className="flex justify-center items-center gap-2 mb-1">
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                         <span key={i} className="text-yellow-400 text-2xl">★</span>
                      ))}
                   </div>
                   <span className="text-white font-black text-xl italic ml-2">4.8 / 5</span>
                </div>
                <p className="text-gray-400 text-sm text-center w-full px-4 break-words font-bold font-dm uppercase tracking-widest">
                   1,000+ Customers in Karaikal
                </p>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Local Pharmacy Network */}
        <div className="relative hidden lg:flex flex-col items-center justify-center h-[700px] w-full overflow-hidden">
           {/* HUD Ring Decorations */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-brand-teal/10 rounded-full animate-spin-slow" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-brand-teal/5 rounded-full animate-reverse-spin" />

           {/* Service Badges */}
           <FloatingBadge icon={HeartPulse} text={t('deliveryActive') || 'Delivery Active'} pos="top-0 right-0" delay={0} />
           <FloatingBadge icon={Cpu} text={t('liveAssistance') || 'Live Assistance'} pos="top-[40%] left-[-10%]" delay={1} />

           {/* Pharmacy Cards — compact scrollable row */}
           <div className="relative z-20 flex gap-5 px-8 w-full justify-center flex-wrap">
              {PHARMACIES.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
                  whileHover={{ y: -6, scale: 1.04 }}
                  className="w-36 flex-shrink-0 bg-white/10 backdrop-blur rounded-2xl overflow-hidden border border-white/10 hover:border-teal-400/40 transition-all duration-500 shadow-xl"
                >
                  <img src={p.img} alt={p.name} className="w-full h-20 object-cover" />
                  <div className="p-2.5 space-y-1">
                    <p className="text-white font-black text-xs truncate">{p.name}</p>
                    <p className="text-gray-400 text-[10px] truncate">{p.area}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 text-[10px] font-bold">★ {p.rating}</span>
                      <span className="text-teal-400 text-[10px] font-bold">{p.dist}</span>
                    </div>
                    <span className="inline-block text-green-400 text-[9px] font-black uppercase tracking-wider">✓ Verified</span>
                  </div>
                </motion.div>
              ))}
           </div>

           <FloatingBadge icon={Zap} text={t('swiftEmergencySupport') || 'Swift Support'} pos="bottom-[8%] right-[8%]" delay={2} />
        </div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 w-full h-[120px] overflow-hidden pointer-events-none">
        <svg className="relative block w-full h-full fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
           <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,147.3,126.37,219.89,113.13c79.47-14.4,142.3-45.92,219.89-63Z" />
        </svg>
      </div>
    </section>
  );
}
