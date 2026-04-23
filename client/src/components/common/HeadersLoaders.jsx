import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Pill, Loader2, Store, Truck, Activity, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Standard page title architecture with breadcrumbs.
 */
export function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  const { t } = useLanguage();
  return (
    <div className="bg-[#0a1628] pt-40 pb-56 relative overflow-hidden flex items-center justify-center text-center">
       <div className="absolute inset-0 bg-grid opacity-10" />
       <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a162800,#02809030)]" />
       
       <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
             {breadcrumbs.length > 0 && (
               <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                  {breadcrumbs.map((b, i) => (
                    <span key={i} className="flex items-center gap-4 hover:text-[#02C39A] transition cursor-pointer">
                       {b} {i < breadcrumbs.length - 1 && <ChevronRight size={14} />}
                    </span>
                  ))}
               </div>
             )}
             <h1 className="font-syne font-black text-6xl md:text-9xl text-white tracking-tighter leading-none drop-shadow-2xl">{title} <br /><span className="text-[#02C39A]">{t('enclaveSuffix')}</span></h1>
             {subtitle && <p className="text-white/40 font-dm text-lg md:text-2xl max-w-2xl mx-auto italic leading-relaxed tracking-wide">{subtitle}</p>}
          </motion.div>
       </div>
    </div>
  );
}

/**
 * Modern section title architecture with optional CTA.
 */
export function SectionHeader({ title, subtitle, cta, to }) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-gray-50 pb-12 mb-20 animate-fade-in">
       <div className="space-y-4">
          <h2 className="font-syne font-black text-5xl text-[#0a1628] leading-tight select-none">{title} <br /><span className="text-[#028090]">{t('architectureSuffix')}</span></h2>
          {subtitle && <p className="text-gray-400 font-dm font-bold text-xl italic tracking-wide marker:text-[#02C39A]">/ {subtitle}</p>}
       </div>
       {cta && to && (
         <Link to={to} className="group px-12 py-5 bg-[#0a1628] text-white rounded-3xl font-syne font-black text-[10px] uppercase tracking-widest hover:bg-[#028090] transition shadow-2xl flex items-center gap-6 active:scale-95 duration-500">
            {cta} <ArrowRight className="group-hover:translate-x-3 transition duration-700" size={18} />
         </Link>
       )}
    </div>
  );
}

/**
 * Full-screen architecture loader.
 */
export function PageLoader() {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-[#0a1628] z-[1000] flex flex-col items-center justify-center space-y-12">
       <div className="relative">
          <div className="absolute -inset-10 bg-[#028090] rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="h-32 w-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-4xl relative z-10 animate-float-up">
             <Pill size={64} className="text-[#0a1628] animate-rotate-slow" />
          </div>
       </div>
       <div className="space-y-4 text-center">
          <h2 className="font-syne font-black text-3xl text-white tracking-widest uppercase italic">{t('syncingEnclave')}</h2>
          <div className="flex gap-3 justify-center">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-2 w-2 bg-[#02C39A] rounded-full animate-bounce shadow-mint" style={{ animationDelay: `${i * 200}ms` }} />
             ))}
          </div>
       </div>
    </div>
  );
}

/**
 * Stylized loading spinner architecture.
 */
export function Spinner({ size = 24, color = "text-[#02C39A]" }) {
  return <Loader2 className={`animate-spin ${color}`} size={size} />;
}

/**
 * Medical unit card skeleton loader.
 */
export function MedicineCardSkeleton() {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 p-8 space-y-6">
       <div className="h-48 bg-gray-50 rounded-[2.5rem] animate-pulse" />
       <div className="space-y-4">
          <div className="h-4 w-1/4 bg-gray-50 rounded-full animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-50 rounded-full animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-50 rounded-full animate-pulse" />
          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
             <div className="h-10 w-24 bg-gray-50 rounded-xl animate-pulse" />
             <div className="h-14 w-24 bg-gray-50 rounded-2xl animate-pulse" />
          </div>
       </div>
    </div>
  );
}

/**
 * Profile enclave skeleton loader.
 */
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-[4rem] p-16 space-y-12 border border-gray-50">
       <div className="flex flex-col items-center gap-10">
          <div className="h-40 w-40 bg-gray-50 rounded-full animate-pulse shadow-inner" />
          <div className="space-y-4 w-1/2 text-center">
             <div className="h-10 bg-gray-50 rounded-full animate-pulse" />
             <div className="h-4 bg-gray-50 rounded-full animate-pulse" />
          </div>
       </div>
       <div className="grid md:grid-cols-3 gap-8 pt-10 border-t border-gray-50">
          {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse" />)}
       </div>
    </div>
  );
}

/**
 * Global verification protocol badge.
 */
export function VerifiedBadge() {
  const { t } = useLanguage();
  return (
    <div className="px-6 py-2 bg-[#02C39A]/10 border border-[#02C39A]/20 rounded-2xl flex items-center gap-3 text-[#0a1628] font-syne font-black text-[10px] uppercase tracking-widest italic shadow-sm backdrop-blur-md">
       <ShieldCheck size={14} className="text-[#02C39A]" /> {t('verifiedAuthority')}
    </div>
  );
}
