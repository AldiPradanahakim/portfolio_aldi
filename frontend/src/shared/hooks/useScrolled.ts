import { useEffect, useState } from 'react';

/**
 * Reads the shared scroll position as a boolean; no component re-renders per frame. One capture
 * listener sees both the window (ScrollManager's territory) and the deck panel's own scroll box
 * (`data-scroll-root`), so the header still reacts once a panel starts scrolling internally.
 */
export function useScrolled(threshold = 16): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = (event?: Event) => {
      frame = 0;
      const target = event?.target;
      const root =
        target instanceof Element
          ? target.closest<HTMLElement>('[data-scroll-root]')
          : document.querySelector<HTMLElement>('[data-scroll-root]');
      const y = root ? root.scrollTop : window.scrollY;
      setScrolled(y > threshold);
    };

    const onScroll = (event: Event) => {
      if (!frame) frame = requestAnimationFrame(() => read(event));
    };

    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    read();

    return () => {
      document.removeEventListener('scroll', onScroll, true);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
