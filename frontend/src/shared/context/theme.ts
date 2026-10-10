import { createContext, useContext } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

/** Must match the key read by the pre-paint script in index.html. */
export const STORAGE_KEY = 'aldi-theme';

export const ThemeContext = createContext<ThemeValue | null>(null);

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}

/** The class the head script toggles; absence of it means dark. */
export const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('light', theme === 'light');
};

export const persistTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // storage blocked (private mode) — the choice still applies for this session
  }
};
