import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/**
 * Locks page scrolling while `isLocked` is true.
 * Pauses Lenis so its RAF loop stops driving the page, and falls back to
 * `overflow: hidden` on the body when Lenis is unavailable (reduced motion).
 */
export const useScrollLock = (isLocked) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!isLocked) return;

    if (lenis) lenis.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      if (lenis) lenis.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [isLocked, lenis]);
};

export default useScrollLock;
