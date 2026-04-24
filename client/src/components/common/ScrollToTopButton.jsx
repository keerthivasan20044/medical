import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-40 right-4 md:bottom-20 md:right-6 z-[99] h-12 w-12 bg-[#0a1628] text-teal-400 rounded-full flex items-center justify-center shadow-4xl border border-white/10 hover:bg-teal-400 hover:text-[#0a1628] transition-all group"
    >
      <ChevronUp size={24} />
    </motion.button>
  );
};

export default ScrollToTopButton;
