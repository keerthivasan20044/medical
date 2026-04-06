import { useEffect, useRef, useState } from 'react';

export function useOtpTimer({ duration = 60, autoStart = true } = {}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef(null);

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = (value = duration) => {
    stop();
    setTimeLeft(value);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reset = () => start(duration);

  useEffect(() => {
    if (autoStart) start(duration);
    return () => stop();
  }, []);

  return {
    timeLeft,
    isExpired: timeLeft === 0,
    start,
    reset,
    stop
  };
}
