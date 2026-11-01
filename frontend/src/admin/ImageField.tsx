import { useRef, useState, type ChangeEvent } from 'react';
import { Btn, Field, TextInput } from './ui';

/** Anything larger is almost certainly a camera original; we refuse before decoding it. */
const MAX_FILE_BYTES = 25 * 1024 * 1024;

/** Formats a canvas re-encode would ruin: GIF loses its animation, SVG loses its scalability. */
const KEEP_AS_IS: Record<string, true> = { 'image/gif': true, 'image/svg+xml': true };

async function readAsDataUrl(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  // btoa needs one call with the whole string, but the argument spread has a limit: chunk it
  const CHUNK = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + CHUNK));
  }
  return `data:${file.type};base64,${btoa(binary)}`;
}

/**
 * Downscale and re-encode in the browser before the image becomes part of the content document.
 * Without this a single phone photo is 4 MB, and the whole document lives in localStorage (or in
 * an exported JSON), which has a ~5 MB budget per origin.
 */
async function shrink(file: File, maxEdge: number): Promise<string> {
  if (KEEP_AS_IS[file.type]) return readAsDataUrl(file);

  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error('Gambar tidak bisa dibaca — coba format JPG, PNG, atau WebP.');
  });

  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    throw new Error('Peramban tidak mendukung pengolahan gambar.');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = canvas.toDataURL('image/webp', 0.82);
  // Safari below 16 silently returns a PNG here, which would be several times larger
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.85);
}

function humanSize(dataUrl: string): string {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const bytes = Math.round((base64.length * 3) / 4);
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

interface ImageFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  /** longest edge kept after the upload, in px */
  maxEdge?: number;
  previewClassName?: string;
  placeholder?: string;
}

/**
 * Image slot for the panel: upload a file, or paste a URL when the image already lives in the repo.
 * The stored value stays a plain string, so `cover` / `photo` / `gallery` need no schema change and
 * a data URL renders wherever an URL would.
 */
export function ImageField({
  label,
  hint,
  value,
  onChange,
  maxEdge = 1400,
  previewClassName = 'h-32 w-full max-w-sm',
  placeholder = '/images/example.webp',
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrl, setShowUrl] = useState(false);

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Berkas itu bukan gambar.');
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError('Gambar lebih dari 25 MB — kecilkan dulu.');
      return;
    }

    setBusy(true);
    try {
      onChange(await shrink(file, maxEdge));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label} hint={hint} error={error ?? undefined}>
      <div className="flex flex-wrap items-start gap-3">
        <div
          className={`${previewClassName} flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-800 bg-ink-850`}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-wider text-chalk-faint">kosong</span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Btn onClick={() => inputRef.current?.click()} disabled={busy} variant="primary">
              {busy ? 'Mengolah…' : value ? 'Ganti gambar' : 'Unggah gambar'}
            </Btn>
            {value ? (
              <Btn onClick={() => onChange('')} variant="danger">
                Hapus
              </Btn>
            ) : null}
            <Btn onClick={() => setShowUrl((open) => !open)}>{showUrl ? 'Sembunyikan URL' : 'Pakai URL'}</Btn>
          </div>
          <p className="text-small text-chalk-faint">
            {value
              ? `${value.startsWith('data:') ? 'Tersimpan di dalam konten' : value} · ${humanSize(value)}`
              : 'JPG, PNG, WebP, atau GIF. Diperkecil otomatis saat diunggah.'}
          </p>
        </div>
      </div>

      {showUrl ? (
        <div className="mt-2">
          <TextInput value={value} onChange={onChange} mono placeholder={placeholder} />
        </div>
      ) : null}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </Field>
  );
}
