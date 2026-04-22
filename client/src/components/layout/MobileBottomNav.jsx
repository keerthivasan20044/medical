import { Link, useLocation } from 'react-router-dom';
import { Home, Pill, Search, Stethoscope, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const MobileBottomNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Pill, label: 'Buy', path: '/medicines' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Stethoscope, label: 'Doctor', path: '/doctors' },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16
                    bg-[#0a0f1e]/95 backdrop-blur-md
                    border-t border-white/10
                    flex items-center pb-safe md:hidden">
      {tabs.map(tab => (
        <Link 
          key={tab.path} 
          to={tab.path}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 h-full"
        >
          <tab.icon
            size={20}
            className={isActive(tab.path) ? 'text-teal-400' : 'text-gray-500'}
          />
          <span className={`text-[10px] font-bold ${
            isActive(tab.path) ? 'text-teal-400' : 'text-gray-500'
          }`}>
            {tab.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
