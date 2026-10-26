import type { DataAdapter } from './types';
import type { SiteContent } from '../../content/types';

/**
 * Klien Supabase tanpa SDK: PostgREST untuk data + endpoint Auth v1 untuk
 * masuk. Token disimpan di localStorage `aldi-admin-supabase`.
 */
const SESSION_KEY = 'aldi-admin-supabase';
const TABLE = 'site_content';

interface StoredSession {
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

function trimUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (typeof parsed?.refresh_token !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession | null): void {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

async function currentSession(authUrl: string, anonKey: string): Promise<StoredSession | null> {
  const session = readSession();
  if (!session) return null;
  if (session.expires_at - Date.now() > 60_000) return session;
  try {
    const res = await fetch(`${authUrl}/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anonKey },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });
    if (!res.ok) {
      writeSession(null);
      return null;
    }
    const json = (await res.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user?: { email?: string };
    };
    const next: StoredSession = {
      email: json.user?.email ?? session.email,
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      expires_at: Date.now() + json.expires_in * 1000,
    };
    writeSession(next);
    return next;
  } catch {
    return null;
  }
}

export function supabaseAdapter(rawUrl?: string, anonKey?: string): DataAdapter {
  const url = rawUrl ? trimUrl(rawUrl) : '';
  const configured = Boolean(url && anonKey);
  const restUrl = `${url}/rest/v1`;
  const authUrl = `${url}/auth/v1`;

  return {
    source: 'supabase',
    authMode: 'email',
    configured,

    async load() {
      if (!configured) {
        throw new Error('Supabase belum dikonfigurasi: isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
      }
      const res = await fetch(`${restUrl}/${TABLE}?id=eq.main&select=data`, {
        headers: { apikey: anonKey!, Authorization: `Bearer ${anonKey}` },
      });
      if (!res.ok) throw new Error(`Supabase menolak permintaan baca (${res.status}).`);
      const json = (await res.json()) as { data?: SiteContent }[];
      return json?.[0]?.data ?? null;
    },

    async save(content) {
      if (!configured) {
        throw new Error('Supabase belum dikonfigurasi: isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
      }
      const session = await currentSession(authUrl, anonKey!);
      if (!session) throw new Error('Masuk dulu sebelum menyimpan ke Supabase.');
      const res = await fetch(`${restUrl}/${TABLE}?on_conflict=id`, {
        method: 'POST',
        headers: {
          apikey: anonKey!,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({ id: 'main', data: content, updated_at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Gagal menyimpan ke Supabase (${res.status}).`);
    },

    async signIn(email, password) {
      if (!configured) {
        throw new Error('Supabase belum dikonfigurasi: isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
      }
      const res = await fetch(`${authUrl}/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: anonKey! },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 400 ? 'Email atau kata sandi salah.' : `Supabase menolak masuk (${res.status}).`,
        );
      }
      const json = (await res.json()) as {
        access_token: string;
        refresh_token: string;
        expires_in: number;
        user?: { email?: string };
      };
      writeSession({
        email: json.user?.email ?? email,
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        expires_at: Date.now() + json.expires_in * 1000,
      });
    },

    async signOut() {
      const session = readSession();
      if (session) {
        try {
          await fetch(`${authUrl}/logout`, {
            method: 'POST',
            headers: { apikey: anonKey!, Authorization: `Bearer ${session.access_token}` },
          });
        } catch {
          /* best effort: pratinjau lokal tetap bersih walau jaringan putus */
        }
      }
      writeSession(null);
    },

    async getSession() {
      if (!configured) return null;
      const session = await currentSession(authUrl, anonKey!);
      return session ? { email: session.email } : null;
    },
  };
}