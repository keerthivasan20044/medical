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

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const hideBars = ['/login', '/register', '/verify-otp', '/forgot-password', '/reset-password'].includes(location.pathname);
  const hideEmergency = ['/about', '/checkout', '/cart'].includes(location.pathname);

  // Rehydrate auth session from cookie on every page load/refresh
  useEffect(() => {
    dispatch(fetchMe());
    
    // Load Maps and Location Services
    loadGoogleMaps();
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <InstallPrompt />
      <SocketListener />
      <ScrollToTopButton />
      <AppRouter />
      {!hideBars && (
        <>
          <DistrictCommandBar />
          {!hideEmergency && <EmergencyFAB />}
          <MobileBottomNav />
        </>
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
