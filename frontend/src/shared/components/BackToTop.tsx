import { ArrowUp } from 'lucide-react';
import { useScrollProgress } from '../hooks/useSpotlight';
import { cx } from '../lib/cn';

const R = 9;
const C = 2 * Math.PI * R;

/**
 * Back-to-top with a progress ring around the arrow. The ring reads the nearest scroll root — the
 * deck panel (`data-scroll-root`) when one exists, otherwise the document — so it stays correct
 * on both the deck and the scrollable pages. Hidden (and inert) until there is something to
 * scroll back from.
 */
export function BackToTop({ label, className }: { label: string; className?: string }) {
  const { ref, progress } = useScrollProgress<HTMLButtonElement>();
  const visible = progress > 0.015;

  const onClick = () => {
    const root = ref.current?.closest<HTMLElement>('[data-scroll-root]');
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
    if (root) root.scrollTo({ top: 0, behavior });
    else window.scrollTo({ top: 0, behavior });
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
          strokeDashoffset={C * (1 - progress)}
        />
      </svg>
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
