import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    // API Request Interceptor
    console.log(`[API] Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => {
    console.log(`[API] Response: ${res.status} ${res.config.url}`);
    return res;
  },
  async (error) => {
    const original = error.config;
    // Skip token refresh for auth-specific endpoints
    if (original.url?.includes('/api/auth/refresh') || original.url?.includes('/api/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      // Only attempts refresh if we have a local session record to avoid noise on public visits
      const hasAuthRecord = localStorage.getItem('medireach_auth_v1');
      if (!hasAuthRecord) {
        return Promise.reject(error);
      }
      
      original._retry = true;
      try {
        // Debounce refresh attempts - check if a refresh is already in progress via a global flag or short-lived timestamp
        const lastRefresh = sessionStorage.getItem('last_refresh_attempt');
        const now = Date.now();
        if (lastRefresh && now - parseInt(lastRefresh) < 2000) {
           return Promise.reject(error);
        }
        sessionStorage.setItem('last_refresh_attempt', now.toString());

        console.warn('[API] Session expired. Attempting token refresh...');
        await api.post('/api/auth/refresh');
        return api(original);
      } catch (e) {
        console.error('[API] Token refresh failed. Session cleared.');
        // Purge invalid session data to prevent persistent refresh failure spam
        localStorage.removeItem('medireach_auth_v1');
        localStorage.removeItem('medireach_cart_v1');
        // Don't force redirect here, let the app logic handle auth state
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
