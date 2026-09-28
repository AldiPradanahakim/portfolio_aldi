import type { NextFunction, Request, Response } from 'express';
import { errorBody } from '../../../domain/contact/ContactMessage.js';

/**
 * Pembatasan laju sederhana per alamat IP, disimpan di memori proses.
 *
 * Batasnya cukup untuk formulir kontak satu orang, dan yang penting: peta
 * pelacakan ini berbatas keras, baik dari sisi waktu maupun jumlah, sehingga
 * tidak bisa dipakai menghabiskan memori.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

/**
 * Batas keras jumlah IP yang dilacak sekaligus.
 *
 * ponytail: eviksi memakai urutan penyisipan Map sebagai perkiraan "paling
 * lama tidak aktif" — cukup untuk satu formulir kontak. Kalau nanti situsnya
 * dibelakang proxy bersama dan butuh ketepatan, ganti dengan peta ber-indeks
 * waktu atau simpan hitungan di Redis.
 */
const MAX_TRACKED_IPS = 5000;

/** Sapuan entri kedaluwarsa dijalankan tiap sekian panggilan, bukan tiap kali. */
const PRUNE_EVERY = 64;

const hits = new Map<string, number[]>();
let callsSincePrune = 0;

function pruneExpired(now: number): void {
  for (const [ip, timestamps] of hits) {
    const fresh = timestamps.filter((t) => now - t < WINDOW_MS);

    if (fresh.length === 0) hits.delete(ip);
    else hits.set(ip, fresh);
  }
}

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();

  if (++callsSincePrune >= PRUNE_EVERY) {
    callsSincePrune = 0;
    pruneExpired(now);
  }

  // Tanpa "trust proxy", ini alamat soket sebenarnya — bukan header yang bisa
  // dipalsukan klien seperti X-Forwarded-For.
  const key = req.ip ?? req.socket.remoteAddress ?? 'unknown';

  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - recent[0]!)) / 1000);

    res.setHeader('Retry-After', String(retryAfterSec));
    res.status(429).json(errorBody('RATE_LIMITED'));
    return;
  }

  // Batas keras: IP baru tidak boleh menambah entri saat peta sudah penuh.
  // Entri paling lama dibuang lebih dulu — Map menjaga urutan penyisipan,
  // dan di bawah ini setiap IP aktif selalu disisipkan ulang ke akhir,
  // sehingga urutannya benar-benar paling-lama-tidak-aktif.
  if (!hits.has(key) && hits.size >= MAX_TRACKED_IPS) {
    const oldest = hits.keys().next().value;

    if (oldest !== undefined) hits.delete(oldest);
  }

  recent.push(now);
  // set() pada kunci yang sudah ada TIDAK memindahkannya ke akhir, jadi
  // hapus dulu supaya urutan eviksi di atas tetap benar.
  hits.delete(key);
  hits.set(key, recent);

  next();
}
