import type { DataAdapter } from './types';
import type { SiteContent } from '../../content/types';

/**
 * Klien Firebase tanpa SDK: Firestore REST untuk data + Identity Toolkit REST
 * untuk masuk. Dokumen `site/content` menyimpan `data` sebagai string JSON.
 */
const SESSION_KEY = 'aldi-admin-firebase';
const DOC_PATH = 'site/content';

const IDP_SIGN_IN = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
const TOKEN_REFRESH = 'https://securetoken.googleapis.com/v1/token';
const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects';

interface StoredSession {
  email: string;
  id_token: string;
  refresh_token: string;
  expires_at: number;
}

function docUrl(projectId: string): string {
  return `${FIRESTORE_BASE}/${projectId}/databases/(default)/documents/${DOC_PATH}`;
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

async function currentSession(apiKey: string): Promise<StoredSession | null> {
  const session = readSession();
  if (!session) return null;
  if (session.expires_at - Date.now() > 60_000) return session;
  try {
    const res = await fetch(`${TOKEN_REFRESH}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: session.refresh_token,
      }),
    });
    if (!res.ok) {
      writeSession(null);
      return null;
    }
    const json = (await res.json()) as {
      id_token: string;
      refresh_token: string;
      expires_in: string;
    };
    const next: StoredSession = {
      email: session.email,
      id_token: json.id_token,
      refresh_token: json.refresh_token,
      expires_at: Date.now() + Number(json.expires_in) * 1000,
    };
    writeSession(next);
    return next;
  } catch {
    return null;
  }
}

export function firebaseAdapter(apiKey?: string, projectId?: string): DataAdapter {
  const configured = Boolean(apiKey && projectId);

  return {
    source: 'firebase',
    authMode: 'email',
    configured,

    async load() {
      if (!configured) {
        throw new Error('Firebase belum dikonfigurasi: isi VITE_FIREBASE_API_KEY dan VITE_FIREBASE_PROJECT_ID.');
      }
      const session = await currentSession(apiKey!);
      const headers: Record<string, string> = {};
      if (session) headers.Authorization = `Bearer ${session.id_token}`;
      const res = await fetch(docUrl(projectId!), { headers });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Firebase menolak permintaan baca (${res.status}).`);
      const json = (await res.json()) as { fields?: { data?: { stringValue?: string } } };
      const raw = json.fields?.data?.stringValue;
      if (!raw) return null;
      return JSON.parse(raw) as SiteContent;
    },

    async save(content) {
      if (!configured) {
        throw new Error('Firebase belum dikonfigurasi: isi VITE_FIREBASE_API_KEY dan VITE_FIREBASE_PROJECT_ID.');
      }
      const session = await currentSession(apiKey!);
      if (!session) throw new Error('Masuk dulu sebelum menyimpan ke Firebase.');
      const res = await fetch(`${docUrl(projectId!)}?updateMask.fieldPaths=data`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.id_token}` },
        body: JSON.stringify({ fields: { data: { stringValue: JSON.stringify(content) } } }),
      });
      if (!res.ok) throw new Error(`Gagal menyimpan ke Firebase (${res.status}).`);
    },

    async signIn(email, password) {
      if (!configured) {
        throw new Error('Firebase belum dikonfigurasi: isi VITE_FIREBASE_API_KEY dan VITE_FIREBASE_PROJECT_ID.');
      }
      const res = await fetch(`${IDP_SIGN_IN}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      if (!res.ok) {
        throw new Error(
          res.status === 400 ? 'Email atau kata sandi salah.' : `Firebase menolak masuk (${res.status}).`,
        );
      }
      const json = (await res.json()) as {
        email: string;
        idToken: string;
        refreshToken: string;
        expiresIn: string;
      };
      writeSession({
        email: json.email,
        id_token: json.idToken,
        refresh_token: json.refreshToken,
        expires_at: Date.now() + Number(json.expiresIn) * 1000,
      });
    },

    async signOut() {
      // Identity Toolkit tidak punya endpoint logout; token habis sendiri.
      writeSession(null);
    },

    async getSession() {
      if (!configured) return null;
      const session = await currentSession(apiKey!);
      return session ? { email: session.email } : null;
    },
  };
}