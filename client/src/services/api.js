import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (import.meta.env.DEV) { 
    console.log(`[API] Request: ${config.method.toUpperCase()} ${config.url}`); 
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) { 
      console.log(`[API] Response: ${response.status} ${response.config.url}`); 
    }
    return response;
  },
  (error) => {
    const url = error.config?.url || '';
    const status = error.response?.status;

    // Suppress expected 401 logs for /users/me
    if (status === 401 && url.includes('/users/me')) {
       return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem('authToken');
      // Only redirect if we're not already on the login/register/otp pages to avoid loops
      const publicPaths = ['/login', '/register', '/otp', '/forgot-password'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    } else if (import.meta.env.DEV) {
       console.error(`[API] Error: ${status} ${url}`, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default api;
