import dotenv from 'dotenv';

dotenv.config();

/**
 * Konfigurasi dibaca sekali di awal dan langsung divalidasi. Kalau ada yang
 * kurang, proses berhenti dengan pesan yang jelas — bukan meledak saat
 * request pertama masuk dan baru ketahuan dari log produksi.
 */

function required(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    missing.push(name);
    return '';
  }

  return value;
}

const missing: string[] = [];

export const config = {
  port: Number.parseInt(process.env.PORT ?? '', 10) || 3001,

  email: {
    user: required('EMAIL_USER'),
    // App Password Gmail — jangan pernah dicetak ke log atau dikirim ke klien.
    password: required('EMAIL_PASSWORD'),
    recipient: process.env.EMAIL_RECIPIENT?.trim() || required('EMAIL_USER'),
  },
};

export function assertConfig(): void {
  if (missing.length > 0) {
    console.error(
      `[config] Variabel lingkungan berikut belum diisi: ${missing.join(', ')}.\n` +
        '[config] Salin backend/.env.example menjadi backend/.env lalu isi nilainya.\n' +
        '[config] EMAIL_PASSWORD untuk Gmail adalah App Password 16 karakter, bukan kata sandi akun.'
    );
    process.exit(1);
  }
}
