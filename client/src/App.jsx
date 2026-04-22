import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRouter from './routes/AppRouter.jsx';
import DistrictCommandBar from './components/layout/DistrictCommandBar.jsx';
import EmergencyFAB from './components/layout/EmergencyFAB.jsx';
import MobileBottomNav from './components/layout/MobileBottomNav.jsx';
import SocketListener from './components/layout/SocketListener.jsx';
import { fetchMe } from './store/authSlice.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { loadGoogleMaps } from './services/mapLoader.js';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import ScrollToTopButton from './components/common/ScrollToTopButton.jsx';
import InstallPrompt from './components/InstallPrompt.jsx';

import Layout from './components/layout/Layout.jsx';

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideBars = ['/verify-otp', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    dispatch(fetchMe());
    loadGoogleMaps();
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <InstallPrompt />
      <SocketListener />
      
      {hideBars ? (
        <AppRouter />
      ) : (
        <Layout isAuthPage={isAuthPage}>
          <AppRouter />
        </Layout>
      )}

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
