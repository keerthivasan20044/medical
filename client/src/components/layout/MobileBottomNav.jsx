import { Link, useLocation } from 'react-router-dom';
import { Home, Pill, Search, Stethoscope, User, ShoppingBag } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Pill, label: 'Medicines', path: '/medicines' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', count: items.length },
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: User, label: 'Profile', path: isAuthenticated ? '/profile' : '/login' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/login' || path === '/profile') {
      return location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/profile');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 md:hidden bg-slate-900 border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-full max-w-full overflow-hidden">
        {tabs.map(tab => {
          const active = isActive(tab.path);
          return (
            <Link 
              key={tab.path} 
              to={tab.path}
              className="flex flex-col items-center justify-center gap-0.5 min-h-14 transition-all"
            >
              <div className="relative flex items-center justify-center">
                 <tab.icon
                   size={20}
                   className={`transition-colors duration-300 ${active ? 'text-teal-400' : 'text-slate-400'}`}
                 />
                 {tab.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg">
                       {tab.count > 9 ? '9+' : tab.count}
                    </span>
                 )}
              </div>
              <span className={`text-[10px] md:text-xs font-medium transition-colors duration-300 ${
                active ? 'text-teal-400' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
