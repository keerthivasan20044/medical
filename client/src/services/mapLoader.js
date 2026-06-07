/**
 * Google Maps Dynamic Loader
 * Loads the Google Maps script once and returns a promise callers can await.
 */
let mapsPromise = null;
let hasWarnedMissingKey = false;

export const loadGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey === 'YOUR_KEY_HERE' || apiKey === 'your_google_maps_key_here') {
    if (!hasWarnedMissingKey) {
      console.warn('Maps Error: Google Maps API key not configured. Maps disabled.');
      hasWarnedMissingKey = true;
    }
    return Promise.resolve(null);
  }

  if (window.google?.maps) return Promise.resolve(window.google.maps);
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google?.maps || null), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (import.meta.env.DEV) console.log('Maps Loaded: Map features ready.');
      resolve(window.google?.maps || null);
    };

    script.onerror = () => {
      console.warn('Maps Error: Failed to load Google Maps script.');
      script.remove();
      mapsPromise = null;
      reject(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);
  });

  return mapsPromise;
};
