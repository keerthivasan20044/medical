import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { store } from './store/store.js';
import './index.css';

import { SocketProvider } from './context/SocketContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Clean up stale service workers/caches that can break Vite HMR and external scripts.
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => {});

  if ('caches' in window) {
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).catch(() => {});
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <SocketProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
