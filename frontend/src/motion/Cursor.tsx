import { useEffect, useRef } from 'react';

/**
 * Ember dot + eased ring that follows the pointer and grows over `[data-cursor="link"|"view"|
 * "drag"]` targets. Non-interactive (`pointer-events:none`, `aria-hidden`), never focused, and
 * hidden entirely on touch and under reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const place = (element: HTMLElement, px: number, py: number) => {
      element.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
    };

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      place(dot, x, y);
      place(ring, rx, ry);
      if (Math.abs(x - rx) < 0.4 && Math.abs(y - ry) < 0.4) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const wake = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const setMode = (element: EventTarget | null) => {
      const target =
        element instanceof Element ? element.closest<HTMLElement>('[data-cursor]') : null;
      ring.dataset.mode = target?.getAttribute('data-cursor') ?? '';
    };

    const over = (event: MouseEvent) => setMode(event.target);
    const out = (event: MouseEvent) => {
      if (!event.relatedTarget) {
        place(dot, -100, -100);
        place(ring, -100, -100);
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      }
    };

    document.addEventListener('mousemove', wake);
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      document.removeEventListener('mousemove', wake);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="cursor-dot"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="cursor-ring"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
}