import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Hairline ember reading line at the very top. Motion's scroll tracking replaces the hand-rolled
 * rAF listener; the spring keeps the line from snapping between scroll events.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <div aria-hidden="true" className="progress-rail">
      <motion.span className="progress-fill" style={{ scaleX, transformOrigin: '0% 50%' }} />
    </div>
  );
}
