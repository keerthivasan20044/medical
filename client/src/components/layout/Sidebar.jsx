import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Pill, Stethoscope, Package, 
  MapPinned, FileText, User, BarChart3, 
  ShoppingBag, ShieldCheck, Activity, Bell,
  Settings, CreditCard, LifeBuoy, ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext.jsx';

const NAV = (t) => ({
  customer: [
    { to: '/home', label: t('sidebarDashboard'), icon: LayoutDashboard },
    { to: '/medicines', label: t('sidebarMedicines'), icon: Pill },
    { to: '/doctors', label: t('sidebarDoctors'), icon: Stethoscope },
    { to: '/orders', label: t('sidebarMyOrders'), icon: Package },
    { to: '/prescriptions', label: t('sidebarPrescriptions'), icon: FileText },
    { to: '/appointments', label: t('sidebarClinicalDesk'), icon: Activity },
    { to: '/wallet', label: t('sidebarWallet'), icon: CreditCard },
  ],
  pharmacist: [
    { to: '/pharmacist/dashboard', label: t('sidebarOperations'), icon: LayoutDashboard },
    { to: '/pharmacist/inventory', label: t('sidebarInventory'), icon: Pill },
    { to: '/pharmacist/orders', label: t('sidebarOrderStream'), icon: ShoppingBag },
    { to: '/pharmacist/analytics', label: t('sidebarYields'), icon: BarChart3 }
  ],
  delivery: [
    { to: '/delivery/dashboard', label: t('sidebarNavigation'), icon: LayoutDashboard },
    { to: '/delivery/active', label: t('sidebarLiveNode'), icon: MapPinned },
    { to: '/delivery/earnings', label: t('sidebarYields'), icon: CreditCard },
    { to: '/delivery/history', label: t('sidebarProtocolLog'), icon: Package }
  ],
  admin: [
    { to: '/admin/dashboard', label: t('sidebarCommand'), icon: LayoutDashboard },
    { to: '/admin/users', label: t('sidebarNodes'), icon: User },
    { to: '/admin/pharmacies', label: t('sidebarEnclaves'), icon: Pill },
    { to: '/admin/orders', label: t('sidebarStreams'), icon: Package },
    { to: '/admin/analytics', label: t('sidebarMetrics'), icon: BarChart3 }
  ]
});

export default function Sidebar() {
  const { t } = useLanguage();
  const { role } = useSelector((s) => s.auth);
  const navItems = NAV(t)[role || 'customer'];

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-[#0a1628] text-white min-h-[calc(100vh-60px)] sticky top-[60px] border-r border-white/5">
      <div className="p-10 space-y-2">
        <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-[0.4em] italic mb-4">{t('commandTerminal')}</div>
        <div className="flex items-center gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/5">
           <div className="h-12 w-12 bg-[#028090] rounded-2xl flex items-center justify-center shadow-lg"><User size={20} /></div>
           <div className="space-y-1">
              <div className="font-syne font-black text-sm uppercase tracking-tighter capitalize">{(t(role) || role) || t('customer')} {t('enclave')}</div>
              <div className="text-[8px] text-white/30 font-black uppercase tracking-widest flex items-center gap-2"> <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> {t('nodeVerifiedSide')}</div>
           </div>
        </div>
      </div>
      
      <nav className="flex-1 px-6 space-y-2 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-6 px-8 py-5 rounded-2xl font-syne font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 group relative overflow-hidden ${
                isActive ? 'text-[#02C39A] bg-white/5 shadow-2xl' : 'text-white/40 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={18} className="group-hover:scale-110 group-hover:rotate-6 transition duration-500" />
            {item.label}
            <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition duration-500 -translate-x-4 group-hover:translate-x-0" size={14} />
          </NavLink>
        ))}
      </nav>

      <div className="p-10 space-y-4">
         <div className="p-8 bg-gradient-to-br from-[#028090]/10 to-transparent rounded-[2.5rem] border border-white/5 space-y-4">
            <LifeBuoy size={24} className="text-[#02C39A]" />
            <div className="space-y-1">
               <div className="font-syne font-black text-xs uppercase tracking-widest">{t('sidebarSupport')}</div>
               <p className="text-[10px] text-white/20 font-bold leading-relaxed italic">{t('sidebarSupportDesc')}</p>
            </div>
         </div>
      </div>
    </aside>
  );
}

