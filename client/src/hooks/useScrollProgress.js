import { useState, useEffect, useRef } from 'react';

export const useScrollProgress = () => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const height = ref.current.offsetHeight;
      if (height === 0) return;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.min(1, scrolled / height);
      setProgress(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { ref, progress };
};

export default useScrollProgress;
