import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../shared/lib/cn';

interface MarqueeProps {
  children: ReactNode;
  /** seconds per full loop */
  duration?: number;
  direction?: 1 | -1;
  /** copies per group; raise it when the content is narrower than the viewport */
  repeat?: number;
  className?: string;
}

/**
 * Seamless CSS marquee: a duplicated track animates -50% on a composited transform. Paused on
 * hover/focus; the whole track is static under reduced motion (where the duplicate is hidden).
 *
 * `repeat` exists because the loop is a translate, not a wrap: if one group is narrower than the
 * viewport the track runs out and the band ends in blank space. Short content passes a count that
 * covers the widest screen; long content (a stack list) leaves it at 1.
 */
export function Marquee({ children, duration = 42, direction = 1, repeat = 1, className }: MarqueeProps) {
  const copies = Array.from({ length: repeat }, (_, index) => (
    <Fragment key={index}>{children}</Fragment>
  ));

  return (
    <div className={cx('marquee', className)}>
      <div
        className="marquee-track"
        data-direction={direction === 1 ? undefined : '-1'}
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className="marquee-group">{copies}</div>
        <div className="marquee-group" aria-hidden="true">
          {copies}
        </div>
      </div>
    </div>
  );
}