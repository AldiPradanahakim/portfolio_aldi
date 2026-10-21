import { useEffect, useRef, useState } from 'react';

/**
 * Writes pointer-driven custom properties onto a hero section — `--spot-x/--spot-y/--spot-on`
 * for the cursor-follow spotlight and `--par-x/--par-y` for the portrait parallax. One
 * rAF-throttled `pointermove` listener feeds both, and it is a no-op on touch or Reduce Motion.
 */
export function usePointerStage<T extends HTMLElement>(enabled = true, parallax = 7) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    const canHover =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!node || !enabled || !canHover) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const px = ((x / rect.width) - 0.5) * 2 * parallax;
      const py = ((y / rect.height) - 0.5) * 2 * parallax;
      node.style.setProperty('--spot-x', `${x}px`);
      node.style.setProperty('--spot-y', `${y}px`);
      node.style.setProperty('--spot-on', '1');
      node.style.setProperty('--par-x', `${px.toFixed(2)}px`);
      node.style.setProperty('--par-y', `${py.toFixed(2)}px`);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const leave = () => {
      node.style.setProperty('--spot-on', '0');
      node.style.setProperty('--par-x', '0px');
      node.style.setProperty('--par-y', '0px');
    };

    node.addEventListener('pointermove', move, { passive: true });
    node.addEventListener('pointerleave', leave);
    return () => {
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerleave', leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, parallax]);

  return ref;
}

/**
 * Read progress through the nearest scroll root — the deck panel (tagged `data-scroll-root`)
 * when one exists, otherwise the document. One passive, rAF-throttled listener, plus a resize
 * hook so the denominator stays honest.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const root = node.closest<HTMLElement>('[data-scroll-root]');
    let frame = 0;

    const read = () => {
      frame = 0;
      const top = root ? root.scrollTop : window.scrollY;
      const max = root
        ? root.scrollHeight - root.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, top / max)) : 0);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    if (root) root.addEventListener('scroll', onScroll, { passive: true });
    else window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (root) root.removeEventListener('scroll', onScroll);
      else window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}
