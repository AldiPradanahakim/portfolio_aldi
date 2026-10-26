import { useEffect, useRef } from 'react';

/**
 * One shared, rAF-throttled scroll loop for every subscriber in the app. Each subscriber is an
 * element whose scrolled position is exposed as custom properties:
 *
 *   --p   element progress through the viewport, 0 (entering) → 1 (leaving)
 *   --y   the element's current top in viewport pixels
 *   --vp  viewport height in pixels
 *
 * The loop runs only while there are subscribers, and each subscriber only reads layout while an
 * IntersectionObserver says it is near the viewport — so off-screen elements cost nothing. No
 * React state is set per frame. Under `prefers-reduced-motion` the values are frozen at rest.
 */

type Subscriber = { element: HTMLElement; active: boolean };

const subscribers = new Set<Subscriber>();
let frame = 0;
let listening = false;
let onScroll: () => void = () => {};
let onResize: () => void = () => {};

function read() {
  frame = 0;
  const vh = window.innerHeight;
  for (const sub of subscribers) {
    if (!sub.element.isConnected) {
      subscribers.delete(sub);
      continue;
    }
    if (!sub.active) continue;
    const rect = sub.element.getBoundingClientRect();
    const span = rect.height + vh;
    const p = span > 0 ? Math.min(1, Math.max(0, (vh - rect.top) / span)) : 0;
    const style = sub.element.style;
    style.setProperty('--p', p.toFixed(4));
    style.setProperty('--y', rect.top.toFixed(1));
    style.setProperty('--vp', String(vh));
  }
  if (subscribers.size === 0 && listening) {
    listening = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(read);
}

function ensureListening() {
  if (listening) return;
  listening = true;
  onScroll = schedule;
  onResize = schedule;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
}

export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const freeze = (style: CSSStyleDeclaration) => {
      style.setProperty('--p', '1');
      style.setProperty('--y', '0');
      style.setProperty('--vp', String(window.innerHeight));
    };

    if (query.matches) {
      freeze(element.style);
      return;
    }

    const sub: Subscriber = { element, active: false };
    subscribers.add(sub);
    ensureListening();

    // Visibility gate: only elements near the viewport feed the shared loop.
    const io = new IntersectionObserver(
      (entries) => {
        sub.active = entries[0]?.isIntersecting ?? false;
        schedule();
      },
      { rootMargin: '60% 0px 60% 0px', threshold: 0 },
    );
    io.observe(element);
    schedule();

    const onReducedChange = () => {
      if (query.matches) freeze(element.style);
    };
    query.addEventListener('change', onReducedChange);

    return () => {
      query.removeEventListener('change', onReducedChange);
      io.disconnect();
      subscribers.delete(sub);
      if (frame) cancelAnimationFrame(frame);
      if (subscribers.size === 0) {
        listening = false;
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      }
    };
  }, []);

  return { ref };
}