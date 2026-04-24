/**
 * Google Maps Dynamic Loader
 * Loads the Google Maps script into the application once.
 * Safe against React StrictMode double-invocation.
 */
export const loadGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ Maps Error: Google Maps API Key is missing. Map features disabled.');
    return;
  }

  // Already fully loaded
  if (window.google?.maps) return;

  // Script tag already injected (guards against React StrictMode double-fire)
  const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
  if (existingScript) return;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
if (import.meta.env.DEV) { console.log('✅ Maps Loaded: Map features ready.'); }
  };

  script.onerror = () => {
    console.warn('⚠️ Maps Error: Failed to load Google Maps script.');
    script.remove(); // Allow retry on next attempt
  };
};
