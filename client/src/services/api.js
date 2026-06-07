import axios from 'axios';

const defaultApiUrl =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:5001`
    : 'http://localhost:5001';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
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
      
      // Only redirect if NOT on a public page or specifically a private page
      const publicPaths = [
        '/',
        '/about',
        '/blog',
        '/compare',
        '/contact',
        '/doctors',
        '/emergency',
        '/faq',
        '/forgot-password',
        '/hospitals',
        '/login',
        '/medicine',
        '/medicines',
        '/offers',
        '/otp',
        '/pharmacies',
        '/register',
        '/reset-password',
        '/search',
        '/vaccines'
      ];
      const currentPath = window.location.pathname;
      
      const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path + '/'));
      
      if (!isPublicPath) {
        window.location.href = '/login';
      }
    } else if (import.meta.env.DEV) {
       console.error(`[API] Error: ${status} ${url}`, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export default api;
