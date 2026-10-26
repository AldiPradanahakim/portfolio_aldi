import type { ReactNode } from 'react';
import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Marquee } from '../../motion/Marquee';
import { cx } from '../lib/cn';

/**
 * A full-bleed band of oversized type between two sections. It drifts horizontally with scroll
 * position (so it moves in both directions, not just on first reveal) and takes a slight vertical
 * skew from the scroll spring, which is what gives it the "weight sliding past" feel.
 */
export function TickerBand({
  children,
  className,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });
  const x = useTransform(smooth, [0, 1], reverse ? ['-6%', '6%'] : ['6%', '-6%']);
  const skewY = useTransform(smooth, [0, 0.5, 1], reverse ? [2.4, 0, -2.4] : [-2.4, 0, 2.4]);

  return (
    <div ref={ref} aria-hidden="true" className={cx('ticker-band', className)}>
      <motion.div style={{ x, skewY }}>
        <Marquee duration={38} direction={reverse ? -1 : 1}>
          {/* repeated so one group is always wider than the viewport; otherwise the track
              scrolls a short label past a lot of empty space */}
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="ticker-pair">
              <span className="ticker-item">{children}</span>
              <span className="ticker-dot" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </div>
  );
}
