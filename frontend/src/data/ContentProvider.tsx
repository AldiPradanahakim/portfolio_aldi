import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { SiteContent } from '../content/types';
import { SEED_CONTENT } from './seed';
import { getAdapter } from './adapters';
import { isSiteContent } from './types';
import { ContentContext, type ContentValue } from './context';

export function ContentProvider({ children }: { children: ReactNode }): ReactElement {
  const adapter = useMemo(getAdapter, []);
  const [content, setContent] = useState<SiteContent>(SEED_CONTENT);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const next = await adapter.load();
      if (next === null) {
        setError(null);
      } else if (isSiteContent(next)) {
        setContent(next);
        setError(null);
      } else {
        setError('Data konten tersimpan tidak dikenali; menampilkan isi bawaan.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      // Dilempar ulang supaya pemanggil (mis. save) tahu muat-ulangnya gagal.
      throw cause;
    } finally {
      setReady(true);
    }
  }, [adapter]);

  useEffect(() => {
    reload().catch(() => {
      /* kegagalan sudah tersimpan di state error */
    });
  }, [reload]);

  const value = useMemo<ContentValue>(
    () => ({ content, source: adapter.source, ready, error, reload }),
    [content, ready, error, reload, adapter.source],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}