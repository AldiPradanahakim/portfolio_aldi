import type { SiteContent } from '../content/types';

export * from '../content/types';

/** Pengecekan bentuk minimum untuk data yang dimuat/impor: sisanya dikunci typecheck. */
export function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<SiteContent>;
  return (
    typeof candidate.version === 'number' &&
    Array.isArray(candidate.projects) &&
    !!candidate.profile &&
    typeof candidate.profile === 'object'
  );
}