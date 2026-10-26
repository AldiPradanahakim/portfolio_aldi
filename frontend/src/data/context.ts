import { createContext, useContext } from 'react';
import type { SiteContent } from '../content/types';
import type { DataSource } from './adapters/types';

export interface ContentValue {
  content: SiteContent;
  source: DataSource;
  ready: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** Lives apart from the component so the file stays fast-refresh clean (component-only). */
export const ContentContext = createContext<ContentValue | null>(null);

export function useContent(): ContentValue {
  const value = useContext(ContentContext);
  if (!value) throw new Error('useContent harus dipakai di dalam ContentProvider.');
  return value;
}
