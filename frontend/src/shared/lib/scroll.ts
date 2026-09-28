type Listener = (y: number) => void;

/**
 * The app's single scroll listener lives here. Everything else (the nav's scrolled state,
 * scroll restoration) subscribes to it, so exactly one rAF-throttled passive listener exists.
 */
const listeners = new Set<Listener>();
let frame = 0;
let currentY = 0;

const flush = () => {
  frame = 0;
  currentY = window.scrollY;
  for (const listener of listeners) listener(currentY);
};

const onScroll = () => {
  if (frame) return;
  frame = requestAnimationFrame(flush);
};

export const subscribeScroll = (listener: Listener) => {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener('scroll', onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }
  };
};

/** Last observed scroll position — read at navigation time without touching the DOM. */
export const currentScrollY = () => currentY;

const positions = new Map<string, number>();

export const rememberScroll = (key: string, y: number) => {
  positions.set(key, y);
};

/** Null when this history entry was never visited, so a fresh load is left alone. */
export const recallScroll = (key: string): number | null => positions.get(key) ?? null;
