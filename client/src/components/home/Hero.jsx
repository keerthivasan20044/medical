import { Search, MapPin, ArrowRight, Star, Pill, Package, Truck, Zap, Activity, Cpu, Globe, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

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
    <section className="relative min-h-[90vh] lg:min-h-screen bg-[#0a1628] flex items-center overflow-hidden">
      {/* Background Enhancements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e3a5f_0%,#0a1628_70%)] opacity-80" />
      
      {/* Mesh Gradients (Command Center Aesthetic) */}
      <div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] bg-brand-teal rounded-full blur-[250px] opacity-[0.08]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[1000px] w-[1000px] bg-[#028090] rounded-full blur-[250px] opacity-[0.1]" />
      <div className="absolute top-[30%] left-[40%] h-[600px] w-[600px] bg-blue-500 rounded-full blur-[200px] opacity-5" />

      {/* Grid Pattern (Technical HUD Overlay) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Animated Biometric Particles */}
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
        {/* Left Side: Mission Control Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#0a1628]/40 border-2 border-brand-teal/20 rounded-full backdrop-blur-3xl shadow-4xl group mx-auto lg:mx-0">
             <div className="relative">
                <div className="h-3 w-3 bg-brand-teal rounded-full animate-ping opacity-75" />
                <div className="absolute inset-0 h-3 w-3 bg-brand-teal rounded-full shadow-[0_0_15px_#02C39A]" />
             </div>
             <span className="text-white font-syne font-black text-[10px] md:text-[12px] uppercase tracking-[0.4em] italic drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {t('activePharmacies') || 'Active Pharmacies'} <span className="text-brand-teal ml-2">12</span> {t('partnersOnline') || 'Partners Online'}
             </span>
          </div>

          <div className="space-y-4 md:space-y-6">
             <h1 className="font-syne font-black text-white text-[clamp(2.3rem,10vw,4rem)] md:text-[clamp(3.5rem,10vw,8rem)] leading-[1.05] md:leading-[0.95] uppercase italic tracking-tighter text-center lg:text-left transition-all break-words w-full max-w-full px-2 md:px-0">
                {t('heroTitle').split(' ').slice(0, -1).join(' ')} <br />
                <span className="text-brand-teal drop-shadow-[0_0_20px_rgba(2,195,154,0.3)]">
                   {t('heroTitle').split(' ').slice(-1)}
                </span> <br />
                <span className="text-white/40 text-[0.3em] md:text-[0.45em] tracking-normal lowercase opacity-70 leading-tight block mt-6 md:mt-2 px-6 lg:px-0">
                   {t('heroSubtitle')}
                </span>
             </h1>
          </div>



          <p className="text-gray-300 font-dm text-lg md:text-xl lg:text-2xl max-w-xl leading-[1.6] italic font-bold text-center lg:text-left mx-auto lg:mx-0 transition-colors hover:text-white duration-500">
             {t('heroDesc')}
          </p>

          <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
             {['🟢 12 ACTIVE SHOPS', '🚴 22min DELIVERY', '💊 5,000 MEDICINES'].map((label, idx) => (
                <div key={idx} className="px-4 py-2 md:px-6 md:py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-brand-teal uppercase tracking-[0.3em] backdrop-blur-3xl italic group hover:border-brand-teal/40 hover:bg-brand-teal/5 transition-all duration-500">
                   {label}
                </div>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
             <Link to="/medicines" className="px-8 py-5 md:px-12 md:py-6 bg-brand-teal text-[#0a1628] font-syne font-black text-base md:text-lg uppercase italic tracking-widest rounded-[1.5rem] md:rounded-[2rem] shadow-4xl shadow-brand-teal/30 hover:scale-[1.05] active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                {t('orderNow')} <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
             </Link>
             <Link to="/pharmacies" className="px-8 py-5 md:px-12 md:py-6 bg-white/5 border border-white/10 text-white font-syne font-black text-base md:text-lg uppercase italic tracking-widest rounded-[1.5rem] md:rounded-[2rem] backdrop-blur-3xl flex items-center justify-center gap-4 hover:bg-white/10 hover:border-brand-teal/30 transition-all duration-500">
                <MapPin size={20} className="text-brand-teal" /> {t('findNear')}
             </Link>
          </div>

          {/* Biometric Search Terminal - Stable, non-breaking design */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-2 md:p-3 rounded-[2rem] md:rounded-[2.5rem] shadow-4xl max-w-2xl flex flex-col md:flex-row gap-2 relative z-50 group/terminal hover:border-brand-teal/20 transition-all duration-700">
             <div className="flex-1 flex items-center gap-4 px-6 py-4 md:py-5">
               <div className="h-10 w-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal shrink-0">
                  <Activity size={18} />
               </div>
               <input 
                  type="text" 
                  placeholder={t('searchPlaceholder')} 
                  className="bg-transparent border-none outline-none text-white w-full font-syne font-black text-sm md:text-base placeholder:text-white/20 uppercase italic tracking-tighter"
               />
             </div>
             <button className="px-8 py-4 md:py-5 bg-brand-teal text-[#0a1628] font-syne font-black text-xs md:text-sm uppercase italic tracking-widest rounded-[1.2rem] md:rounded-[1.8rem] hover:shadow-mint transition-all duration-500 shrink-0">
                {t('locate')}
             </button>
          </div>

          {/* District Trust Telemetry */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 pt-8 text-center md:text-left">
             <div className="flex -space-x-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="h-12 w-12 rounded-full border-4 border-[#0a1628] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110 hover:z-20 relative ring-4 ring-brand-teal/10">
                    <img src={`https://i.pravatar.cc/150?u=user${i}`} className="h-full w-full object-cover" alt="Node User" />
                 </div>
               ))}
               <div className="h-12 w-12 rounded-full border-4 border-[#0a1628] bg-brand-teal flex items-center justify-center text-[#0a1628] font-black text-[10px] z-10 ring-4 ring-brand-teal/10">+K</div>
             </div>
             <div className="space-y-1">
                <div className="text-base font-syne font-black text-white uppercase italic tracking-tighter">{t('districtTrusted')}</div>
                <div className="flex items-center gap-3 text-brand-teal font-black text-[9px] uppercase tracking-[0.2em] italic">
                   <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                   </div>
                   <span>{t('topRatedNode')}</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Right Side: District Network Map (Artistic HUD) */}
        <div className="relative hidden lg:flex flex-col items-center justify-center h-[700px] w-full">
           {/* HUD Ring Decorations */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-brand-teal/10 rounded-full animate-spin-slow" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-brand-teal/5 rounded-full animate-reverse-spin" />

           {/* Mission Critical Badges */}
           <FloatingBadge icon={HeartPulse} text={t('deliveryActive') || 'Delivery Active'} pos="top-0 right-0" delay={0} />
           <FloatingBadge icon={Cpu} text={t('instantConnection') || 'Instant Connection'} pos="top-[40%] left-[-10%]" delay={1} />
           <FloatingBadge icon={Zap} text={t('swiftEmergencySupport') || 'Swift Emergency Support'} pos="bottom-[10%] right-[10%]" delay={2} />

           {/* Pharmacy Node Network Visualization */}
           <div className="grid grid-cols-2 gap-10 w-full h-full p-20 relative z-20">
              {PHARMACIES.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: i % 2 === 0 ? -15 : 15 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1 + (i * 0.2), duration: 0.8 }}
                  whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? -5 : 5, zIndex: 50 }}
                  className={`${p.rot} ${p.mt || ''} bg-white/5 backdrop-blur-3xl rounded-[3rem] p-6 shadow-4xl w-full aspect-square flex flex-col justify-between overflow-hidden border-2 border-white/5 group hover:border-brand-teal/40 transition-all duration-700`}
                >
                   <div className="h-2/3 rounded-[2.5rem] overflow-hidden relative shadow-inner">
                      <img src={p.img} alt={p.name} className="h-full w-full object-cover group-hover:scale-125 transition duration-1000 grayscale group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute top-4 right-4 bg-brand-teal text-[#0a1628] text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl uppercase italic tracking-widest animate-pulse">
                         {t('storeVerified') || 'Store Verified'}
                      </div>
                   </div>
                   <div className="pt-6 space-y-2">
                      <h4 className="font-syne font-black text-white text-lg uppercase italic tracking-tighter truncate group-hover:text-brand-teal transition-colors">{p.name}</h4>
                      <div className="flex items-center justify-between text-[10px] font-syne font-black text-white/40 uppercase tracking-widest italic leading-none">
                         <span>{p.area}</span>
                         <span className="text-brand-teal">{p.dist}</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-400 text-[10px] font-black italic">
                         <Star size={12} fill="currentColor" /> {p.rating} <span className="text-white/20 ml-2">VERIFIED</span>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>

      {/* Technical Footer Wave (Mesh Architecture) */}
      <div className="absolute bottom-0 left-0 w-full h-[120px] overflow-hidden pointer-events-none">
        <svg className="relative block w-full h-full fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
           <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.43,147.3,126.37,219.89,113.13c79.47-14.4,142.3-45.92,219.89-63Z" />
        </svg>
      </div>
    </section>
  );
}
