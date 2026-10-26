import { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrolled } from '../hooks/useScrolled';
import { cx } from '../lib/cn';

const R = 9;
const C = 2 * Math.PI * R;

/**
 * Back-to-top with a progress ring, hidden (and inert) until the page is scrolled. The ring
 * reads `--btt` written by its own rAF-throttled listener; visibility is a plain boolean from
 * `useScrolled` so no render happens per frame.
 */
export function BackToTop({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const visible = useScrolled(48);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      button.style.setProperty('--btt', progress.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const onClick = () => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx(
        'press group relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink-800 text-chalk-muted transition-[opacity,transform,color,border-color] duration hover:border-ink-700 hover:text-chalk',
        visible ? 'opacity-100' : 'pointer-events-none translate-y-1 opacity-0',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="12" cy="12" r={R} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        <circle
          cx="12"
          cy="12"
          r={R}
          fill="none"
          className="stroke-accent"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={C}
          style={{ strokeDashoffset: `calc(${C} * (1 - var(--btt, 0)))` }}
        />
      </svg>
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}