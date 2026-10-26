import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** passed straight to the observer; a slight negative bottom waits for real visibility */
  rootMargin?: string;
  threshold?: number;
  /** disconnect after the first intersection (default) */
  once?: boolean;
}

/**
 * One IntersectionObserver per component. Toggles `inView` and, with `once`, disconnects
 * after the first hit so the observer never lingers. No scroll listener.
 */
export function useInView<T extends Element>({
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.15,
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, inView };
}