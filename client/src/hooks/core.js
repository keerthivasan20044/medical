import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Persists value to local storage system.
 * @param {string} key 
 * @param {any} defaultValue 
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const json = localStorage.getItem(key);
    if (json !== null) return JSON.parse(json);
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

/**
 * Provides user GPS for Karaikal area detection step.
 */
export function useGeolocation() {
  const [location, setLocation] = useState({ lat: null, lng: null, accuracy: null, error: null });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(l => ({ ...l, error: 'Location is not supported by this browser' }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => setLocation({ 
        lat: pos.coords.latitude, 
        lng: pos.coords.longitude, 
        accuracy: pos.coords.accuracy,
        error: null 
      }),
      (err) => setLocation(l => ({ ...l, error: err.message })),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}

/**
 * Debounce value changes to optimize system searches.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Animated number counter for dashboard yields.
 */
export function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(percentage * target));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

/**
 * Media query detector for responsive system checks.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * Closes dropdowns when clicking outside the area item.
 */
export function useClickOutside(ref, callback) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      callback(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, callback]);
}

/**
 * Connects to socket.io medical server system.
 */
export function useSocket(token) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Implementation would go here with socket.io-client
    // console.log('Updateing with socket area...', token);
    return () => {
      // socket.disconnect();
    };
  }, [token]);

  return socket;
}


/**
 * Unified toast notification bridge.
 */
export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    warning: (msg) => toast.error(msg, { icon: '⚠️' }),
    info: (msg) => toast(msg, { icon: 'ℹ️' }),
    loading: (msg) => toast.loading(msg)
  };
}

/**
 * Infinite scroll detector for result grids.
 */
export function useInfiniteScroll(ref, callback) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback();
      },
      { threshold: 1.0 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, callback]);
}
