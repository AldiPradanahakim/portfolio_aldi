import { useEffect, useState } from 'react';
import { subscribeScroll } from '../lib/scroll';

/** Reads the shared scroll position as a boolean; no component re-renders per frame. */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => subscribeScroll((y) => setScrolled(y > threshold)), [threshold]);

  return scrolled;
}
