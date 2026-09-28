import { cx } from '../lib/cn';

/** PROFILE.photo is null, so the portrait slot is filled with initials instead of an <img>. */
export function Monogram({ initials, className }: { initials: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'grid aspect-square place-items-center rounded-3xl border border-ink-800 bg-ink-900',
        className,
      )}
    >
      <span className="font-mono text-4xl tracking-[0.18em] text-accent">{initials}</span>
    </div>
  );
}
