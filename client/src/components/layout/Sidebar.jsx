import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Pill, Stethoscope, Package,
  MapPinned, FileText, User, BarChart3,
  ShoppingBag, Activity,
  Settings, CreditCard, LifeBuoy, ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLanguage } from '../../context/LanguageContext';

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
    { to: '/delivery/active', label: t('sidebarLiveItem'), icon: MapPinned },
    { to: '/delivery/earnings', label: t('sidebarYields'), icon: CreditCard },
    { to: '/delivery/history', label: t('sidebarServiceLog'), icon: Package }
  ],
  admin: [
    { to: '/admin/dashboard', label: t('sidebarCommand'), icon: LayoutDashboard },
    { to: '/admin/users', label: t('sidebarItems'), icon: User },
    { to: '/admin/pharmacies', label: t('sidebarAreas'), icon: Pill },
    { to: '/admin/orders', label: t('sidebarStreams'), icon: Package },
    { to: '/admin/analytics', label: t('sidebarMetrics'), icon: BarChart3 }
  ]
});

export default function Sidebar() {
  const { t } = useLanguage();
  const { role } = useSelector((s) => s.auth);
  const navItems = NAV(t)[role || 'customer'] || [];

  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 bg-[#0a1628] text-white h-[calc(100vh-4rem)] sticky top-16 border-r border-white/5 shrink-0">
      <div className="p-4 space-y-2">
        <div className="text-[10px] text-[#02C39A] font-black uppercase tracking-[0.14em] mb-3 truncate">{t('menu') || 'Menu'}</div>
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 min-w-0">
           <div className="h-10 w-10 bg-[#028090] rounded-xl flex items-center justify-center shadow-lg shrink-0"><User size={18} /></div>
           <div className="space-y-1 min-w-0">
              <div className="font-syne font-black text-[13px] capitalize leading-tight break-words">{(t(role) || role) || t('customer')}</div>
              <div className="text-[8px] text-white/40 font-black uppercase tracking-wider flex items-center gap-2"> <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" /> {t('verified') || 'Verified'}</div>
           </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 space-y-1 py-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl font-syne font-bold text-[12px] transition-all duration-300 group relative overflow-hidden ${
                isActive ? 'text-[#02C39A] bg-white/8 shadow-2xl' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={17} className="group-hover:scale-110 transition duration-300" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <ChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition duration-500 -translate-x-4 group-hover:translate-x-0" size={14} />
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-4">
         <div className="p-4 bg-[#07111f] rounded-2xl border border-white/5 space-y-3">
            <LifeBuoy size={22} className="text-[#02C39A]" />
            <div className="space-y-1">
               <div className="font-syne font-black text-xs uppercase tracking-[0.12em]">{t('sidebarSupport')}</div>
               <p className="text-[10px] text-white/40 font-bold leading-relaxed">{t('sidebarSupportDesc')}</p>
            </div>
         </div>
      </div>
    </aside>
  );
}

