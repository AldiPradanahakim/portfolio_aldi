import { cx } from '../lib/cn';

/** PROFILE.photo may be null; this fills the portrait slot with initials instead of an <img>. */
export function Monogram({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'relative grid aspect-square place-items-center overflow-hidden border border-ink-800 bg-ink-900',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-60 [background-image:repeating-linear-gradient(-45deg,rgb(var(--border)/0.55)_0_1px,transparent_1px_14px)]"
      />
      <span className="relative font-display text-[clamp(2.5rem,9vw,4.5rem)] italic tracking-[0.08em] text-accent">
        {initials}
      </span>
    </div>
  );
}