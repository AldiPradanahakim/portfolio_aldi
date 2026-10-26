import { useEffect, useState } from 'react';

/**
 * Reads the document scroll position as a boolean; no component re-renders per frame. One
 * passive, rAF-throttled listener, so the fixed header reacts once content slides underneath.
 */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    read();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
