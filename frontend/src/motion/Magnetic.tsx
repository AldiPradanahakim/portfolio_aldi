import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../shared/lib/cn';
import { usePrefersReducedMotion } from '../shared/hooks/usePrefersReducedMotion';

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** max pull in px; kept at or below 8 */
  strength?: number;
}

/**
 * Pointer-magnetic wrapper. On fine pointers the child drifts toward the cursor (≤8px),
 * snapping back with an expo ease on leave. Off entirely for touch and reduced motion.
 */
export function Magnetic({ children, className, strength = 8 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      element.style.setProperty('--mx', `${x.toFixed(2)}px`);
      element.style.setProperty('--my', `${y.toFixed(2)}px`);
    };

    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      x = ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength;
      y = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength;
      element.style.transition = 'transform 120ms linear';
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const leave = () => {
      x = 0;
      y = 0;
      element.style.transition = 'transform 480ms cubic-bezier(0.16, 1, 0.3, 1)';
      paint();
    };

    element.addEventListener('mousemove', move);
    element.addEventListener('mouseleave', leave);
    return () => {
      element.removeEventListener('mousemove', move);
      element.removeEventListener('mouseleave', leave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, strength]);

  return (
    <span ref={ref} className={cx('magnetic', className)}>
      {children}
    </span>
  );
}