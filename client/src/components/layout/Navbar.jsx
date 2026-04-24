import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search, ShoppingCart, User, Menu, X,
  Sun, Moon, Phone, Pill, ChevronRight,
  Home, Stethoscope, Info, Store, LogOut,
  Bell, FileText, Package, Wallet
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useLanguage } from '../../context/LanguageContext';
import { logoutUser } from '../../store/authSlice';
import { setCartOpen } from '../../store/uiSlice';
import CartDrawer from '../cart/CartDrawer';

// ─── Theme helper (inline, no ThemeContext needed) ────────────────────────────
const getInitialTheme = () => {
  try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; }
};

// ─── Search Overlay (self-contained) ─────────────────────────────────────────
function SearchOverlayLocal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-[#0a0f1e]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-2xl space-y-6">
        <h2 className="text-center font-black text-4xl text-white uppercase tracking-tight">
          Find <span className="text-teal-400">Medicines</span>
        </h2>
        <form onSubmit={handleSearch} className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search medicines, pharmacies, doctors..."
            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-16 py-4 text-white placeholder-gray-500 outline-none focus:border-teal-400 transition-all text-lg"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-teal-400 text-[#0a0f1e] font-black px-4 py-2 rounded-xl text-sm hover:scale-105 active:scale-95 transition-all"
          >
            Go
          </button>
        </form>

        <div className="flex flex-wrap gap-2 justify-center">
          {['Paracetamol', 'Vitamin D', 'Insulin', 'Dolo 650', 'Cetirizine'].map(tag => (
            <button
              key={tag}
              onClick={() => { setQuery(tag); }}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400 text-sm hover:text-white hover:border-teal-400/50 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const { isConnected } = useSocket();
  const { t, lang, setLang } = useLanguage();
  const { totalQuantity } = useSelector(s => s.cart);
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { items: notifs } = useSelector(s => s.notifications);
  const unreadNotifs = notifs.filter(n => !n.isRead).length;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckoutPage = location.pathname === '/checkout' || location.pathname.startsWith('/orders/track');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Theme toggle
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('theme', next); } catch {}
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { label: t('medicines') || 'Buy',          path: '/medicines',  icon: Pill       },
    { label: t('pharmacies') || 'Pharmacies',  path: '/pharmacies', icon: Store      },
    { label: t('teleconsultation') || 'Doctor',path: '/doctors',    icon: Stethoscope},
    { label: t('about') || 'About',            path: '/about',      icon: Info       },
  ];

  const drawerLinks = [
    { icon: Home,         label: t('home') || 'Home',                path: '/'              },
    { icon: Pill,         label: t('medicines') || 'Buy Medicines',   path: '/medicines'     },
    { icon: Store,        label: t('pharmacies') || 'Pharmacies',     path: '/pharmacies'    },
    { icon: Stethoscope,  label: t('teleconsultation') || 'Doctor',   path: '/doctors'       },
    { icon: FileText,     label: t('prescriptions') || 'Prescriptions',path: '/prescriptions'},
    { icon: Package,      label: t('myOrders') || 'My Orders',        path: '/orders'        },
    { icon: Wallet,       label: t('myWallet') || 'Wallet',           path: '/wallet'        },
    { icon: Info,         label: t('about') || 'About',               path: '/about'         },
  ];

  return (
    <>
      {/* ================================================================
          DESKTOP NAVBAR — hidden on mobile (md:flex)
      ================================================================ */}
      <nav className={`
        hidden md:flex
        fixed top-0 left-0 right-0 z-50 h-16
        items-center justify-between px-6 lg:px-8
        transition-all duration-300
        ${scrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-slate-900'
        }
      `}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
          <div className="w-9 h-9 bg-teal-500/20 rounded-xl flex items-center justify-center">
            <Pill size={18} className="text-teal-400" />
          </div>
          <span className="font-black text-xl text-white max-w-[140px] truncate whitespace-nowrap">
            Medi<span className="text-teal-400">Pharm</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}>
              <button className={`px-2 py-2 rounded-xl font-bold text-sm transition-all ${
                isActive(link.path)
                  ? 'bg-teal-500/20 text-teal-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}>
                {link.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="hidden lg:flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full mr-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-teal-400 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-xs font-bold ${isConnected ? 'text-teal-400' : 'text-red-400'}`}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
            aria-label="Search"
          >
            <Search size={18} className="text-white" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark'
              ? <Sun size={18} className="text-yellow-400" />
              : <Moon size={18} className="text-teal-400" />
            }
          </button>

          {/* Notifications */}
          {isAuthenticated && (
            <Link to="/notifications">
              <button className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all" aria-label="Notifications">
                <Bell size={18} className="text-white" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-black flex items-center justify-center">
                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                  </span>
                )}
              </button>
            </Link>
          )}

          {/* Cart */}
          {!isCheckoutPage && !isAuthPage && (
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
              aria-label="Cart"
            >
              <ShoppingCart size={18} className="text-white" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full text-white text-[10px] font-black flex items-center justify-center">
                  {totalQuantity > 9 ? '9+' : totalQuantity}
                </span>
              )}
            </button>
          )}

          {/* Profile */}
          <Link to={isAuthenticated ? '/profile' : '/login'}>
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all" aria-label="Profile">
              <User size={18} className="text-white" />
            </button>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-11 h-11 bg-[#12151f] hover:bg-white/10 rounded-xl flex items-center justify-center transition-all ml-1 border border-white/10"
            aria-label="Menu"
          >
            <Menu size={18} className="text-white" />
          </button>
        </div>
      </nav>

      {/* ================================================================
          MOBILE NAVBAR — hidden on desktop (flex md:hidden)
      ================================================================ */}
      <nav className={`
        flex md:hidden
        fixed top-0 left-0 right-0 z-50 h-14
        items-center justify-between px-4
        transition-all duration-300
        bg-slate-900 border-b border-white/10
      `}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 whitespace-nowrap">
          <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
            <Pill size={16} className="text-teal-400" />
          </div>
          <span className="font-black text-lg text-white whitespace-nowrap">
            Medi<span className="text-teal-400">Pharm</span>
          </span>
        </Link>

        {/* Mobile Right — minimal */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center min-h-11 min-w-11"
            aria-label="Search"
          >
            <Search size={20} className="text-white" />
          </button>

          {/* Cart */}
          {!isCheckoutPage && !isAuthPage && (
            <button
              onClick={() => dispatch(setCartOpen(true))}
              className="relative w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center min-h-11 min-w-11"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className="text-white" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-black flex items-center justify-center min-w-5 h-5">
                  {totalQuantity > 9 ? '9+' : totalQuantity}
                </span>
              )}
            </button>
          )}

          {/* Profile */}
          <Link to={isAuthenticated ? '/profile' : '/login'}>
            <button className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center min-h-11 min-w-11" aria-label="Profile">
              <User size={20} className="text-white" />
            </button>
          </Link>

          {/* Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 min-h-11 min-w-11"
            aria-label="Menu"
          >
            <Menu size={24} className="text-white" />
          </button>
        </div>
      </nav>

      {/* ================================================================
          SLIDE-IN DRAWER — works for both desktop & mobile
      ================================================================ */}
      {menuOpen && (
        <div className="fixed inset-0 z-[999] flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="w-80 max-w-[85vw] h-screen bg-slate-900 border-l border-white/10 flex flex-col overflow-y-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
              <div>
                <span className="font-black text-white text-lg">
                  Medi<span className="text-teal-400">Pharm</span>
                </span>
                {isAuthenticated && user && (
                  <p className="text-xs text-gray-500 mt-0.5">{user.name}</p>
                )}
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="p-3 flex-1 space-y-0.5">
              {drawerLinks.map(item => (
                <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}>
                  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                    isActive(item.path)
                      ? 'bg-teal-500/20 text-teal-400'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}>
                    <item.icon size={18} className="flex-shrink-0" />
                    <span className="grow">{item.label}</span>
                    <ChevronRight size={14} className="opacity-30" />
                  </button>
                </Link>
              ))}
            </div>

            {/* Language switcher */}
            <div className="px-3 py-2 border-t border-white/10 shrink-0">
              <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                {['en', 'ta'].map(l => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      lang === l ? 'bg-[#0a1628] text-teal-400 shadow' : 'text-gray-500'
                    }`}
                  >
                    {l === 'en' ? 'English' : 'தமிழ்'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme toggle */}
            <div className="px-3 py-2 shrink-0">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
              >
                {theme === 'dark'
                  ? <Sun size={18} className="text-yellow-400" />
                  : <Moon size={18} className="text-teal-400" />
                }
                <span className="text-white font-bold text-sm grow text-left">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-all ${
                  theme === 'dark' ? 'bg-teal-500' : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </div>
              </button>
            </div>

            {/* Logout / Login */}
            <div className="px-3 pb-2 shrink-0">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    dispatch(logoutUser()).finally(() => {
                      navigate('/login');
                      setMenuOpen(false);
                    });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all"
                >
                  <LogOut size={16} /> {t('logout') || 'Sign Out'}
                </button>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-[#0a0f1e] font-black text-xs uppercase tracking-widest transition-all">
                    <User size={16} /> Sign In
                  </button>
                </Link>
              )}
            </div>

            {/* Emergency */}
            <div className="p-3 border-t border-white/10 shrink-0">
              <a href="tel:108">
                <button className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm">
                  <Phone size={16} /> Emergency — Call 108
                </button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          SEARCH OVERLAY
      ================================================================ */}
      <SearchOverlayLocal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ================================================================
          CART DRAWER
      ================================================================ */}
      <CartDrawer />
    </>
  );
}
