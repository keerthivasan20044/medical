import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a few seconds before showing the prompt
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
      setDeferredPrompt(null);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-20 left-4 right-4 z-[5000] md:left-auto md:right-8 md:w-96"
        >
          <div className="bg-[#0a1628] border border-brand-teal/30 rounded-3xl p-6 flex items-center justify-between shadow-[0_32px_64px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-teal opacity-5 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex-1 space-y-1">
              <p className="font-syne font-black text-white text-base uppercase italic tracking-tighter">Install MediPharm</p>
              <p className="text-[10px] font-dm font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">Add to home screen for instant medicine access.</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShow(false)} 
                className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                aria-label="Later"
              >
                <X size={18} />
              </button>
              <button 
                onClick={handleInstall} 
                className="bg-brand-teal text-[#0a1628] font-syne font-black text-[9px] px-6 h-10 rounded-xl flex items-center gap-2 uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                <Download size={14} /> Install
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
