const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot: string;
}

/** Stable codes the backend returns alongside its (Indonesian, log-only) message. */
export const CONTACT_ERROR_CODES = [
  'INVALID_JSON',
  'TOO_LARGE',
  'NOT_FOUND',
  'RATE_LIMITED',
  'INVALID_BODY',
  'MISSING_FIELDS',
  'NEWLINE_IN_HEADER',
  'NAME_LENGTH',
  'EMAIL_INVALID',
  'SUBJECT_LENGTH',
  'MESSAGE_LENGTH',
  'SERVER_ERROR',
] as const;

export type ContactErrorCode = (typeof CONTACT_ERROR_CODES)[number];

const CODES: Record<string, true> = Object.fromEntries(
  CONTACT_ERROR_CODES.map((code) => [code, true]),
);

export const isContactErrorCode = (value: unknown): value is ContactErrorCode =>
  typeof value === 'string' && CODES[value] === true;

/**
 * Carries the machine-readable code so the UI can show localised copy instead of the
 * server's Indonesian text, plus the HTTP status for logs. `message` stays technical
 * and is never rendered.
 */
export class ContactError extends Error {
  readonly code: ContactErrorCode | 'UNKNOWN';
  readonly status: number | null;

  constructor(code: ContactErrorCode | 'UNKNOWN', status: number | null) {
    super(`contact request failed (${code}${status === null ? '' : ` ${status}`})`);
    this.name = 'ContactError';
    this.code = code;
    this.status = status;
  }
}

/**
 * POST /contact -> 200 { success: true } | 4xx/5xx { success: false, error, code }
 * Anything else (network down, non-JSON body, missing code) resolves to UNKNOWN.
 */
export async function sendContact(payload: ContactPayload): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new ContactError('UNKNOWN', null);
  }

  let body: { success?: boolean; code?: unknown } | null = null;
  try {
    body = (await response.json()) as { success?: boolean; code?: unknown };
  } catch {
    body = null;
  }

  if (response.ok && body?.success) return;

  const code = isContactErrorCode(body?.code) ? body.code : 'UNKNOWN';
  throw new ContactError(code, response.status);
}
