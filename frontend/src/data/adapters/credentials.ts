const CRED_KEY = 'aldi-admin-cred';
const ITERATIONS = 150_000;

/**
 * Kata sandi panel mode local, disimpan di peramban. Ini tetap BUKAN keamanan sungguhan — siapa
 * pun yang membuka devtools bisa menghapus kuncinya dan kembali ke sandi bawaan. Yang dicapai di
 * sini hanya: sandi tidak tersimpan sebagai teks biasa, dan tidak perlu mengubah env untuk
 * menggantinya.
 */
interface StoredCredential {
  salt: string;
  hash: string;
}

/** Sandi bawaan dari env, atau "admin" bila env kosong. */
export function defaultPassword(): string {
  return import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin';
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derive(password: string, salt: Uint8Array): Promise<string | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;
  const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(bits);
}

function read(): StoredCredential | null {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredCredential;
    return typeof parsed?.hash === 'string' && typeof parsed?.salt === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

/** true bila sandi sudah pernah diganti dari panel (bukan lagi sandi env/bawaan). */
export function hasCustomPassword(): boolean {
  return read() !== null;
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const stored = read();
  if (!stored) return input === defaultPassword();

  // `plain:` = peramban tanpa crypto.subtle (mis. dibuka lewat http:// pada IP LAN)
  if (stored.hash.startsWith('plain:')) return stored.hash === `plain:${input}`;

  const hash = await derive(input, fromHex(stored.salt));
  return hash !== null && hash === stored.hash;
}

export async function setAdminPassword(next: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(next, salt);
  const credential: StoredCredential = hash
    ? { salt: toHex(salt.buffer), hash }
    : { salt: '', hash: `plain:${next}` };
  localStorage.setItem(CRED_KEY, JSON.stringify(credential));
}

/** Kembali ke sandi bawaan (env atau "admin"). */
export function resetAdminPassword(): void {
  localStorage.removeItem(CRED_KEY);
}
