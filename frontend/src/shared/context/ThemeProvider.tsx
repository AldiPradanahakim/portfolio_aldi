import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { applyTheme, persistTheme, STORAGE_KEY, ThemeContext, type Theme, type ThemeValue } from './theme';

/**
 * Mirrors the class the pre-paint script in index.html already applied, so the first render can
 * never disagree with what is on screen. Order: applied class, stored choice, system preference.
 */
const readInitialTheme = (): Theme => {
  if (document.documentElement.classList.contains('light')) return 'light';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // storage blocked — fall through to the system preference
  }
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Only an explicit choice is stored: a first visit keeps following the system preference.
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    persistTheme(next);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((previous) => {
      const next: Theme = previous === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      return next;
    });
  }, []);

  const value = useMemo<ThemeValue>(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
