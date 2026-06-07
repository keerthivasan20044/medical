import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

export default function DashboardSidebar({ role, menuItems, isOpen, setIsOpen }) {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="h-10 w-10 bg-brand-teal rounded-xl flex items-center justify-center text-white font-syne font-black italic">
          M
        </div>
        <div className="font-syne font-black text-xl text-navy italic tracking-tighter uppercase">
          Medi<span className="text-brand-teal">Pharm</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-6 px-4 py-2 bg-navy/5 rounded-xl border border-navy/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">{role}</span>
        <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1 no-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-500 group relative ${
                isActive 
                ? 'bg-[#0a1628] text-white shadow-2xl shadow-[#0a1628]/20 ring-1 ring-white/5' 
                : 'text-navy/60 hover:bg-[#0a1628]/5 hover:text-navy'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon size={20} className={isActive ? 'text-brand-teal scale-110' : 'group-hover:text-brand-teal transition-all group-hover:scale-110'} />
                <span className="font-syne font-black text-[11px] tracking-wide uppercase">{item.label}</span>
                {item.badge && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    isActive ? 'bg-brand-teal/20 text-brand-teal' : (item.badgeColor || 'bg-gray-100 text-navy/40')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active" 
                  className="absolute left-0 w-1.5 h-6 bg-brand-teal rounded-r-full"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
      >
        <LogOut size={20} />
        <span className="font-syne font-bold text-sm tracking-tight uppercase italic">Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 h-screen sticky top-0 bg-white border-r border-gray-100 shadow-sm overflow-hidden shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-[60] lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 h-10 w-10 flex items-center justify-center text-navy/40 hover:text-navy"
              >
                <X size={24} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
