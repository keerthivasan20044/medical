/**
 * Google Maps Dynamic Loader
 * Injects the Geospatial Node script into the terminal environment.
 */
export const loadGoogleMaps = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ Maps Node: VITE_GOOGLE_MAPS_API_KEY is missing. Geospatial features disabled.');
      return;
    }
  
    if (window.google) return; // Already loaded
  
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    script.onload = () => {
      console.log('✅ Maps Node: Geospatial Architecture Synchronized.');
    };
  };
