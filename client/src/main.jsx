import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './store/store.js';
import './index.css';

import { SocketProvider } from './context/SocketContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { checkClientEnv } from './utils/envCheck.js';

// Perform health checks on client environment
checkClientEnv();

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Clean up stale service workers/caches that can break Vite HMR and external scripts.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});

  if ('caches' in window) {
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).catch(() => {});
  }
}


// Basic Error Boundary for Production Debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("CRITICAL APP ERROR:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#0a1628', color: '#ff4d4d', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>System Architecture Failure</h1>
          <p style={{ color: '#fff', opacity: 0.6 }}>The application encountered a terminal runtime error.</p>
          <pre style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', overflow: 'auto', marginTop: '20px' }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '12px 24px', background: '#02C39A', border: 'none', borderRadius: '8px', color: '#0a1628', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Retry System Sync
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

console.log("MediPharm Hub: Initializing Telemetry...");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <SocketProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </SocketProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

console.log("MediPharm Hub: Mount Protocol Successful.");
