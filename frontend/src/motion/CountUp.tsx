import { useEffect, useRef, useState } from 'react';
import { cx } from '../shared/lib/cn';
import { useInView } from './useInView';
import { usePrefersReducedMotion } from '../shared/hooks/usePrefersReducedMotion';

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

const PATTERN = /^([^0-9]*)([0-9][0-9.,]*)([^0-9]*)$/;

interface Parsed {
  prefix: string;
  number: number;
  suffix: string;
  decimals: number;
}

function parse(value: string): Parsed {
  const match = value.match(PATTERN);
  if (!match) return { prefix: '', number: 0, suffix: value, decimals: 0 };
  const raw = match[2];
  // thousand separators are rare in the CMS metrics; strip them, keep the decimal count
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  return {
    prefix: match[1],
    number: parseFloat(raw.replace(/,/g, '')),
    suffix: match[3],
    decimals,
  };
}

const format = (parsed: Parsed, current: number) =>
  `${parsed.prefix}${current.toFixed(parsed.decimals)}${parsed.suffix}`;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Animates numeric metric values ("120+", "3.2k", "99.9%") once in view, preserving any
 * prefix/suffix. Reduced motion lands on the final value immediately.
 */
export function CountUp({ value, className, duration = 1200 }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const reduced = usePrefersReducedMotion();
  const parsedRef = useRef<Parsed>(parse(value));
  const parsed = parsedRef.current;
  const [display, setDisplay] = useState(() =>
    reduced ? format(parsed, parsed.number) : format(parsed, 0),
  );

  useEffect(() => {
    if (reduced || !inView) {
      if (reduced) setDisplay(format(parsed, parsed.number));
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(format(parsed, parsed.number * easeOutExpo(t)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, duration, parsed]);

  return (
    <span ref={ref} className={cx('tabular-nums', className)}>
      {display}
    </span>
  );
}