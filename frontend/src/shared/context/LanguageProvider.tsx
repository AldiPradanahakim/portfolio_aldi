import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { L, Lang } from '../../content';
import { LanguageContext, STORAGE_KEY, type LanguageValue } from './language';

const readStored = (): Lang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'id' || stored === 'en') return stored;
  } catch {
    // storage blocked (private mode) — fall through to the default
  }
  return 'en';
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStored);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage blocked — the language still works for this session
    }
  }, [lang]);

  const toggle = useCallback(() => setLang((prev) => (prev === 'en' ? 'id' : 'en')), []);

  const value = useMemo<LanguageValue>(
    () => ({ lang, setLang, toggle, t: (value: L) => value[lang] || value.en }),
    [lang, toggle],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
