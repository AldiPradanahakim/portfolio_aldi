import express from 'express';
import cors from 'cors';
import { assertConfig } from './config/env.js';
import routes, { health } from './interfaces/http/routes.js';
import { errorHandler, notFound, securityHeaders } from './interfaces/http/middleware/security.js';

/**
 * Aplikasi Express saja — tanpa `listen`.
 *
 * Dipisah dari `index.ts` karena dua hal menjalankannya: proses lokal
 * (`index.ts`) dan Vercel Function (`api/[...path].js`, yang hanya butuh
 * handler `(req, res)` dan tidak boleh membuka port sendiri).
 */

assertConfig();

const app = express();

// Express menandai dirinya lewat header ini; mematikannya menghapus satu
// petunjuk versi yang tidak perlu dibagikan ke publik.
app.disable('x-powered-by');

// Di Vercel, permintaan tiba lewat proxy-nya, jadi `req.ip` tanpa ini akan
// berisi alamat soket internal dan SELURUH pengunjung berbagi satu jatah
// rate limit. `1` mempercayai tepat satu hop (edge Vercel) sehingga `req.ip`
// menjadi alamat pengunjung asli. Di lokal variabelnya tidak ada, jadi header
// yang bisa dipalsukan klien tetap tidak dipercaya.
if (process.env.VERCEL) {
  app.set('trust proxy', 1);
}

app.use(securityHeaders);

app.use(
  cors({
    origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  })
);

// Batas kecil: formulir kontak tidak pernah butuh lebih dari beberapa KB.
app.use(express.json({ limit: '16kb' }));

app.use('/api', routes);

// Jalur pendek untuk lokal; di Vercel `/health` di-rewrite ke `/api/health`
// (lihat vercel.json) karena hanya `/api/*` yang sampai ke function ini.
app.get('/health', health);

app.use(notFound);
app.use(errorHandler);

export default app;
