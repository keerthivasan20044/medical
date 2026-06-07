import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('medipharm_install_dismissed');
    if (dismissed) return;

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
      localStorage.setItem('medipharm_install_dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('medipharm_install_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          className="fixed top-[4.25rem] left-3 right-3 z-[5000] md:top-20 md:left-auto md:right-8 md:w-96"
        >
          <div className="bg-[#0a1628] border border-brand-teal/30 rounded-2xl p-3 pl-4 flex items-center gap-2 shadow-[0_18px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="min-w-0 flex-1">
              <p className="font-syne font-black text-white text-sm uppercase leading-tight">Install MediPharm</p>
              <p className="hidden sm:block text-[10px] font-dm font-bold text-gray-400 uppercase leading-relaxed">Fast access from your home screen</p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={handleInstall}
                className="bg-brand-teal text-[#0a1628] font-dm font-bold text-xs px-3 h-10 rounded-xl flex items-center gap-1.5 uppercase hover:bg-teal-300 transition-colors shadow-lg"
              >
                <Download size={14} /> Install
              </button>
              <button
                onClick={handleDismiss}
                className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Dismiss install prompt"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
