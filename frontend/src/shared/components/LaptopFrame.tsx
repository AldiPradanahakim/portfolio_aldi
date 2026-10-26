import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { cx } from '../lib/cn';

interface LaptopFrameProps {
  /** cover screenshot; null renders the initials placeholder instead */
  src: string | null;
  alt: string;
  initials: string;
  className?: string;
}

/**
 * A screenshot shown inside a laptop, not as a bare card image: lid, bezel, base and notch are
 * CSS only, so one markup tree reads as hardware at every size. The screen takes the cover's own
 * ratio (the assets range from 16:10 to 2:1) — a fixed box would crop the app's side panel.
 *
 * The lid tilts toward the pointer in 3D and springs back on leave; reduced motion keeps it flat.
 */
export function LaptopFrame({ src, alt, initials, className }: LaptopFrameProps) {
  const reduced = useReducedMotion();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 220, damping: 24, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-1, 1], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [-1, 1], [7, -7]), spring);

  const track = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    px.set(((event.clientX - box.left) / box.width) * 2 - 1);
    py.set(((event.clientY - box.top) / box.height) * 2 - 1);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={boxRef}
      onPointerMove={track}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={cx('laptop', className)}
    >
      <div className="laptop-lid">
        <div className="laptop-screen">
          {src ? (
            <img src={src} alt={alt} loading="lazy" decoding="async" />
          ) : (
            <span aria-hidden="true" className="laptop-fallback">
              {initials.toUpperCase()}
            </span>
          )}
          <span aria-hidden="true" className="laptop-glare" />
        </div>
      </div>
      <span aria-hidden="true" className="laptop-base">
        <span className="laptop-notch" />
      </span>
    </motion.div>
  );
}
