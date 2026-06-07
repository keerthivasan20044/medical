import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './routes/AppRouter';
import DistrictCommandBar from './components/layout/DistrictCommandBar';
import EmergencyFAB from './components/layout/EmergencyFAB';
import MobileBottomNav from './components/layout/MobileBottomNav';
import SocketListener from './components/layout/SocketListener';
import { fetchMe } from './store/authSlice.js';
import ErrorBoundary from './components/common/ErrorBoundary';
import { loadGoogleMaps } from './services/mapLoader.js';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';
import InstallPrompt from './components/InstallPrompt';

import Layout from './components/layout/Layout';

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const didRunStartupChecks = useRef(false);
  const isDashboard = location.pathname.startsWith('/admin') || 
                      location.pathname.startsWith('/pharmacist') || 
                      location.pathname.startsWith('/delivery');
  const authUtilityRoutes = ['/verify-otp', '/forgot-password', '/reset-password'];
  const transactionRoutes = ['/cart', '/checkout'];
  const hasBottomAction = transactionRoutes.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`));
  const hideBottomNav = authUtilityRoutes.includes(location.pathname);
  const hideNavbar = isDashboard;
  const hideExtras = isDashboard || authUtilityRoutes.includes(location.pathname) || hasBottomAction;

  useEffect(() => {
    if (didRunStartupChecks.current) return;
    didRunStartupChecks.current = true;

    const hasToken = Boolean(localStorage.getItem('authToken'));
    if (hasToken || isAuthenticated) {
      dispatch(fetchMe());
    }

    loadGoogleMaps();
  }, [dispatch, isAuthenticated]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <InstallPrompt />
      <SocketListener />
      
      <Layout hideNavbar={hideNavbar} hideBottomNav={hideBottomNav} hideExtras={hideExtras}>
        <AppRouter />
      </Layout>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'toast-slide',
          style: {
            background: '#ffffff',
            color: '#0a1628',
            border: '1px solid #e5e7eb',
            boxShadow: '0 12px 24px rgba(2,128,144,0.12)'
          }
        }}
      />
    </ErrorBoundary>
  );
}
