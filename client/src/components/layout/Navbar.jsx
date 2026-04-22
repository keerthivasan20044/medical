import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Pill, Search, MapPin, Mic, Bell, ShoppingCart, ChevronDown, Settings,
  LayoutDashboard, User, Package, FileText, Wallet, Star, HelpCircle,
  Moon, LogOut, CheckCheck, BellOff, X, Trash2, Tag, ShoppingBag,
  Store, CheckCircle, Home, LogIn, Stethoscope, Menu, ArrowRight,
  Activity, Globe, Zap, Cpu, Landmark, Clock
} from 'lucide-react';
import { logoutUser } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';
import { setCartOpen } from '../../store/uiSlice';
import { markAllNotificationsRead } from '../../store/notificationsSlice';
import { useSocket } from '../../context/SocketContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import CartDrawer from '../cart/CartDrawer.jsx';

// ─── Logo ────────────────────────────────────────────────────────────────────

const LogoZone = () => {
  return (
    <Link to="/" className="flex items-center gap-2 md:gap-2.5 shrink-0 group">
      <div className="h-8 w-8 md:h-10 md:w-10 bg-[#0a1628] rounded-xl flex items-center justify-center shrink-0
                      group-hover:bg-brand-teal transition-all duration-500 shadow-lg group-hover:shadow-brand-teal/30">
        <Pill className="text-brand-teal w-4 h-4 md:w-5 md:h-5 rotate-45 group-hover:text-[#0a1628] transition-colors" />
      </div>
      <div className="flex items-baseline leading-none gap-0.5 overflow-hidden">
        <span className="font-syne font-black text-lg md:text-xl text-[#0a1628] tracking-tight">Medi</span>
        <span className="font-syne font-black text-lg md:text-xl tracking-tight text-brand-teal">Pharm</span>
      </div>
    </Link>
  );
};


const StatusIndicator = () => {
  const { isConnected } = useSocket();
  const { t } = useLanguage();
  return (
    <div 
      className="flex items-center justify-center cursor-help group/status relative h-4 w-4"
      title={isConnected ? t('systemOnline') : t('systemOffline')}
    >
      <div className="relative">
        <span className={`flex h-2 w-2 rounded-full shadow-sm transition-colors duration-500
                         ${isConnected ? 'bg-brand-teal shadow-brand-teal/40' : 'bg-red-500 shadow-red-500/40'}`} />
        {isConnected && (
          <span className="absolute inset-0 rounded-full bg-brand-teal animate-ping opacity-25" />
        )}
      </div>
      
      {/* Subtle Tooltip */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0a1628] text-white
                      text-[9px] font-black font-syne uppercase tracking-widest rounded transition-all duration-300
                      opacity-0 translate-y-1 pointer-events-none group-hover/status:opacity-100 group-hover/status:translate-y-0 whitespace-nowrap z-[1001]">
        {isConnected ? t('online') : t('offline')}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a1628]" />
      </div>
    </div>
  );
};

// ─── Nav Links ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { labelKey: 'medicines',       to: '/medicines'   },
  { labelKey: 'pharmacies',      to: '/pharmacies'  },
  { labelKey: 'teleconsultation',to: '/doctors'     },
  { labelKey: 'about',           to: '/about'       },
];

// Human-readable fallback labels (short, no line-break risk)
const LABEL_FALLBACK = {
  medicines:       'Buy',
  pharmacies:      'Pharmacies',
  teleconsultation:'Doctor',
  about:           'About',
};

