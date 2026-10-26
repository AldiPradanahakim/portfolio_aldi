import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger inside a group, in seconds */
  delay?: number;
  /** disable the blur leg of the reveal (e.g. over a large image) */
  blur?: boolean;
}

/**
 * Generic block reveal: fade + rise + optional blur, played once when the block enters the
 * viewport. Motion's `whileInView` replaces the old IntersectionObserver + CSS attribute dance,
 * and `useReducedMotion` skips the travel entirely.
 */
export function Reveal({ children, className, delay = 0, blur = true }: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 24, filter: blur && !reduced ? 'blur(6px)' : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      // `once: false` so the reveal replays when the block is scrolled back into view
      viewport={{ once: false, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
