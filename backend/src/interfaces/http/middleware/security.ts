import type { NextFunction, Request, Response } from 'express';
import { errorBody } from '../../../domain/contact/ContactMessage.js';

/**
 * Header keamanan dasar, ditulis sendiri supaya tidak menambah dependensi.
 * Semuanya dipasang sebelum route mana pun.
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  next();
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json(errorBody('NOT_FOUND'));
}

/**
 * Penangan error terpusat.
 *
 * Detail asli hanya masuk ke log server. Yang dikirim ke klien selalu kode
 * tetap beserta pesan umum — tanpa stack trace, tanpa path berkas, tanpa
 * nama library — karena pesan error bawaan framework adalah peta jalan
 * untuk menyerang.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  const type = (err as { type?: string })?.type;

  if (type === 'entity.parse.failed') {
    res.status(400).json(errorBody('INVALID_JSON'));
    return;
  }

  if (type === 'entity.too.large') {
    res.status(413).json(errorBody('TOO_LARGE'));
    return;
  }

  console.error('[error]', {
    method: req.method,
    path: req.path,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  res.status(500).json(errorBody('SERVER_ERROR'));
}
