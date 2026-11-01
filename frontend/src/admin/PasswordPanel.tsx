import { useState } from 'react';
import type { DataAdapter } from '../data/adapters/types';
import { hasCustomPassword, resetAdminPassword } from '../data/adapters/credentials';
import { Btn, Field, TextInput } from './ui';

const MIN_LENGTH = 8;

interface PasswordPanelProps {
  adapter: DataAdapter;
  notify: (tone: 'ok' | 'error', text: string) => void;
}

export function PasswordPanel({ adapter, notify }: PasswordPanelProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [custom, setCustom] = useState(hasCustomPassword);

  if (!adapter.changePassword) {
    return (
      <p className="text-small text-chalk-muted">
        Sumber <strong className="text-chalk">{adapter.source}</strong> tidak mendukung ganti sandi
        dari panel. Ubah sandi lewat dashboard penyedia (Supabase Authentication atau Firebase
        Authentication).
      </p>
    );
  }

  async function submit() {
    setError(null);
    if (next.length < MIN_LENGTH) {
      setError(`Kata sandi baru minimal ${MIN_LENGTH} karakter.`);
      return;
    }
    if (next !== repeat) {
      setError('Ulangi kata sandi baru dengan tepat.');
      return;
    }
    setBusy(true);
    try {
      await adapter.changePassword!(current, next);
      setCurrent('');
      setNext('');
      setRepeat('');
      setCustom(hasCustomPassword());
      notify('ok', 'Kata sandi diganti.');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(message);
      notify('error', message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md space-y-4">
      <Field label="Kata sandi sekarang">
        <TextInput value={current} onChange={setCurrent} type="password" autoComplete="current-password" />
      </Field>
      <Field label="Kata sandi baru" hint={`Minimal ${MIN_LENGTH} karakter.`}>
        <TextInput value={next} onChange={setNext} type="password" autoComplete="new-password" />
      </Field>
      <Field label="Ulangi kata sandi baru" error={error ?? undefined}>
        <TextInput value={repeat} onChange={setRepeat} type="password" autoComplete="new-password" />
      </Field>

      <Btn onClick={() => void submit()} variant="primary" disabled={busy || !current || !next}>
        {busy ? 'Menyimpan…' : 'Ganti kata sandi'}
      </Btn>

      {adapter.source === 'local' ? (
        <div className="rounded-xl border border-ink-800 bg-ink-900 p-3">
          <p className="text-small text-chalk-muted">
            Mode local membandingkan sandi di peramban, jadi ini bukan keamanan sungguhan — panel
            tetap bisa dibuka siapa pun yang menghapus data situs di perambannya.
            {custom ? ' Sandi sudah diganti dari bawaan.' : ' Sandi masih bawaan.'}
          </p>
          {custom ? (
            <button
              type="button"
              onClick={() => {
                resetAdminPassword();
                setCustom(false);
                setError(null);
                notify('ok', 'Kata sandi kembali ke bawaan.');
              }}
              className="mt-2 text-small text-chalk-faint underline underline-offset-4 hover:text-chalk"
            >
              Kembalikan ke sandi bawaan
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
