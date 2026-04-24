import { useSelector } from 'react-redux';
import { Menu, Bell, Search, User as UserIcon, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardHeader({ role, setIsSidebarOpen }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-20 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Search & Mobile Menu */}
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden h-10 w-10 flex items-center justify-center text-navy hover:bg-navy/5 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl w-full max-w-md focus-within:border-brand-teal focus-within:ring-4 focus-within:ring-brand-teal/5 transition-all">
          <Search size={18} className="text-navy/20" />
          <input 
            type="text" 
            placeholder={`Search across ${role} modules...`}
            className="bg-transparent border-none outline-none w-full text-sm font-dm font-medium text-navy placeholder:text-navy/20"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2">
           <button className="h-10 w-10 flex items-center justify-center text-navy/40 hover:text-brand-teal hover:bg-brand-teal/5 rounded-xl transition-all relative group">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button className="h-10 w-10 flex items-center justify-center text-navy/40 hover:text-brand-teal hover:bg-brand-teal/5 rounded-xl transition-all">
            <Globe size={20} />
          </button>
        </div>

        <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden md:block" />

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 pl-3 pr-2 py-1.5 bg-navy/5 border border-navy/5 rounded-2xl cursor-pointer hover:bg-navy/10 transition-colors"
        >
          <div className="text-right hidden sm:block">
            <div className="text-xs font-syne font-black text-navy uppercase italic leading-none">{user?.name || 'Anonymous'}</div>
            <div className="text-[10px] font-dm font-bold text-navy/40 uppercase tracking-widest">{role}</div>
          </div>
          <div className="h-9 w-9 bg-navy text-brand-teal rounded-xl flex items-center justify-center shadow-lg shadow-navy/20 overflow-hidden border-2 border-white">
            {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : <UserIcon size={18} />}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
