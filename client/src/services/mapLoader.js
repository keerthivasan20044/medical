/**
 * Google Maps Dynamic Loader
 * Loads the Google Maps script into the application.
 */
export const loadGoogleMaps = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Maps Error: Google Maps API Key is missing. Map features disabled.');
      return;
    }
  
    if (window.google) return; // Already loaded
  
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('✅ Maps Loaded: Map features ready.');
    };
  };
