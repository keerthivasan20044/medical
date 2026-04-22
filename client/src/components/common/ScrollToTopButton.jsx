import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-40 right-4 z-[999] w-11 h-11 bg-[#0a0f1e] border border-teal-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:bg-teal-500/10"
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} className="text-teal-400" />
    </button>
  );
};

export default ScrollToTopButton;
