import { createContext, useContext } from 'react';
import type { L, Lang } from '../../content';

export interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (value: L) => string;
}

export const STORAGE_KEY = 'aldi-lang';

export const LanguageContext = createContext<LanguageValue | null>(null);

export function useLang(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLang must be used inside LanguageProvider');
  return value;
}
