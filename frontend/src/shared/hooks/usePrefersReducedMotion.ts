import { useEffect, useState } from 'react';

/**
 * framer-motion's own useReducedMotion reads the media query once at mount and never
 * resubscribes, so a visitor who turns Reduce Motion on mid-session keeps the animation
 * until a reload. Subscribe explicitly instead. Shared by the lightbox and the loader.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
