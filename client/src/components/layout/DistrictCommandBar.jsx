import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Command, X, ArrowRight, Pill, 
  Store, User, MessageSquare, Zap, ShieldCheck,
  Activity, Map, Bell, Settings, Heart, Truck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function DistrictCommandBar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const COMMANDS = [
    { id: 'c1', icon: Pill, label: t('searchMedicineNode'), desc: t('scanDistrictInventoryClusters'), path: '/medicines' },
    { id: 'c2', icon: Store, label: t('locateTerminalNodes'), desc: t('findVerifiedRegionalPharmacies'), path: '/pharmacies' },
    { id: 'c3', icon: Zap, label: t('logisticsTelemetry'), desc: t('trackActiveDeliveryStreams'), path: '/orders' },
    { id: 'c4', icon: MessageSquare, label: t('teleconsultPulse'), desc: t('syncWithCertifiedClinicians'), path: '/doctors' },
    { id: 'c5', icon: ShieldCheck, label: t('medicalVault'), desc: t('accessEncryptedPrescriptions'), path: '/prescriptions' },
    { id: 'c6', icon: Activity, label: t('systemHealth'), desc: t('districtArchitectureStatus'), path: '/admin/dashboard' }
  ];

  const filtered = COMMANDS.filter(c => 
    c.label.toLowerCase().includes(query.toLowerCase()) || 
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Floating Trigger Macro */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 h-16 w-16 bg-[#0a1628] text-brand-teal rounded-3xl shadow-4xl flex items-center justify-center z-[90] border-2 border-brand-teal/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-brand-teal/5 animate-pulse" />
        <Command size={28} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-2xl z-[1000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] md:w-full max-w-2xl bg-white rounded-[2rem] md:rounded-[4rem] shadow-[0_80px_160px_rgba(0,0,0,0.4)] z-[1001] overflow-hidden border-4 border-white"
            >
               {/* HUD Search Header */}
              <div className="p-6 md:p-10 bg-gray-50 border-b border-gray-100 relative">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="h-10 w-10 md:h-14 md:w-14 bg-[#0a1628] rounded-xl md:rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl shrink-0">
                    <Search size={20} className="md:w-7 md:h-7" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchNode')}
                    className="flex-1 bg-transparent border-none outline-none font-syne font-black text-lg md:text-2xl text-[#0a1628] placeholder:text-gray-200 uppercase tracking-tighter italic"
                  />
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 md:h-10 md:w-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 transition shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
                {/* Visual Telemetry Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-brand-teal w-full origin-left" />
              </div>

              {/* Command Results Architecture */}
              <div className="p-4 md:p-8 max-h-[350px] md:max-h-[450px] overflow-y-auto no-scrollbar">
                <div className="space-y-4">
                  <div className="px-4 md:px-6 text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic mb-4 md:mb-6">{t('districtProtocolSync')}</div>
                  
                  {filtered.length > 0 ? (
                    filtered.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          navigate(c.path);
                          setIsOpen(false);
                        }}
                         className="group p-4 md:p-6 bg-white border-2 border-transparent hover:border-brand-teal/20 hover:bg-brand-teal/5 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-8 cursor-pointer transition-all duration-500"
                      >
                        <div className="h-10 w-10 md:h-14 md:w-14 bg-gray-50 rounded-lg md:rounded-2xl flex items-center justify-center text-[#0a1628] group-hover:bg-brand-teal group-hover:text-[#0a1628] group-hover:rotate-12 transition-all duration-500 shadow-sm shrink-0">
                          <c.icon size={20} className="md:w-7 md:h-7" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-syne font-black text-sm md:text-xl text-[#0a1628] uppercase italic tracking-tighter group-hover:text-brand-teal transition-colors leading-none">{c.label}</div>
                          <div className="text-[7px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{c.desc}</div>
                        </div>
                        <ArrowRight size={16} className="text-gray-200 group-hover:text-brand-teal group-hover:translate-x-2 md:group-hover:translate-x-3 transition-all duration-500 shrink-0" />
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-20 text-center space-y-6 opacity-30">
                       <Map size={64} className="mx-auto" />
                       <div className="font-syne font-black text-xl uppercase tracking-widest italic leading-none">Node_Query_Underspecified</div>
                       <p className="text-xs font-bold font-dm">The requested protocol is not available in the current enclave.</p>
                    </div>
                  )}
                </div>
              </div>

               {/* Global Activity Snapshot Footer */}
              <div className="p-4 md:p-8 bg-[#0a1628] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-white/40">
                <div className="flex items-center gap-4">
                   <div className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
                   <span className="text-[8px] font-black uppercase tracking-[0.3em] italic leading-none">{t('systemOnlineSynchronized')}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                   <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Truck size={10} /> {t('activeDeliveries').replace('{count}', '14')}
                   </div>
                   <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
                      <Store size={10} /> {t('nodeTerminalsOnline').replace('{count}', '8')}
                   </div>
                </div>
                <div className="hidden md:block text-[8px] font-black uppercase tracking-widest italic opacity-20">{t('pressEscToExit')}</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
