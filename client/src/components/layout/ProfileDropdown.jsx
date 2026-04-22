import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, LogOut, ShoppingBag, Heart, FileText,
  Settings, ChevronRight, LogIn, UserPlus
} from 'lucide-react';
import { logoutUser, clearAuth } from '../../store/authSlice';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const { t } = useLanguage();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(false); }, [navigate]);

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => {
      dispatch(clearAuth());
      navigate('/login');
      setOpen(false);
    });
  };

  const menuItems = [
    { icon: User,      label: t('profile')       || 'My Profile',     path: '/profile'       },
    { icon: ShoppingBag, label: t('myOrders')    || 'My Orders',      path: '/orders'        },
    { icon: Heart,     label: t('wishlist')       || 'Wishlist',       path: '/wishlist'      },
    { icon: FileText,  label: t('prescriptions') || 'Prescriptions',  path: '/prescriptions' },
    { icon: Settings,  label: t('settings')      || 'Settings',       path: '/profile'       },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all"
        aria-label="Profile"
        aria-expanded={open}
      >
        {isAuthenticated && user?.avatar ? (
          <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" alt="avatar" />
        ) : (
          <User size={18} className="text-white" />
        )}
        {isAuthenticated && (
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-[#0a0f1e]" />
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-64 bg-[#12151f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[2000]">
          {isAuthenticated ? (
            <>
              {/* User info */}
              <div className="p-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.avatar
                      ? <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="avatar" />
                      : <User size={18} className="text-teal-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    <span className="text-[10px] text-teal-400 font-black uppercase tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {menuItems.map(item => (
                  <Link
                    key={item.path + item.label}
                    to={item.path}
                    onClick={() => setOpen(false)}
                  >
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm">
                      <item.icon size={16} className="flex-shrink-0 text-gray-400" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight size={14} className="opacity-30" />
                    </button>
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold"
                >
                  <LogOut size={16} />
                  {t('logout') || 'Sign Out'}
                </button>
              </div>
            </>
          ) : (
            /* Guest state */
            <div className="p-4 flex flex-col gap-2">
              <p className="text-gray-400 text-xs text-center mb-2">
                Sign in to access your account
              </p>
              <Link to="/login" onClick={() => setOpen(false)}>
                <button className="w-full bg-teal-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-teal-400 transition-all">
                  <LogIn size={16} /> {t('login') || 'Sign In'}
                </button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all">
                  <UserPlus size={16} /> {t('register') || 'Create Account'}
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
