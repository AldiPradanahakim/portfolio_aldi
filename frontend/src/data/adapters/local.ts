import type { AdminSession, DataAdapter } from './types';
import type { SiteContent } from '../../content/types';

const CONTENT_KEY = 'aldi-site-content-v1';
const SESSION_KEY = 'aldi-admin-local';

/**
 * Mode local hanya untuk pratinjau: data disimpan di localStorage dan "kata
 * sandi" dibandingkan di sisi klien. Ini BUKAN keamanan sungguhan — siapa pun
 * yang memakai perambannya bisa membaca isinya.
 */
function adminPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin';
}

function readSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    return typeof parsed?.email === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export const localAdapter: DataAdapter = {
  source: 'local',
  authMode: 'password',
  configured: true,

  async load() {
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as SiteContent;
    } catch {
      return null;
    }
  },

  async save(content) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  },

  async signIn(email, password) {
    if (password !== adminPassword()) {
      throw new Error('Kata sandi salah.');
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: email.trim() || 'admin@local' }));
  },

  async signOut() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  async getSession() {
    return readSession();
  },
};