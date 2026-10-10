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
 * one currently on screen.
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
        'press rounded-full border border-ink-800 p-2 text-chalk-muted hover:border-ink-700 hover:text-chalk',
        className,
      )}
    >
      {dark ? (
        <Sun className="icon-swap h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="icon-swap h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
