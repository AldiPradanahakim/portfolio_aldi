import { useState, type FormEvent } from 'react';
import type { DataSource } from '../data/adapters/types';
import { Btn, Field, TextInput } from './ui';

const SOURCE_LABELS: Record<DataSource, string> = {
  local: 'Lokal (pratinjau)',
  supabase: 'Supabase',
  firebase: 'Firebase',
};

interface LoginProps {
  source: DataSource;
  authMode: 'password' | 'email';
  configured: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
}

export function Login({ source, authMode, configured, error, signIn }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [showHint, setShowHint] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await signIn(email, password);
    } catch {
      /* pesan sudah disimpan di useAdminSession().error */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-6">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-h3 font-medium text-chalk">Masuk ke Panel</h1>
            <span className="rounded-full border border-ink-700 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-chalk-muted">
              {SOURCE_LABELS[source]}
            </span>
          </div>

          {!configured ? (
            <p className="mt-4 rounded-xl border border-danger-border bg-ink-850 p-3 text-small text-danger">
              Sumber {SOURCE_LABELS[source]} belum dikonfigurasi. Isi kunci sumbernya di
              <code className="font-mono"> frontend/.env</code> lalu muat ulang. Tanpa konfigurasi,
              panel memakai mode local untuk pratinjau.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            {authMode === 'email' ? (
              <Field label="Email">
                <TextInput
                  value={email}
                  onChange={setEmail}
                  autoComplete="username"
                  placeholder="admin@contoh.com"
                />
              </Field>
            ) : null}
            <Field label={authMode === 'email' ? 'Kata sandi' : 'Kata sandi admin'}>
              <TextInput
                value={password}
                onChange={setPassword}
                type="password"
                autoComplete="current-password"
              />
            </Field>

            {error ? (
              <p className="rounded-xl border border-danger-border bg-ink-850 p-3 text-small text-danger">{error}</p>
            ) : null}

            <Btn type="submit" variant="primary" disabled={busy}>
              {busy ? 'Memeriksa…' : 'Masuk'}
            </Btn>
          </form>

          <p className="mt-4 text-small text-chalk-muted">
            {authMode === 'email'
              ? 'Masuk memakai akun Email + Kata sandi pada sumber yang dipilih.'
              : 'Mode local hanya untuk pratinjau — kata sandinya dibandingkan di peramban, bukan keamanan sungguhan.'}
          </p>

          <button
            type="button"
            onClick={() => setShowHint((value) => !value)}
            className="mt-2 text-small text-chalk-faint underline-offset-4 hover:text-chalk hover:underline"
          >
            {showHint ? 'Sembunyikan' : 'Cara mengatur sumber data'}
          </button>

          {showHint ? (
            <div className="mt-3 space-y-2 text-small text-chalk-muted">
              <p>
                <strong className="text-chalk">Supabase</strong> — isi{' '}
                <code className="font-mono">VITE_SUPABASE_URL</code> dan{' '}
                <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>, aktifkan provider
                Email di Authentication, buat pengguna, lalu jalankan{' '}
                <code className="font-mono">supabase/schema.sql</code>.
              </p>
              <p>
                <strong className="text-chalk">Firebase</strong> — isi{' '}
                <code className="font-mono">VITE_FIREBASE_API_KEY</code> dan{' '}
                <code className="font-mono">VITE_FIREBASE_PROJECT_ID</code>, aktifkan email/password
                di Authentication, dan pasang aturan{' '}
                <code className="font-mono">firebase/firestore.rules</code>.
              </p>
              <p>
                <strong className="text-chalk">Local</strong> — kata sandi default{' '}
                <code className="font-mono">admin</code>; ganti lewat{' '}
                <code className="font-mono">VITE_ADMIN_PASSWORD</code>.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}