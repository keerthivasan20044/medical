const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Normalizes image URLs from the backend.
 * Replaces localhost:5001 with the current API base URL.
 */
export const normalizeUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  
  // If it's a relative path starting with /api or /uploads, prepend the base
  if (url.startsWith('/uploads')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // Replace localhost references with the production API URL or origin
  if (url.includes('localhost:5001')) {
    return url.replace('http://localhost:5001', API_BASE_URL);
  }
  
  return url;
};
