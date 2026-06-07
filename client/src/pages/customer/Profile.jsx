import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Camera, FileText, LogOut, MapPin,
  Package, Pencil, Shield, User,
  Zap, ShieldCheck,
  Calendar, Wallet,
  ArrowRight, LayoutDashboard, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { logoutUser, setAuth } from '../../store/authSlice.js';
import { useLanguage } from '../../context/LanguageContext';
import { authService } from '../../services/apiServices.js';

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
  const [avatarUploading, setAvatarUploading] = useState(false);

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

  const avatarUrl = user?.avatar?.url || user?.avatar || user?.image;

  const dashboardPath = useMemo(() => {
    const paths = {
      customer: '/home',
      pharmacist: '/pharmacist/dashboard',
      doctor: '/doctor/dashboard',
      delivery: '/delivery/dashboard',
      admin: '/admin/dashboard'
    };
    return paths[role] || '/home';
  }, [role]);

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => navigate('/login'));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be 5MB or smaller');

    try {
      setAvatarUploading(true);
      const data = new FormData();
      data.append('photo', file);
      if (user?.email) data.append('email', user.email);
      if (user?.phone) data.append('phone', user.phone);
      const res = await authService.uploadAvatar(data);
      const nextUser = { ...user, avatar: res.avatar };
      dispatch(setAuth({ user: nextUser, role: nextUser.role || role }));
      toast.success('Profile photo updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Avatar upload failed');
    } finally {
      setAvatarUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-28 md:pb-48 pt-4 md:pt-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        
        {/* Profile System Header */}
        <div className="hidden md:flex mb-12 md:mb-20 flex-col md:flex-row md:items-end justify-between gap-10">
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

        <div className="grid lg:grid-cols-[380px_1fr] gap-6 md:gap-16 items-start min-w-0">
          
          {/* Dashboard Control Panel */}
          <aside className="space-y-6 md:space-y-10 min-w-0">
             <div className="bg-white border border-black/[0.03] rounded-3xl md:rounded-[3.5rem] p-5 md:p-10 shadow-xl md:shadow-4xl relative overflow-hidden max-w-full">
                <div className="absolute top-0 right-0 h-40 w-40 bg-brand-teal opacity-[0.03] rounded-full blur-[60px]" />
                
                <div className="text-center space-y-5 md:space-y-8 relative z-10 mb-8 md:mb-12">
                   <div className="relative inline-block group/avatar">
                      <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-[#0a1628] to-[#1a2b4b] text-brand-teal flex items-center justify-center text-4xl md:text-5xl font-syne font-black italic shadow-2xl transition-all duration-700 md:group-hover/avatar:scale-105 md:group-hover/avatar:rotate-3 overflow-hidden">
                        {avatarUrl ? <img src={avatarUrl} className="h-full w-full object-cover" alt="Profile" /> : initials}
                      </div>
                      <label className="absolute -bottom-2 -right-2 h-12 w-12 md:h-14 md:w-14 bg-brand-teal text-[#0a1628] rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarUploading} />
                        <Camera size={22} className={avatarUploading ? 'animate-pulse' : ''} />
                      </label>
                   </div>
                   
                   <div className="space-y-1 min-w-0 px-1">
                      <h2 className="font-syne font-black text-xl md:text-3xl text-[#0a1628] uppercase italic tracking-tight md:tracking-tighter leading-tight break-words max-w-full">{user?.name || 'MediPharm User'}</h2>
                      <div className="flex items-center justify-center gap-3">
                         <span className="text-[9px] md:text-[10px] font-black text-brand-teal uppercase tracking-[0.12em] md:tracking-widest italic">{role || 'customer'} Verified</span>
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
                           className={`w-full flex items-center justify-between gap-3 px-4 md:px-6 py-4 md:py-5 rounded-2xl transition-all duration-500 group min-w-0 ${
                             isActive ? 'bg-[#0a1628] text-brand-teal shadow-2xl' : 'text-gray-400 hover:bg-gray-50'
                           }`}
                         >
                            <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
                               <Icon size={18} className={`shrink-0 ${isActive ? 'text-brand-teal' : 'text-gray-300 group-hover:text-brand-teal transition-colors'}`} />
                               <span className="font-syne font-black text-[10px] md:text-[11px] uppercase tracking-[0.08em] md:tracking-widest italic truncate">{t(item.labelKey) || item.id}</span>
                            </div>
                            {isActive && <motion.div layoutId="active-indicator" className="h-2 w-2 bg-brand-teal rounded-full shrink-0" />}
                         </button>
                      );
                   })}
                   
                   <div className="pt-5 md:pt-8 mt-5 md:mt-8 border-t border-gray-100 space-y-3 md:space-y-4">
                      <Link to={dashboardPath} className="w-full flex items-center gap-3 md:gap-5 px-4 md:px-6 py-4 md:py-5 rounded-2xl bg-[#0a1628]/5 text-[#0a1628] hover:bg-[#0a1628] hover:text-brand-teal transition-all duration-500 font-syne font-black text-[10px] md:text-[11px] uppercase tracking-[0.08em] md:tracking-widest italic group/dash min-w-0">
                         <LayoutDashboard size={18} /> {t('dashboard') || 'Go To Dashboard'} <ArrowRight size={16} className="ml-auto opacity-0 group-hover/dash:opacity-100 transition-opacity" />
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 md:gap-5 px-4 md:px-6 py-4 md:py-5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-syne font-black text-[10px] md:text-[11px] uppercase tracking-[0.08em] md:tracking-widest italic"
                      >
                         <LogOut size={18} /> {t('logout') || 'Logout'}
                      </button>
                   </div>
                </div>
             </div>
          </aside>

          {/* Configuration Area */}
          <main className="min-w-0">
             <div className="bg-white border border-black/[0.03] rounded-3xl md:rounded-[5rem] p-5 md:p-16 shadow-xl md:shadow-4xl relative overflow-hidden min-h-[420px] md:min-h-[700px]">
                <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-[0.02] rounded-full blur-[100px]" />
                
                <AnimatePresence mode="wait">
                   <motion.div
                     key={active}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="relative z-10 space-y-12"
                   >
                      <div className="flex items-center justify-between border-b border-gray-50 pb-6 md:pb-10">
                         <div className="flex items-center gap-3 md:gap-6 min-w-0">
                            <div className="h-1.5 w-8 md:w-12 bg-brand-teal rounded-full shrink-0" />
                            <h2 className="font-syne font-black text-xl md:text-3xl text-[#0a1628] uppercase italic tracking-tight md:tracking-tighter truncate">
                               {active.toUpperCase()}
                            </h2>
                         </div>
                      </div>

                      {active === 'personal' && (
                         <div className="space-y-6 md:space-y-10">
                            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
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
                                    <div className={`w-full bg-gray-50/50 border border-black/[0.03] rounded-2xl px-5 md:px-8 py-4 md:py-6 font-syne font-black text-sm md:text-lg text-[#0a1628] italic transition-all break-words ${field.locked ? 'opacity-50' : 'group-hover/field:border-brand-teal/30 group-hover/field:bg-white group-hover/field:shadow-soft'}`}>
                                       {field.value}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      )}

                      {active === 'wallet' && (
                         <div className="space-y-12">
                            <div className="bg-gradient-to-br from-[#0a1628] to-[#12243d] rounded-3xl md:rounded-[4rem] p-6 md:p-16 text-white shadow-2xl relative overflow-hidden group">
                               <div className="absolute top-0 right-0 h-64 w-64 bg-brand-teal opacity-10 rounded-full blur-[80px]" />
                               <div className="space-y-6 md:space-y-10 relative z-10 text-center md:text-left">
                                  <div className="flex items-center justify-center md:justify-start gap-4">
                                     <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-brand-teal shadow-2xl"><Landmark size={28}/></div>
                                     <span className="text-xs font-dm font-black uppercase tracking-[0.4em] text-white/40 italic">WALLET</span>
                                  </div>
                                  <div className="space-y-2">
                                     <span className="text-[10px] font-black uppercase tracking-widest text-[#00BF72]">Available Balance</span>
                                     <div className="text-5xl md:text-9xl font-syne font-black tracking-tighter italic leading-none">Rs.1,250<span className="text-2xl md:text-3xl text-white/20">.00</span></div>
                                  </div>
                                  <div className="flex flex-col md:flex-row gap-4">
                                     <button onClick={() => navigate('/wallet/add-money')} className="h-14 md:h-20 px-8 md:px-12 bg-white text-[#0a1628] rounded-2xl md:rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest italic shadow-4xl hover:bg-brand-teal transition-all duration-700">ADD MONEY</button>
                                     <button className="h-14 md:h-20 px-8 md:px-12 bg-white/5 border border-white/10 text-white rounded-2xl md:rounded-[2rem] font-syne font-black text-xs uppercase tracking-widest italic hover:bg-white/10 transition-all">VIEW HISTORY</button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      )}

                      {/* Default empty state for other tabs */}
                      {['orders', 'appointments', 'prescriptions', 'security', 'notifications'].includes(active) && (
                        <div className="flex flex-col items-center justify-center py-14 md:py-20 text-center space-y-5 md:space-y-6">
                           <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-black/[0.02] shadow-inner">
                              <Zap size={40} className="animate-pulse md:size-12" />
                           </div>
                           <h3 className="font-syne font-black text-xl md:text-2xl text-[#0a1628] italic">NO DATA</h3>
                           <p className="max-w-xs text-gray-400 font-dm italic font-bold">No items found in this section.</p>
                           <button onClick={() => navigate('/medicines')} className="h-14 md:h-16 px-8 md:px-10 bg-[#0a1628] text-brand-teal rounded-2xl font-syne font-black text-[10px] uppercase italic tracking-widest shadow-lg">START BROWSING</button>
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

