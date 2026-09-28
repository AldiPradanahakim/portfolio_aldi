import { Router, type Request, type Response, type NextFunction } from 'express';
import { errorBody, validateContactMessage } from '../../domain/contact/ContactMessage.js';
import { sendContactEmail } from '../../infrastructure/email/emailService.js';
import { rateLimit } from './middleware/rateLimit.js';

const router = Router();

/**
 * POST /api/contact
 *
 * Kontrak yang dipakai frontend: sukses 200 {"success":true};
 * gagal 4xx/5xx {"success":false,"error":"<pesan aman>","code":"<KODE>"}.
 * Frontend memetakan `code` ke kalimat sesuai bahasa pengunjung, jadi pesan
 * `error` yang berbahasa Indonesia tidak pernah ditampilkan ke pengunjung.
 * Tidak ada nilai dari pengguna yang dikembalikan di body respons.
 */
router.post('/contact', rateLimit, async (req: Request, res: Response, next: NextFunction) => {
  // Honeypot: hanya bot yang mengisinya. Dibalas sukses supaya bot tidak
  // tahu dirinya ketahuan, tapi emailnya tidak pernah dikirim.
  //
  // Sengaja diperiksa SETELAH rateLimit: pembatas laju harus melindungi
  // endpoint sebelum isi body diperiksa sama sekali. Konsekuensinya satu
  // kiriman honeypot ikut memakai jatah satu IP — bot biasanya punya IP
  // sendiri, jadi ini tidak merugikan pengunjung sungguhan. Jangan dibalik.
  const body: unknown = req.body;
  const honeypot =
    body !== null && typeof body === 'object' && 'honeypot' in body ? body.honeypot : undefined;

  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    res.json({ success: true });
    return;
  }

  const result = validateContactMessage(req.body);

  if (!result.ok) {
    res.status(400).json(errorBody(result.code));
    return;
  }

  try {
    await sendContactEmail(result.value);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
