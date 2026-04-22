import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-44 right-4 z-50 w-10 h-10
                 bg-[#0a0f1e] border border-teal-500 rounded-full
                 flex items-center justify-center shadow-xl"
    >
      <ChevronUp size={18} className="text-teal-400" />
    </button>
  );
};

export default ScrollToTopButton;
