import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Pill, Stethoscope, User, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileTabBar() {
  const location = useLocation();
  const { totalQty } = useSelector(s => s.cart);
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { label: t('home') || 'Home', icon: Home, to: '/' },
    { label: t('medicines') || 'Buy', icon: Pill, to: '/medicines' },
    { label: t('teleconsultation') || 'Dr', icon: Stethoscope, to: '/doctors' },
    { label: t('cart') || 'Cart', icon: ShoppingBag, to: '/cart', badge: totalQty },
    { label: t('profile') || 'Self', icon: User, to: '/profile' },
  ];

  // Only show on smaller screens
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-black/[0.04] z-[2500] px-4 pb-safe">
      <div className="flex items-center justify-around h-20 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          const Icon = item.icon;

          return (
            <Link 
              key={item.to} 
              to={item.to}
              className="relative flex flex-col items-center justify-center gap-1 min-w-[64px] group"
            >
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#0a1628] text-brand-teal shadow-lg' : 'text-gray-400 group-active:scale-90'}`}>
                <Icon size={20} className={isActive ? 'scale-110' : ''} />
                {item.badge > 0 && (
                  <span className="absolute top-0 right-2 h-4 w-4 bg-brand-teal text-[#0a1628] rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white">{item.badge}</span>
                )}
              </div>
              <span className={`text-[9px] font-syne font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#0a1628]' : 'text-gray-300'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                   layoutId="mobile-nav-dot" 
                   className="absolute -bottom-2 h-1 w-1 bg-brand-teal rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
