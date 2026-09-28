/**
 * Entitas pesan kontak beserta validasinya.
 *
 * Validasi ditaruh di domain supaya aturan panjang dan pembersihan karakter
 * terkontrol hanya ada di satu tempat — bukan tersebar di route dan di
 * lapisan email, yang gampang jadi tidak sinkron.
 */

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  emailMax: 254,
  subjectMin: 3,
  subjectMax: 120,
  messageMin: 10,
  messageMax: 2000,
} as const;

/**
 * Katalog kode error API: satu-satunya tempat kode dan pesan manusianya
 * dideklarasikan berdampingan.
 *
 * Kode ini stabil dan dipakai frontend untuk memilih kalimat sesuai bahasa
 * pengunjung — pesan `error` di bawah selalu berbahasa Indonesia dan hanya
 * untuk curl, log, serta developer. Isinya tetap, tidak pernah memuat
 * masukan pengguna, jadi tidak ada yang bocor lewat jalur ini.
 */
export const CONTACT_ERRORS = {
  // Middleware
  INVALID_JSON: 'Isi permintaan bukan JSON yang valid.',
  TOO_LARGE: 'Isi permintaan terlalu besar.',
  NOT_FOUND: 'Endpoint tidak ditemukan.',
  RATE_LIMITED: 'Terlalu banyak pesan dari koneksi ini. Coba lagi beberapa menit lagi.',
  SERVER_ERROR: 'Terjadi kesalahan di server. Coba lagi sebentar lagi.',

  // Validasi isi formulir
  INVALID_BODY: 'Format permintaan tidak dikenali.',
  MISSING_FIELDS: 'Nama, email, subjek, dan pesan wajib diisi.',
  NEWLINE_IN_HEADER: 'Nama, email, dan subjek tidak boleh memuat baris baru.',
  NAME_LENGTH: `Nama harus ${LIMITS.nameMin}-${LIMITS.nameMax} karakter.`,
  EMAIL_INVALID: 'Alamat email tidak valid.',
  SUBJECT_LENGTH: `Subjek harus ${LIMITS.subjectMin}-${LIMITS.subjectMax} karakter.`,
  MESSAGE_LENGTH: `Pesan harus ${LIMITS.messageMin}-${LIMITS.messageMax} karakter.`,
} as const;

export type ContactErrorCode = keyof typeof CONTACT_ERRORS;

/** Bentuk seragam untuk setiap respons gagal. */
export interface ErrorBody {
  success: false;
  error: string;
  code: ContactErrorCode;
}

export function errorBody(code: ContactErrorCode): ErrorBody {
  return { success: false, error: CONTACT_ERRORS[code], code };
}

export type ValidationResult =
  | { ok: true; value: ContactMessage }
  | { ok: false; code: ContactErrorCode; error: string };

/**
 * Karakter kontrol CR/LF (dan NUL) dibuang dari nilai apa pun. Pada name,
 * email, dan subject karakter ini ditolak mentah-mentah karena di sanalah
 * header email disusun — nilai berisi baris baru bisa menyisipkan header
 * tambahan lewat nodemailer.
 */
const CONTROL_CHARS = /[\r\n\0]/;
const OTHER_CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Format email yang cukup ketat untuk formulir kontak, tanpa menolak alamat sah. */
const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/;

function invalid(code: ContactErrorCode): ValidationResult {
  return { ok: false, code, error: CONTACT_ERRORS[code] };
}

export function validateContactMessage(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return invalid('INVALID_BODY');
  }

  const raw = body as Record<string, unknown>;

  if (
    typeof raw.name !== 'string' ||
    typeof raw.email !== 'string' ||
    typeof raw.subject !== 'string' ||
    typeof raw.message !== 'string'
  ) {
    return invalid('MISSING_FIELDS');
  }

  const name = raw.name.trim();
  const email = raw.email.trim();
  const subject = raw.subject.trim();
  const message = raw.message.trim();

  // Header injection: nilai ini ikut menyusun header email.
  if (CONTROL_CHARS.test(name) || CONTROL_CHARS.test(email) || CONTROL_CHARS.test(subject)) {
    return invalid('NEWLINE_IN_HEADER');
  }

  if (name.length < LIMITS.nameMin || name.length > LIMITS.nameMax) {
    return invalid('NAME_LENGTH');
  }

  if (email.length > LIMITS.emailMax || !EMAIL_PATTERN.test(email)) {
    return invalid('EMAIL_INVALID');
  }

  if (subject.length < LIMITS.subjectMin || subject.length > LIMITS.subjectMax) {
    return invalid('SUBJECT_LENGTH');
  }

  const cleanMessage = message.replace(OTHER_CONTROL_CHARS, '');

  if (cleanMessage.length < LIMITS.messageMin || cleanMessage.length > LIMITS.messageMax) {
    return invalid('MESSAGE_LENGTH');
  }

  return { ok: true, value: { name, email, subject, message: cleanMessage } };
}
