import { Moon, Sun } from 'lucide-react';
import { useLang } from '../context/language';
import { useTheme } from '../context/theme';
import { cx } from '../lib/cn';

const T = {
  toLight: { en: 'Switch to light theme', id: 'Ganti ke tema terang' },
  toDark: { en: 'Switch to dark theme', id: 'Ganti ke tema gelap' },
};

/**
 * The accessible name states the action; aria-pressed exposes whether the dark theme is the
 * one currently on screen. Both glyphs stay mounted and cross-fade in place, so the toggle
 * never changes size or shifts its neighbours.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
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
