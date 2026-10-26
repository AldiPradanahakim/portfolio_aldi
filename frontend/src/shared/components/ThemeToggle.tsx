import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { useLang } from '../context/language';
import { applyTheme, useTheme } from '../context/theme';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { cx } from '../lib/cn';

const T = {
  toLight: { en: 'Switch to light theme', id: 'Ganti ke tema terang' },
  toDark: { en: 'Switch to dark theme', id: 'Ganti ke tema gelap' },
};

/** The View Transitions API is optional; a narrow local type keeps it out of the TS lib surface. */
type TransitionDocument = {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

/**
 * The accessible name states the action; aria-pressed exposes whether the dark theme is the
 * one currently on screen. Both glyphs stay mounted and cross-fade in place, so the toggle
 * never changes size or shifts its neighbours.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dark = theme === 'dark';

  const switchTheme = () => {
    const next = dark ? 'light' : 'dark';

    // flushSync inside the transition callback means the palette class and the glyph state are
    // both in the new snapshot — the ripple reveals the correct theme, never the old one.
    const commit = () => {
      flushSync(() => {
        applyTheme(next);
        setTheme(next);
      });
    };

    const start = (document as unknown as TransitionDocument).startViewTransition;
    if (reduced || typeof start !== 'function' || !buttonRef.current) {
      commit();
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const root = document.documentElement;
    root.style.setProperty('--theme-ripple-x', `${x}px`);
    root.style.setProperty('--theme-ripple-y', `${y}px`);
    root.style.setProperty('--theme-ripple-r', `${radius}px`);
    root.setAttribute('data-theme-ripple', '');

    const transition = start.call(document, commit);
    const cleanup = () => {
      root.style.removeProperty('--theme-ripple-x');
      root.style.removeProperty('--theme-ripple-y');
      root.style.removeProperty('--theme-ripple-r');
      root.removeAttribute('data-theme-ripple');
    };
    // A transition that never settles (background tab, interrupted navigation) must not leave
    // stale geometry on <html>, so the timeout releases the properties independently.
    transition.ready.catch(() => {});
    transition.finished.then(cleanup, cleanup);
    window.setTimeout(cleanup, 700);
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={switchTheme}
      aria-pressed={dark}
      aria-label={t(dark ? T.toLight : T.toDark)}
      className={cx(
        'press relative grid h-9 w-9 place-items-center rounded-full border border-ink-800 text-chalk-muted hover:border-ink-700 hover:text-chalk',
        className,
      )}
    >
      <Sun
        aria-hidden="true"
        className={cx(
          'absolute h-4 w-4 transition-[opacity,transform] duration',
          dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-45 scale-75 opacity-0',
        )}
      />
      <Moon
        aria-hidden="true"
        className={cx(
          'absolute h-4 w-4 transition-[opacity,transform] duration',
          dark ? 'rotate-45 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
    </button>
  );
}