const DesktopNavZone = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {NAV_ITEMS.map(({ labelKey, to }, idx) => {
        const isActive = pathname.startsWith(to);
        const label = t(labelKey) || LABEL_FALLBACK[labelKey];
        
        return (
          <NavLink
            key={to}
            to={to}
            className={() =>
              `relative flex items-center px-4 py-2 rounded-xl font-syne font-black text-[13px] tracking-tight
               whitespace-nowrap transition-all duration-300 group h-10
               ${isActive ? 'text-brand-teal' : 'text-[#0a1628]/60 hover:text-[#0a1628]'}`
            }
          >
            <span className="leading-none">{label}</span>
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                className="absolute inset-x-4 bottom-0 h-0.5 bg-brand-teal rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

// ─── Search ───────────────────────────────────────────────────────────────────

const SearchZone = () => {
  const [query, setQuery]           = useState('');
  const [isFocused, setIsFocused]   = useState(false);
  const [debouncedQuery, setDQ]     = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    const id = setTimeout(() => setDQ(query), 300);
    return () => clearTimeout(id);
  }, [query]);

  const hasResults = debouncedQuery.length > 2;

  return (
    <div className="flex-1 max-w-sm xl:max-w-md relative z-50">
      <div className={`flex items-center gap-2 bg-gray-50 border h-11
                       ${isFocused ? 'border-brand-teal ring-4 ring-brand-teal/5 bg-white' : 'border-black/[0.04]'}
                       rounded-xl px-4 transition-all duration-300`}>
        <Search className={`w-4 h-4 shrink-0 transition-colors ${isFocused ? 'text-brand-teal' : 'text-gray-400'}`} />
        <input
          type="text"
          className="flex-1 font-dm text-[13px] outline-none placeholder-gray-400 bg-transparent text-[#0a1628] min-w-0"
          placeholder={t('searchPlaceholder') || 'Search medicines…'}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <div className="hidden sm:flex items-center gap-2 border-l border-black/[0.06] pl-3 ml-1 shrink-0 cursor-pointer group/loc">
          <MapPin className="text-brand-teal/60 w-3.5 h-3.5 group-hover/loc:text-brand-teal transition-colors" />
          <span className="font-syne font-bold text-[10px] text-[#0a1628]/50 uppercase tracking-widest whitespace-nowrap group-hover/loc:text-[#0a1628] transition-colors">
            {t('karaikal') || 'Karaikal'}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && hasResults && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-black/[0.06] overflow-hidden"
          >
            <div className="p-4 space-y-3 max-h-72 overflow-auto">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] px-1">
                Medicines
              </p>
              {['Paracetamol 500mg', 'Amoxicillin 250mg', 'Azithromycin'].map(m => (
                <div key={m} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group/r transition-colors">
                  <div className="h-8 w-8 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                    <Pill className="w-4 h-4 text-brand-teal" />
                  </div>
                  <span className="text-sm font-syne font-bold text-[#0a1628]">{m}</span>
                  <span className="ml-auto text-xs font-black text-brand-teal">₹45</span>
                </div>
              ))}
            </div>
            <Link
              to={`/search?q=${debouncedQuery}`}
              className="flex items-center justify-center gap-2 py-3 border-t border-gray-50
                         text-[11px] font-syne font-black text-brand-teal uppercase tracking-widest
                         hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-300"
            >
              See all results <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Notification Dropdown ───────────────────────────────────────────────────

const NotificationDropdown = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('All');
  const { items }  = useSelector(s => s.notifications);
  const dispatch   = useDispatch();
  const { t }      = useLanguage();

  const filtered = useMemo(() => {
    if (activeTab === 'All') return items;
    return items.filter(n => n.type === activeTab.toLowerCase());
  }, [activeTab, items]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-black/[0.06] overflow-hidden z-50"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h3 className="font-syne font-black text-base text-[#0a1628] uppercase tracking-tight">{t('notifications')}</h3>
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mt-0.5">{t('systemSyncActive')}</p>
        </div>
        <button
          className="h-8 px-3 bg-brand-teal/10 hover:bg-brand-teal text-brand-teal hover:text-[#0a1628]
                     rounded-lg flex items-center gap-1.5 transition-all duration-300
                     font-syne font-black text-[10px] uppercase tracking-widest"
          onClick={() => dispatch(markAllNotificationsRead())}
        >
          <CheckCheck size={12} /> {t('markAll')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 bg-gray-50/50">
        {['All', 'Orders', 'Delivery', 'Alerts'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === tab ? 'bg-white text-brand-teal shadow-md' : 'text-gray-400 hover:text-[#0a1628]'}`}
          >
            {t(tab.toLowerCase()) || tab}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-auto">
        {filtered.length > 0 ? filtered.map((n, i) => (
          <motion.div
            key={n._id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`px-5 py-4 flex gap-4 hover:bg-gray-50 border-l-4 transition-all
                        ${!n.isRead ? 'border-brand-teal bg-brand-teal/[0.02]' : 'border-transparent'}`}
          >
            <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center
                            ${n.type === 'order' ? 'bg-brand-teal/10 text-brand-teal' :
                              n.type === 'delivery' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'}`}>
              {n.type === 'order' ? <Package size={18} /> : n.type === 'delivery' ? <ShoppingCart size={18} /> : <Bell size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-syne font-bold text-sm text-[#0a1628] truncate">{n.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
              <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                <Clock size={9} /> {n.createdAt || 'Just now'}
              </p>
            </div>
            {!n.isRead && <span className="h-2 w-2 bg-brand-teal rounded-full mt-1 shrink-0 animate-pulse" />}
          </motion.div>
        )) : (
          <div className="py-14 flex flex-col items-center gap-3 text-gray-200">
            <BellOff className="w-10 h-10 opacity-30" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('noNotifications')}</span>
          </div>
        )}
      </div>

      <Link
        to="/notifications" onClick={onClose}
        className="flex items-center justify-center gap-2 py-3 border-t border-gray-50
                   text-[11px] font-syne font-black text-brand-teal uppercase tracking-widest
                   hover:bg-brand-teal hover:text-[#0a1628] transition-all duration-300"
      >
        View all <ArrowRight size={13} />
      </Link>
    </motion.div>
  );
};

// ─── User Dropdown ────────────────────────────────────────────────────────────

const UserDropdown = ({ user, isAuthenticated, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const role = user?.role || 'customer';

  const menuItems = isAuthenticated ? [
    { label: t('dashboard')       || 'Dashboard',        icon: LayoutDashboard, to: `/${role}/dashboard` },
    { label: t('myProfile')       || 'My Profile',       icon: User,            to: '/profile'           },
    { label: t('myOrders')        || 'My Orders',        icon: Package,         to: '/orders', badge: 2  },
    { label: t('prescriptions')   || 'Prescriptions',    icon: FileText,        to: '/prescriptions'     },
    { label: t('myWallet')        || 'Wallet',           icon: Wallet,          to: '/wallet', extra:'₹200'},
    { label: t('accountSettings') || 'Settings',         icon: Settings,        to: '/settings'          },
  ] : [
    { label: t('login') || 'Login', icon: LogIn, to: '/login' },
    { label: t('joinMediReach'), icon: ArrowRight, to: '/register', primary: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-black/[0.06] overflow-hidden z-50 mr-[-10px]"
    >
      {/* Profile header / Welcome */}
      <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100 flex items-center gap-3">
        <div className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center font-syne font-black text-xl uppercase shadow-lg
                        ${isAuthenticated ? 'bg-gradient-to-br from-brand-teal to-[#028090] text-[#0a1628]' : 'bg-gray-200 text-gray-500'}`}>
          {user?.name?.[0] || <User size={24} />}
        </div>
        <div className="min-w-0">
          <p className="font-syne font-black text-sm text-[#0a1628] uppercase truncate">
            {isAuthenticated ? user?.name : t('homeWelcomeHeader').split(' ')[0]}
          </p>
          <p className="text-[10px] text-gray-400 truncate">
            {isAuthenticated ? user?.email : t('districtArchitecture')}
          </p>
          {isAuthenticated && (
            <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide
                              ${role === 'admin' ? 'bg-blue-100 text-blue-600' :
                                role === 'doctor' ? 'bg-purple-100 text-purple-600' :
                                role === 'pharmacist' ? 'bg-amber-100 text-amber-700' : 'bg-brand-teal/10 text-brand-teal'}`}>
              {role}
            </span>
          )}
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2 space-y-0.5">
        {menuItems.map(item => (
          <Link
            key={item.label}
            to={item.to}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group/m
                       ${item.primary ? 'bg-[#0a1628] text-white hover:bg-brand-teal hover:text-[#0a1628] !mt-2 shadow-lg shadow-[#0a1628]/10' : 'hover:bg-gray-50'}`}
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300
                            ${item.primary ? 'bg-brand-teal/20 text-brand-teal group-hover/m:bg-white/20 group-hover/m:text-white' : 'bg-gray-100 text-gray-400 group-hover/m:bg-brand-teal group-hover/m:text-[#0a1628]'}`}>
              <item.icon size={16} />
            </div>
            <span className={`text-sm font-syne font-bold uppercase tracking-tight grow transition-colors
                             ${item.primary ? '' : 'text-[#0a1628] group-hover/m:text-brand-teal'}`}>{item.label}</span>
            {item.badge  && <span className="text-[9px] font-black bg-brand-teal text-[#0a1628] px-2 py-0.5 rounded-full">{item.badge}</span>}
            {item.extra  && <span className="text-[10px] font-black text-brand-teal">{item.extra}</span>}
          </Link>
        ))}
      </div>

      {/* Language Toggle & Actions */}
      <div className="p-3 border-t border-gray-50 bg-gray-50/30 space-y-2">
        <div className="flex p-1 bg-white border border-black/[0.04] rounded-xl">
          {['en', 'ta'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`flex-1 py-2 rounded-lg font-syne font-black text-[10px] uppercase tracking-widest transition-all
                          ${lang === l ? 'bg-[#0a1628] text-brand-teal shadow-md' : 'text-gray-400 h-8 hover:text-[#0a1628]'}`}
            >
              {l === 'en' ? 'English' : 'தமிழ்'}
            </button>
          ))}
        </div>

        {isAuthenticated && (
          <button
            onClick={() => { dispatch(logoutUser()).finally(() => { navigate('/login'); onClose(); }); }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-red-50 text-red-500 hover:bg-red-500 hover:text-white
                       font-syne font-black text-xs uppercase tracking-widest
                       transition-all duration-300 group/logout"
          >
            <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
            {t('logout') || 'Sign Out'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Search Overlay ───────────────────────────────────────────────────────────

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
       navigate(`/medicines?q=${encodeURIComponent(query)}`);
       onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0a1628]/95 backdrop-blur-2xl z-[3000] flex flex-col items-center justify-center p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 h-16 w-16 rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-teal hover:text-[#0a1628] transition-all flex items-center justify-center"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-4xl space-y-12">
            <div className="text-center space-y-4">
              <h2 className="font-syne font-black text-6xl md:text-8xl text-white uppercase italic tracking-tighter">Clinical <span className="text-brand-teal">Search</span></h2>
              <p className="text-white/40 font-dm italic text-xl">Enter clinical node ID or generic molecular signature...</p>
            </div>

            <form onSubmit={handleSearch} className="relative group">
              <input 
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: Paracetamol, Zithromax, KKL-Node-42..."
                className="w-full bg-white/5 border-b-[4px] border-white/10 px-0 py-10 font-syne font-black text-4xl md:text-6xl text-brand-teal placeholder:text-white/5 outline-none focus:border-brand-teal transition-all uppercase italic"
              />
              <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 h-20 w-20 bg-brand-teal text-[#0a1628] rounded-3xl flex items-center justify-center shadow-mint hover:scale-110 transition-all">
                <ArrowRight size={32} />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mr-4 italic">Trending Nodes:</span>
              {['Antibiotics', 'Pain Relief', 'Cardiac', 'Pediatric'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => { setQuery(tag); }}
                  className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-brand-teal hover:text-[#0a1628] hover:border-brand-teal transition-all italic"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [showSearch, setShowSearch]       = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { cartOpen } = useSelector(state => state.ui);

  const { pathname } = useLocation();
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const { user, isAuthenticated } = useSelector(s => s.auth);
  const { lang, setLang, t }      = useLanguage();
  const { totalQty, subtotal }    = useSelector(s => s.cart);
  const { items: notifs }         = useSelector(s => s.notifications);
  const unreadNotifs              = notifs.filter(n => !n.isRead).length;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => { setActiveDropdown(null); setMobileMenuOpen(false); }, [pathname]);

  const closeAll = () => setActiveDropdown(null);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[2000] w-full transition-all duration-500
                   ${isScrolled 
                     ? 'bg-white/90 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-3 border-b border-black/[0.04]' 
                     : 'bg-white py-4 md:py-5 border-b border-transparent'}`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 h-full flex items-center gap-2 md:gap-4 xl:gap-12 pr-6 md:pr-10">

          {/* Logo */}
          <LogoZone />

          {/* Main Desktop Nav Links */}
          <DesktopNavZone />

          <div className="flex-1" />

          {/* Right Action Zone */}
          <div className="flex items-center gap-1 md:gap-3 shrink-0">

            {/* Status Dot First - As requested [●] */}
            <div className="mr-1">
              <StatusIndicator />
            </div>

            {/* Search */}
            <div className="hidden lg:block relative group">
              <button 
                onClick={() => setShowSearch(true)}
                className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-gray-50/80 border border-black/[0.04] text-gray-400 hover:text-brand-teal hover:border-brand-teal/20 transition-all"
                title={t('searchMedicines')}
              >
                <Search size={16} className="md:w-4.5 md:h-4.5" />
              </button>
            </div>

            {/* Cart - Redesigned to be secondary style */}
            <button
              id="nav-cart-btn"
              onClick={() => dispatch(setCartOpen(true))}
              className="relative h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-xl bg-gray-50/80 border border-black/[0.04] text-gray-400 hover:text-brand-teal hover:border-brand-teal/20 transition-all group shrink-0"
              title={t('viewCart')}
            >
              <ShoppingCart size={16} className="md:w-4.5 md:h-4.5 group-hover:scale-110 transition-transform" />
              {totalQty > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 md:h-4.5 md:w-4.5 bg-brand-teal text-[#0a1628] rounded-full
                             flex items-center justify-center text-[7px] md:text-[9px] font-black ring-2 ring-white shadow-sm"
                >
                  {totalQty}
                </motion.span>
              )}
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button
                id="nav-user-btn"
                onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                className={`h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center transition-all duration-300 border
                            ${activeDropdown === 'user'
                              ? 'bg-[#0a1628] text-brand-teal border-[#0a1628] shadow-lg shadow-[#0a1628]/20'
                              : 'bg-gray-50/80 border border-black/[0.04] text-gray-400 hover:text-brand-teal hover:border-brand-teal/20'}`}
              >
                <User size={18} className={activeDropdown === 'user' ? 'scale-110 md:w-5 md:h-5' : 'md:w-5 md:h-5'} />
                {isAuthenticated && (
                   <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 bg-brand-teal rounded-full border border-white" />
                )}
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'user' && (
                  <UserDropdown user={user} isAuthenticated={isAuthenticated} onClose={closeAll} />
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger (Mobile Menu Toggle) - Integrated better */}
            <button
               className="lg:hidden h-9 w-9 rounded-xl bg-[#0a1628] text-brand-teal
                          flex items-center justify-center shadow-lg active:scale-95 transition-all ml-1"
               onClick={() => setMobileMenuOpen(true)}
            >
               <Menu size={18} />
            </button>

          </div>

        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => dispatch(setCartOpen(false))} />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0a1628]/80 backdrop-blur-sm z-[2000] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-[2001] shadow-2xl
                         lg:hidden flex flex-col border-r-4 border-brand-teal"
            >
              {/* Drawer header */}
              <div className="p-6 bg-[#0a1628] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-brand-teal/20 rounded-xl flex items-center justify-center">
                    <span className="text-brand-teal font-syne font-black text-xl uppercase">{user?.name?.[0] || 'M'}</span>
                  </div>
                  <div>
                    <p className="font-syne font-black text-white text-sm uppercase tracking-tight">{user?.name || 'Guest'}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 bg-brand-teal rounded-full animate-pulse" />
                      <span className="text-[10px] text-brand-teal font-black uppercase tracking-widest">{user?.role || 'Visitor'}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="h-10 w-10 bg-white/10 text-white rounded-xl flex items-center justify-center">
                  <X size={20} />
                </button>
              </div>

              {/* Drawer links */}
              <div className="flex-1 overflow-auto p-4 space-y-1">
                {[
                  { label: t('home')            || 'Home',         icon: Home,        to: '/'              },
                  { label: t('medicines')        || 'Medicines',    icon: Pill,        to: '/medicines'     },
                  { label: t('pharmacies')       || 'Pharmacies',   icon: Store,       to: '/pharmacies'    },
                  { label: t('teleconsultation') || 'Teleconsult',  icon: Stethoscope, to: '/doctors'       },
                  { label: t('prescriptions')    || 'Prescriptions',icon: FileText,    to: '/prescriptions' },
                  { label: t('myOrders')         || 'My Orders',    icon: Package,     to: '/orders'        },
                  { label: t('notifications')    || 'Notifications',icon: Bell,        to: '/notifications', badge: unreadNotifs },
                  { label: t('myWallet')         || 'Wallet',       icon: Wallet,      to: '/wallet', extra: '₹200' },
                ].map((item, idx) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-brand-teal/5
                                 transition-colors group text-[#0a1628]"
                    >
                      <div className="h-9 w-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400
                                      group-hover:bg-brand-teal group-hover:text-[#0a1628] transition-all duration-300">
                        <item.icon size={18} />
                      </div>
                      <span className="font-syne font-bold text-sm uppercase tracking-tight grow group-hover:text-brand-teal transition-colors">
                        {item.label}
                      </span>
                      {item.badge > 0 && (
                        <span className="h-5 w-5 bg-brand-teal text-[#0a1628] text-[10px] font-black rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      {item.extra && <span className="text-xs font-black text-brand-teal">{item.extra}</span>}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Drawer footer */}
              <div className="p-4 border-t border-gray-100 space-y-2 shrink-0">
                {/* Lang switcher */}
                <div className="flex gap-1 bg-gray-50 border border-black/[0.05] rounded-xl p-1">
                  {['en', 'ta'].map(l => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`flex-1 py-2 rounded-lg font-syne font-black text-[10px] uppercase tracking-widest transition-all
                                  ${lang === l ? 'bg-[#0a1628] text-brand-teal shadow-md' : 'text-gray-400'}`}
                    >
                      {l === 'en' ? 'English' : 'தமிழ்'}
                    </button>
                  ))}
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => { dispatch(logoutUser()).finally(() => { navigate('/login'); setMobileMenuOpen(false); }); }}
                    className="w-full flex items-center justify-center gap-2 p-3 rounded-xl
                               bg-red-50 text-red-500 hover:bg-red-500 hover:text-white
                               font-syne font-black text-xs uppercase tracking-widest transition-all duration-300"
                  >
                    <LogOut size={16} /> {t('logout') || 'Sign Out'}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
