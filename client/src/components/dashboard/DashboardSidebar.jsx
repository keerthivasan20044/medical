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
    <div className="flex flex-col h-full py-8 px-6">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-12">
        <div className="h-10 w-10 bg-brand-teal rounded-xl flex items-center justify-center text-white font-syne font-black italic">
          M
        </div>
        <div className="font-syne font-black text-xl text-navy italic tracking-tighter uppercase">
          Medi<span className="text-brand-teal">Pharm</span>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mb-8 px-4 py-2 bg-navy/5 rounded-xl border border-navy/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">{role}</span>
        <div className="h-2 w-2 rounded-full bg-brand-teal animate-pulse" />
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                ? 'bg-navy text-white shadow-lg shadow-navy/20' 
                : 'text-navy/60 hover:bg-navy/5 hover:text-navy'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive ? 'text-brand-teal' : 'group-hover:text-brand-teal transition-colors'} />
                <span className="font-syne font-bold text-sm tracking-tight uppercase italic">{item.label}</span>
                {item.badge && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.badgeColor || 'bg-gray-100 text-navy/40'}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              {isActive && <motion.div layoutId="sidebar-active" className="h-1.5 w-1.5 rounded-full bg-brand-teal" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors group"
      >
        <LogOut size={20} />
        <span className="font-syne font-bold text-sm tracking-tight uppercase italic">Logout</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 bg-white border-r border-gray-100 shadow-sm overflow-y-auto">
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
