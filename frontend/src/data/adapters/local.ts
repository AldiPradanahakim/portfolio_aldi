import type { AdminSession, DataAdapter } from './types';
import type { SiteContent } from '../../content/types';
import { setAdminPassword, verifyAdminPassword } from './credentials';

const CONTENT_KEY = 'aldi-site-content-v1';
const SESSION_KEY = 'aldi-admin-local';

/**
 * Mode local hanya untuk pratinjau: data disimpan di localStorage dan "kata
 * sandi" dibandingkan di sisi klien. Ini BUKAN keamanan sungguhan — siapa pun
 * yang memakai perambannya bisa membaca isinya.
 */
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
    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    } catch (cause) {
      // localStorage berhenti di sekitar 5 MB. Gambar unggahan ikut tinggal di dokumen ini, jadi
      // pesan mentah "QuotaExceededError" tidak menjelaskan apa yang harus dilakukan.
      const quota =
        cause instanceof DOMException &&
        (cause.name === 'QuotaExceededError' || cause.name === 'NS_ERROR_DOM_QUOTA_REACHED');
      throw new Error(
        quota
          ? 'Penyimpanan peramban penuh (batas ±5 MB). Hapus beberapa gambar unggahan, atau pindahkan gambar ke folder public/images dan pakai "Pakai URL".'
          : `Gagal menyimpan: ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    }
  },

  async signIn(email, password) {
    if (!(await verifyAdminPassword(password))) {
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

  async changePassword(current, next) {
    if (!(await verifyAdminPassword(current))) {
      throw new Error('Kata sandi lama tidak cocok.');
    }
    await setAdminPassword(next);
  },
};
