import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SiteContent } from '../content/types';
import { useContent } from './context';
import { getAdapter } from './adapters';
import type { AdminSession } from './adapters/types';
import { isSiteContent } from './types';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function useAdminSession() {
  const adapter = useMemo(getAdapter, []);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adapter
      .getSession()
      .then((value) => {
        if (!cancelled) setSession(value);
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(errorMessage(cause));
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [adapter]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        await adapter.signIn(email, password);
        setSession(await adapter.getSession());
      } catch (cause) {
        const message = errorMessage(cause);
        setError(message);
        throw new Error(message);
      }
    },
    [adapter],
  );

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await adapter.signOut();
    } finally {
      setSession(null);
    }
  }, [adapter]);

  return {
    session,
    ready,
    signIn,
    signOut,
    source: adapter.source,
    authMode: adapter.authMode,
    configured: adapter.configured,
    error,
  };
}

export function useContentDraft() {
  const { content, reload } = useContent();
  const adapter = useMemo(getAdapter, []);
  const [draft, setDraft] = useState<SiteContent>(content);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setelah reload dari adapter, selaraskan draft hanya bila belum ada editan lokal.
  useEffect(() => {
    if (!dirty) setDraft(content);
  }, [content, dirty]);

  const update = useCallback((fn: (current: SiteContent) => SiteContent) => {
    setDraft((current) => fn(current));
    setDirty(true);
  }, []);

  const discard = useCallback(() => {
    setDraft(content);
    setDirty(false);
    setError(null);
  }, [content]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await adapter.save(draft);
      await reload();
      setDirty(false);
    } catch (cause) {
      const message = errorMessage(cause);
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, [adapter, draft, reload]);

  return { draft, update, dirty, saving, error, save, discard };
}

export function exportJson(content: SiteContent): void {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `aldi-site-content-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function parseImport(text: string): SiteContent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Berkas bukan JSON yang valid.');
  }
  if (!isSiteContent(parsed)) {
    throw new Error('Struktur konten tidak dikenali: perlu `version`, `projects`, dan `profile`.');
  }
  return parsed;
}