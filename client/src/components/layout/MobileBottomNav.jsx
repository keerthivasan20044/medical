import { NavLink } from 'react-router-dom';
import { 
  Home, Search, ShoppingBag, Bell, 
  User, Pill, Activity, LayoutDashboard, 
  Package, MapPinned, Stethoscope, Store
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { setCartOpen } from '../../store/uiSlice';

const NAV = (t) => ({
  guest: [
    { to: '/', icon: Home, label: t('home') || 'Home' },
    { to: '/medicines', icon: Pill, label: t('medicines') || 'Buy' },
    { to: '/search', icon: Search, label: t('search') || 'Search' },
    { to: '/doctors', icon: Stethoscope, label: t('doctors') || 'Doctor' },
    { to: '/login', icon: User, label: t('login') || 'Login' }
  ],
  customer: [
    { to: '/home', icon: Home, label: t('sidebarDashboard') },
    { to: '/medicines', icon: Pill, label: t('sidebarMedicines') },
    { type: 'button', icon: ShoppingBag, label: t('sidebarCart') || 'Cart', action: 'cart' },
    { to: '/notifications', icon: Bell, label: t('sidebarAlerts') },
    { to: '/profile', icon: User, label: t('sidebarProfile') }
  ],
  pharmacist: [
    { to: '/pharmacist/dashboard', icon: LayoutDashboard, label: t('sidebarOps') },
    { to: '/pharmacist/orders', icon: ShoppingBag, label: t('sidebarStream') },
    { to: '/pharmacist/inventory', icon: Pill, label: t('sidebarInv') },
    { to: '/notifications', icon: Bell, label: t('sidebarAlerts') },
    { to: '/profile', icon: User, label: t('sidebarNode') }
  ],
  delivery: [
    { to: '/delivery/dashboard', icon: LayoutDashboard, label: t('sidebarNav') },
    { to: '/delivery/active', icon: MapPinned, label: t('sidebarLive') },
    { to: '/delivery/history', icon: Package, label: t('sidebarLogs') },
    { to: '/notifications', icon: Bell, label: t('sidebarAlerts') },
    { to: '/profile', icon: User, label: t('sidebarNode') }
  ]
});

export default function MobileBottomNav() {
  const dispatch = useDispatch();
  const { role } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.notifications);
  const { totalQty } = useSelector((s) => s.cart);
  const unread = items?.filter((n) => !n.isRead).length || 0;

  const items_to_render = NAV(t)[role] || NAV(t)['guest'];

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-[#0a1628]/95 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 z-[2000] shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="grid grid-cols-5 h-20">
        {items_to_render.map((item, idx) => {
          const Icon = item.icon;
          if (item.type === 'button') {
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.action === 'cart') dispatch(setCartOpen(true));
                }}
                className="flex flex-col items-center justify-center transition-all duration-500 relative text-white/40 hover:text-[#02C39A]"
              >
                <div className="relative z-10 transition-transform duration-500 hover:-translate-y-2">
                  <Icon size={20} />
                  {item.action === 'cart' && totalQty > 0 && (
                    <span className="absolute -top-2 -right-3 h-[18px] min-w-[18px] px-1 rounded-full bg-brand-teal text-[#0a1628] text-[9px] font-black flex items-center justify-center shadow-lg border-2 border-[#0a1628]">
                      {totalQty}
                    </span>
                  )}
                </div>
                <span className="text-[7px] font-black uppercase tracking-[0.1em] mt-2">{item.label?.split(' ')[0]}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-all duration-500 relative ${isActive ? 'text-[#02C39A]' : 'text-white/40'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative z-10 transition-transform duration-500 ${isActive ? '-translate-y-2' : ''}`}>
                    <Icon size={20} className={isActive ? 'animate-pulse-ring' : ''} />
                    {(item.to === '/notifications' || item.to === '/alerts') && unread > 0 && (
                      <span className="absolute -top-2 -right-3 h-[18px] min-w-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-lg border-2 border-[#0a1628]">
                        {unread}
                      </span>
                    )}
                  </div>
                  <span className={`text-[7px] font-black uppercase tracking-[0.1em] mt-2 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 scale-50'}`}>
                    {item.label?.split(' ')[0]}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/5 z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
