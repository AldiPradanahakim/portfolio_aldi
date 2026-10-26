import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../shared/lib/cn';
import { usePrefersReducedMotion } from '../shared/hooks/usePrefersReducedMotion';

interface TiltProps {
  children: ReactNode;
  className?: string;
  /** degrees at the card edge */
  max?: number;
}

/**
 * Pointer tilt writing `--rx/--ry` onto the node inside a rAF loop (no render per pointer
 * event), easing back on leave. Off for touch pointers and reduced motion.
 */
export function Tilt({ children, className, max = 6 }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let frame = 0;
    const target = { x: 0, y: 0 };

    const apply = () => {
      frame = 0;
      element.style.setProperty('--rx', `${target.x.toFixed(2)}deg`);
      element.style.setProperty('--ry', `${target.y.toFixed(2)}deg`);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = element.getBoundingClientRect();
      const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      target.x = -py * max;
      target.y = px * max;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const enter = () => {
      element.style.transition = 'transform 80ms linear';
    };

    const leave = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      target.x = 0;
      target.y = 0;
      element.style.transition = 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)';
      apply();
    };

    element.addEventListener('pointermove', move);
    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
    };
  }, [reduced, max]);

  return (
    <div ref={ref} className={cx('tilt', className)}>
      {children}
    </div>
  );
}