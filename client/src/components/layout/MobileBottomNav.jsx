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
import useScrollDirection from '../../hooks/useScrollDirection.js';

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
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { role } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.notifications);
  const { totalQty } = useSelector((s) => s.cart);
  const unread = items?.filter((n) => !n.isRead).length || 0;
  const scrollDirection = useScrollDirection();

  const items_to_render = NAV(t)[role] || NAV(t)['guest'];

  return (
    <motion.nav 
      initial={false}
      animate={{ y: scrollDirection === 'down' ? 120 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="lg:hidden fixed bottom-4 left-4 right-4 bg-[#0a1628]/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 z-[2000] shadow-[0_20px_80px_rgba(0,0,0,0.6)] overflow-hidden"
    >
      <div className="grid grid-cols-5 h-16 md:h-20">
        {items_to_render.map((item, idx) => {
          const Icon = item.icon;
          if (item.type === 'button') {
            return (
              <button
                key={idx}
                onClick={() => {
                  if (item.action === 'cart') dispatch(setCartOpen(true));
                }}
                className="flex flex-col items-center justify-center transition-all duration-500 relative text-white/40 hover:text-brand-teal"
              >
                <div className="relative z-10 transition-transform duration-500 group">
                  <Icon size={20} className="md:w-6 md:h-6 group-hover:scale-110" />
                  {item.action === 'cart' && totalQty > 0 && (
                    <span className="absolute -top-2.5 -right-3.5 h-5 min-w-[20px] px-1 rounded-full bg-brand-teal text-[#0a1628] text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-[#0a1628]">
                      {totalQty}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider mt-1.5">{item.label?.split(' ')[0]}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-all duration-500 relative ${isActive ? 'text-brand-teal' : 'text-white/30 hover:text-white/60'}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`relative z-10 transition-all duration-500 ${isActive ? 'scale-110' : ''}`}>
                    <Icon size={20} />
                    {(item.to === '/notifications' || item.to === '/alerts') && unread > 0 && (
                      <span className="absolute -top-2.5 -right-3.5 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-[#0a1628]">
                        {unread}
                      </span>
                    )}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider mt-1.5 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0 text-brand-teal' : 'opacity-80 translate-y-0.5'}`}>
                    {item.label?.split(' ')[0]}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className="absolute inset-0 bg-white/5 border-b-4 border-brand-teal z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </motion.nav>

  );
}
