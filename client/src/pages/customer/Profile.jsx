import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell, Camera, CreditCard, FileText, LogOut, MapPin, 
  Package, Pencil, Shield, Star, User, Activity, 
  ChevronRight, Heart, Zap, ShieldCheck, Globe, 
  Calendar, Clock, Wallet, Settings, RefreshCw as RefreshCwIcon,
  PlusCircle, Trash2, ArrowRight, LayoutDashboard, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '../../store/authSlice.js';
import { useLanguage } from '../../context/LanguageContext';

const NAV_ITEMS = [
  { id: 'personal', labelKey: 'personalInfo', icon: User, roles: ['customer', 'pharmacist', 'doctor', 'delivery', 'admin'] },
  { id: 'addresses', labelKey: 'addresses', icon: MapPin, roles: ['customer'] },
  { id: 'orders', labelKey: 'myOrders', icon: Package, roles: ['customer'] },
  { id: 'appointments', labelKey: 'appointments', icon: Calendar, roles: ['customer'] },
  { id: 'prescriptions', labelKey: 'myPrescriptions', icon: FileText, roles: ['customer'] },
  { id: 'wallet', labelKey: 'myWallet', icon: Wallet, roles: ['customer', 'delivery'] },
  { id: 'security', labelKey: 'privacy', icon: Shield, roles: ['customer', 'pharmacist', 'doctor', 'delivery', 'admin'] },
];

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { user, role } = useSelector((s) => s.auth);
  const [active, setActive] = useState('personal');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredNav = useMemo(() => {
    return NAV_ITEMS.filter(item => item.roles.includes(role || 'customer'));
  }, [role]);

  const initials = useMemo(() => {
    const name = user?.name || 'MediPharm User';
    return name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => navigate('/login'));
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-48 pt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Profile Architecture Header */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
           <div className="space-y-6">
              <div className="px-6 py-2.5 bg-[#0a1628] rounded-2xl w-fit flex items-center gap-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] italic">
                 <ShieldCheck size={16} className="text-brand-teal" /> {t('identityVerified') || 'ACCOUNT VERIFIED'}
              </div>
              <h1 className="font-syne font-black text-6xl md:text-8xl lg:text-9xl text-[#0a1628] leading-[0.85] tracking-tighter uppercase italic">
                 {t('my')} <span className="text-brand-teal">{t('profile').split(' ')[0]}</span>
              </h1>
           </div>
           
           <div className="hidden md:flex items-center gap-6 bg-white border border-black/[0.03] p-4 rounded-[2.5rem] shadow-soft">
              {role === 'customer' ? (
                <div className="px-6 border-r border-gray-100 flex flex-col">
                   <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{t('loyaltyPoints') || 'LOYALTY'}</span>
                   <span className="font-syne font-black text-2xl text-[#0a1628] italic">250 <span className="text-brand-teal">PTS</span></span>
                </div>
              ) : (
                <div className="px-6 border-r border-gray-100 flex flex-col">
                   <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">PERFORMANCE</span>
                   <span className="font-syne font-black text-2xl text-[#0a1628] italic">99<span className="text-brand-teal">%</span></span>
                </div>
              )}
              <div className="px-6 flex flex-col">
                 <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{t('idLabel') || 'ID'}</span>
                 <span className="font-syne font-black text-lg text-[#0a1628] italic">ID-{user?._id?.slice(-6).toUpperCase() || 'SYS-42'}</span>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-12 md:gap-16 items-start">
          
          {/* Dashboard Control Panel */}
          <aside className="space-y-10">
             <div className="bg-white border border-black/[0.03] rounded-[3.5rem] p-10 shadow-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.03] rounded-full blur-[60px]" />
                
                <div className="text-center space-y-8 relative z-10 mb-12">
                   <div className="relative inline-block group/avatar">
                      <div className="h-40 w-40 rounded-[3rem] bg-gradient-to-br from-[#0a1628] to-[#1a2b4b] text-brand-teal flex items-center justify-center text-5xl font-syne font-black italic shadow-2xl transition-all duration-700 group-hover/avatar:scale-105 group-hover/avatar:rotate-3">
                        {user?.image ? <img src={user.image} className="h-full w-full object-cover rounded-[3rem]" alt="Profile" /> : initials}
                      </div>
                      <button className="absolute -bottom-2 -right-2 h-14 w-14 bg-brand-teal text-[#0a1628] rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                        <Camera size={24} />
                      </button>
                   </div>
                   
                   <div className="space-y-1">
                      <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter leading-none">{user?.name}</h2>
                      <div className="flex items-center justify-center gap-3">
                         <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest italic">{role} Verified</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-2 relative z-10">
                   {filteredNav.map((item) => {
                      const Icon = item.icon;
                      const isActive = active === item.id;
                      return (
                         <button
                           key={item.id}
                           onClick={() => setActive(item.id)}
                           className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-500 group ${
                             isActive ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'text-gray-400 hover:bg-gray-50'
                           }`}
                         >
                            <div className="flex items-center gap-5">
                               <Icon size={18} className={isActive ? 'text-brand-teal' : 'text-gray-300 group-hover:text-brand-teal transition-colors'} />
                               <span className="font-syne font-black text-[11px] uppercase tracking-widest italic">{t(item.labelKey) || item.id}</span>
                            </div>
                            {isActive && <motion.div layoutId="active-indicator" className="h-2 w-2 bg-brand-teal rounded-full" />}
                         </button>
                      );
                   })}
                   
                   <div className="pt-8 mt-8 border-t border-gray-100 space-y-4">
                      <Link to={`/${role}/dashboard`} className="w-full flex items-center gap-5 px-6 py-5 rounded-2xl bg-[#0a1628]/5 text-[#0a1628] hover:bg-[#0a1628] hover:text-brand-teal transition-all duration-500 font-syne font-black text-[11px] uppercase tracking-widest italic group/dash">
                         <LayoutDashboard size={18} /> {t('dashboard') || 'Go To Dashboard'} <ArrowRight size={16} className="ml-auto opacity-0 group-hover/dash:opacity-100 transition-opacity" />
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-5 px-6 py-5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-syne font-black text-[11px] uppercase tracking-widest italic"
                      >
                         <LogOut size={18} /> {t('logout') || 'Logout'}
                      </button>
                   </div>
                </div>
             </div>
          </aside>

          {/* Configuration Area */}
          <main>
             <div className="bg-white border border-black/[0.03] rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-16 shadow-4xl relative overflow-hidden min-h-[700px]">
                <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                
                <AnimatePresence mode="wait">
                   <motion.div
                     key={active}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="relative z-10 space-y-12"
                   >
                      <div className="flex items-center justify-between border-b border-gray-50 pb-10">
                         <div className="flex items-center gap-6">
                            <div className="h-1.5 w-12 bg-brand-teal rounded-full" />
                            <h2 className="font-syne font-black text-3xl text-[#0a1628] uppercase italic tracking-tighter">
                               {active.toUpperCase()}
                            </h2>
                         </div>
                      </div>

                      {active === 'personal' && (
                         <div className="space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                               {[
                                 { label: 'NAME', value: user?.name, locked: false },
                                 { label: 'EMAIL', value: user?.email, locked: true },
                                 { label: 'PHONE', value: user?.phone || '+91 9443XXXXXX', locked: false },
                                 { label: 'ROLE', value: role?.toUpperCase(), locked: true },
                                 { label: 'BLOOD GROUP', value: 'O+', locked: false },
                                 { label: 'LOCATION', value: 'Karaikal, India', locked: true },
                               ].map((field) => (
                                 <div key={field.label} className="group/field">
                                    <div className="flex items-center justify-between mb-3 px-2">
                                       <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">{field.label}</span>
                                       {field.locked ? <Shield size={12} className="text-gray-100" /> : <Pencil size={12} className="text-gray-200 group-hover/field:text-brand-teal transition-colors cursor-pointer" />}
                                    </div>
                                    <div className={`w-full bg-gray-50/50 border border-black/[0.03] rounded-2xl px-8 py-6 font-syne font-black text-lg text-[#0a1628] italic transition-all ${field.locked ? 'opacity-50' : 'group-hover/field:border-brand-teal/30 group-hover/field:bg-white group-hover/field:shadow-soft'}`}>
                                       {field.value}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      )}

                      {active === 'wallet' && (
                         <div className="space-y-12">
                            <div className="bg-gradient-to-br from-[#0a1628] to-[#12243d] rounded-[4rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden group">
                               <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-10 rounded-full blur-[80px]" />
                               <div className="space-y-10 relative z-10 text-center md:text-left">
                                  <div className="flex items-center justify-center md:justify-start gap-4">
                                     <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl"><Landmark size={28}/></div>
                                     <span className="text-xs font-dm font-black uppercase tracking-[0.4em] text-white/40 italic">WALLET</span>
                                  </div>
                                  <div className="space-y-2">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-[#00BF72]">Available Balance</span>
                                     <div className="text-7xl md:text-9xl font-syne font-black tracking-tighter italic leading-none">₹1,250<span className="text-3xl text-white/20">.00</span></div>
                                  </div>
                                  <div className="flex flex-col md:flex-row gap-4">
                                     <button onClick={() => navigate('/wallet/add-money')} className="h-20 px-12 bg-white text-[#0a1628] rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest italic shadow-4xl hover:bg-brand-teal transition-all duration-700">ADD MONEY</button>
                                     <button className="h-20 px-12 bg-white/5 border border-white/10 text-white rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest italic hover:bg-white/10 transition-all">VIEW HISTORY</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      )}

                      {/* Default empty state for other tabs */}
                      {['orders', 'appointments', 'prescriptions', 'security', 'notifications'].includes(active) && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                           <div className="h-32 w-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-black/[0.02] shadow-inner">
                              <Zap size={48} className="animate-pulse" />
                           </div>
                           <h3 className="font-syne font-black text-2xl text-[#0a1628] italic">NO DATA</h3>
                           <p className="max-w-xs text-gray-400 font-dm italic font-bold">No items found in this section.</p>
                           <button onClick={() => navigate('/medicines')} className="h-16 px-10 bg-[#0a1628] text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-widest shadow-lg">START BROWSING</button>
                        </div>
                      )}

                   </motion.div>
                </AnimatePresence>
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function RefreshCw({ size, className }) {
  return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}><RefreshCwIcon size={size} className={className} /></motion.div>;
}
