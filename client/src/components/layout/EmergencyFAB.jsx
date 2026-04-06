import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Phone, AlertTriangle, Shield, Heart, Zap, X, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function EmergencyFAB() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const ACTIONS = [
    { label: t('call108Emergency'), icon: Phone, color: 'bg-red-500', sub: t('instantAmbulanceSync'), tel: '108' },
    { label: t('bloodRequest'), icon: Heart, color: 'bg-rose-600', sub: t('districtBloodHub'), tel: '102' },
    { label: t('oxygenPulse'), icon: Zap, color: 'bg-blue-600', sub: t('liveSupplyLink'), tel: '104' },
    { label: t('sosSupport'), icon: MessageCircle, color: 'bg-brand-teal', sub: t('whatsappEnclave'), tel: '+9100000000' }
  ];

  return (
    <div className="fixed bottom-32 left-8 z-[90]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20, y: 20 }}
            className="absolute bottom-24 left-0 w-80 bg-[#0a1628] rounded-[3.5rem] border-4 border-white shadow-[0_80px_160px_rgba(255,0,0,0.2)] overflow-hidden"
          >
            <div className="p-8 bg-red-600 text-white flex items-center justify-between">
               <div className="space-y-1">
                  <h3 className="font-syne font-black text-xl uppercase italic tracking-tighter">{t('emergencyHub')}</h3>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{t('priorityProtocolActive')}</div>
               </div>
               <AlertTriangle className="animate-pulse" size={28} />
            </div>

            <div className="p-4 space-y-2">
               {ACTIONS.map((a, i) => (
                 <motion.a
                   key={i}
                   href={`tel:${a.tel}`}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-center gap-6 p-5 bg-white/5 hover:bg-white/10 rounded-[2rem] group transition-all duration-500 border border-white/5"
                 >
                    <div className={`h-12 w-12 ${a.color} rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform duration-500`}>
                       <a.icon size={20} />
                    </div>
                    <div className="flex-1">
                       <div className="text-white font-syne font-black text-sm uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors">{a.label}</div>
                       <div className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">{a.sub}</div>
                    </div>
                    <ArrowRight size={16} className="text-white/10 group-hover:text-brand-teal group-hover:translate-x-2 transition-all duration-500" />
                 </motion.a>
               ))}
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 text-center">
               <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em] italic">{t('systemAuthorizedRapidResponse')}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 px-6 rounded-[2rem] shadow-4xl flex items-center justify-center gap-4 z-[100] border-2 transition-all duration-700 relative overflow-hidden ${isOpen ? 'bg-white border-red-500 text-red-500' : 'bg-red-600 border-red-500/20 text-white'}`}
      >
        <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <Phone size={24} className="relative z-10 animate-shake" />
            <span className="font-syne font-black text-[10px] uppercase tracking-[0.2em] italic">{t('emergency')}</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
