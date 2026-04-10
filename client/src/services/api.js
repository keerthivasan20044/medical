import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    // Master Node Request Sync
    console.log(`[API] Synchronizing ${config.method.toUpperCase()} to ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => {
    console.log(`[API] Node Synchronized: ${res.status} from ${res.config.url}`);
    return res;
  },
  async (error) => {
    const original = error.config;
    // Skip refresh pulse for auth-specific endpoints to avoid recursion
    if (original.url?.includes('/api/auth/refresh') || original.url?.includes('/api/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      // Only attempts refresh if we have a local session record to avoid noise on public visits
      const hasAuthRecord = localStorage.getItem('medipharm_auth_v1');
      if (!hasAuthRecord) {
        return Promise.reject(error);
      }

      original._retry = true;
      try {
        console.warn('[API] Auth Node Expired. Attempting Architecture Refresh...');
        await api.post('/api/auth/refresh');
        return api(original);
      } catch (e) {
        console.error('[API] Resilience Protocol Failed.');
        // Purge invalid session data to prevent persistent refresh failure spam
        localStorage.removeItem('medipharm_auth_v1');
        localStorage.removeItem('medipharm_cart_v1');
        // Don't force redirect here, let the app logic handle auth state
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
