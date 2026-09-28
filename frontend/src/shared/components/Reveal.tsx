import type { ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import { cx } from '../lib/cn';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger inside a group, in ms */
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cx('reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
