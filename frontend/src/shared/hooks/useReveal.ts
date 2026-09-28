import { useEffect, useRef } from 'react';

let observer: IntersectionObserver | null = null;

/** One shared observer for every reveal in the app; each target is unobserved once it fires. */
const getObserver = () => {
  if (observer) return observer;
  if (typeof IntersectionObserver === 'undefined') return null;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        const target = entry.target as HTMLElement;
        target.dataset.revealed = 'true';
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  return observer;
};

/**
 * Reveal-on-scroll without a scroll listener: the observer toggles data-revealed on the
 * element and the CSS in index.css does the transition (opacity + transform only).
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const shared = getObserver();
    if (!shared) {
      element.dataset.revealed = 'true';
      return;
    }
    shared.observe(element);
    return () => shared.unobserve(element);
  }, []);

  return ref;
}
