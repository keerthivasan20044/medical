import { useEffect, useRef } from 'react';

/**
 * Custom hook for infinite scroll.
 * @param {Function} callback - Function to call when bottom is reached.
 * @param {boolean} hasMore - Whether there are more items to load.
 * @param {boolean} loading - Whether a load is already in progress.
 */
export function useInfiniteScroll(callback, hasMore, loading) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          callback();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Start loading before the user hits the absolute bottom
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [callback, hasMore, loading]);

  return observerTarget;
}

export default useInfiniteScroll;
