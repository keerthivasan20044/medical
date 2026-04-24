import { Search, MapPin, ArrowRight, Star, Pill, Package, Truck, Zap, Activity, Cpu, Globe, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

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
    <section className="relative min-h-[80vh] lg:min-h-screen bg-slate-900 flex items-center overflow-hidden w-full px-4 md:px-8 py-10 md:py-20">
      {/* Design Elements */}
      <div className="absolute top-[-20%] left-[-10%] h-[1000px] w-[1000px] bg-teal-500 rounded-full blur-[250px] opacity-[0.08]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[1000px] w-[1000px] bg-[#028090] rounded-full blur-[250px] opacity-[0.1]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2,195,154,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(2,195,154,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 md:py-32 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 relative z-10 w-full items-center">
        {/* Left Side: Main Content */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-10 lg:text-left text-center"
        >
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-5 py-2.5 rounded-full w-fit mx-auto lg:mx-0 border border-white/5">
            <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse" />
            <div className="flex items-center gap-2">
              <p className="text-white font-black text-[10px] uppercase tracking-widest italic">12 Active Pharmacies</p>
              <span className="h-4 w-[1px] bg-white/10" />
              <p className="text-teal-400 font-black text-[10px] uppercase tracking-widest italic">Live in Karaikal</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-syne font-black text-white leading-tight tracking-tighter uppercase italic text-3xl md:text-5xl">
              Welcome <br />
              <span className="text-teal-400">to MediPharm</span>
            </h1>
            <p className="text-white/40 font-dm text-base md:text-lg mt-4 italic font-bold max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the future of healthcare procurement. Secure, verified, and delivered within 30 minutes to your enclave.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start w-full sm:w-auto">
             <Link 
                to="/medicines" 
                className="h-16 md:h-20 px-8 md:px-12 bg-brand-teal text-[#0a1628] font-syne font-black rounded-2xl flex items-center justify-center gap-4 text-[10px] uppercase italic tracking-[0.2em] shadow-4xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
             >
                Start Shopping <ArrowRight size={20} />
             </Link>
             <Link 
                to="/pharmacies" 
                className="h-16 md:h-20 px-8 md:px-12 border-2 border-white/10 text-white font-syne font-black rounded-2xl flex items-center justify-center gap-4 text-[10px] uppercase italic tracking-[0.2em] backdrop-blur-3xl hover:bg-white/5 transition-all w-full sm:w-auto"
             >
                <MapPin size={20} className="text-brand-teal" /> Find Shops
             </Link>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-8 opacity-40">
             {[
               { label: 'DELIVERY', val: '22 MINS', icon: Truck },
               { label: 'MEDICINES', val: '5,000+', icon: Pill },
               { label: 'RATING', val: '4.9/5', icon: Star }
             ].map(stat => (
               <div key={stat.label} className="flex items-center gap-3">
                  <stat.icon size={16} className="text-brand-teal" />
                  <div className="flex flex-col items-start">
                     <span className="text-[8px] font-black text-white uppercase tracking-widest">{stat.label}</span>
                     <span className="text-xs font-syne font-black text-white italic">{stat.val}</span>
                  </div>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Right Side: Visuals */}
        <div className="relative hidden lg:flex flex-col items-center justify-center h-[700px] w-full">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-brand-teal/10 rounded-full animate-spin-slow" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-brand-teal/5 rounded-full animate-reverse-spin" />

           <FloatingBadge icon={HeartPulse} text="Live Tracking" pos="top-0 right-0" delay={0} />
           <FloatingBadge icon={Cpu} text="Verified Registry" pos="top-[40%] left-[-10%]" delay={1} />
           <FloatingBadge icon={Zap} text="Emergency Mode" pos="bottom-[8%] right-[8%]" delay={2} />

           <div className="relative z-20 grid grid-cols-2 gap-4">
              {PHARMACIES.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className={`bg-white/10 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 w-48 shadow-4xl group hover:border-brand-teal/50 transition-all ${p.rot} ${p.mt || ''}`}
                >
                  <div className="h-12 w-12 bg-brand-teal/20 rounded-xl flex items-center justify-center text-brand-teal mb-4 group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all"><Package size={24}/></div>
                  <div className="space-y-1">
                     <p className="text-white font-syne font-black text-xs uppercase italic truncate">{p.name}</p>
                     <p className="text-white/40 font-dm text-[10px] font-bold italic truncate">{p.area}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
          <svg className="relative block w-full h-[60px] md:h-[100px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#f8fafc"></path>
          </svg>
      </div>
    </section>
  );
}
