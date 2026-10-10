# Isi Website — `frontend/src/content/`

Seluruh teks dan data website ada di folder ini sebagai file TypeScript biasa.
Tidak ada database, tidak ada API, tidak ada layanan backend: mengubah tulisan
di sini langsung mengubah isi halaman setelah disimpan (Vite memuat ulang
otomatis).

## Mau mengubah apa? Edit file ini

| Ingin mengubah | File |
|---|---|
| Nama, peran, bio, email, lokasi, tautan sosial | `profile.ts` |
| Daftar proyek, kategori, cover, teknologi | `projects.ts` |
| Layanan yang ditawarkan | `services.ts` |
| Daftar keahlian per kelompok | `skills.ts` |
| Riwayat kuliah & proyek (timeline) | `journey.ts` |
| Tahapan kerja sama dengan klien | `process.ts` |
| Pertanyaan yang sering diajukan | `faq.ts` |
| Bentuk datanya (kolom apa saja yang wajib) | `types.ts` |

`index.ts` hanya mengumpulkan semuanya supaya bisa diimpor sekali:
`import { PROFILE, PROJECTS } from '../content'`.

## Aturan penting

**Semua teks harus ada versi Indonesia dan Inggris.** Bentuknya seperti ini:

```ts
tagline: {
  id: 'Teks bahasa Indonesia',
  en: 'The English text',
}
```

Tulis keduanya secara wajar, bukan terjemahan kata per kata. Kalau hanya mengisi
satu bahasa, halaman akan menampilkan bagian kosong saat bahasa itu dipilih.

**Jangan mengarang fakta.** Semua angka, klien, dan tautan di sini harus bisa
dibuktikan dari kode yang benar-benar ada. Tidak ada testimoni karangan, tidak
ada nama perusahaan, tidak ada harga, dan tidak ada URL yang tidak jelas asalnya.

## Catatan khusus

- `PROFILE.photo` menunjuk ke `frontend/public/images/aldi.webp`. Ganti berkasnya
  dengan nama yang sama, atau ubah nilainya kalau namanya berbeda. Kalau
  berkasnya hilang, antarmuka otomatis kembali menampilkan monogram "AP"
  (lihat `Hero.tsx`), jadi halaman tidak pernah menampilkan gambar rusak.
- `PROFILE.socials` untuk sekarang hanya berisi email. Tambahkan GitHub,
  LinkedIn, atau Instagram di situ kalau akunnya sudah ada — jangan diisi
  tautan karangan. Ada contohnya berupa komentar di dalam `profile.ts`.
- `links` pada proyek dikosongkan karena tidak ada satu pun proyek yang punya
  URL publik. Isi hanya kalau demo atau repositorinya benar-benar bisa dibuka
  orang lain.
- `metrics` harus berupa fakta yang bisa dihitung ("8 modul", "23 migrasi"),
  bukan persentase peningkatan kinerja yang tidak pernah diukur.
- Di `skills.ts`, setiap butir juga berbentuk `{ id, en }`. Sebagian besar isinya
  nama teknologi, jadi kedua sisi memang sama persis (`{ id: 'React 18', en: 'React 18' }`)
  — itu wajar, sama seperti daftar `stack` pada proyek. Yang berupa frasa, bukan
  nama produk, wajib ditulis dua bahasa.
- `cover` dan `gallery` menunjuk ke berkas di `frontend/public/images/projects/`.
  Cover berupa tangkapan layar (`.webp`, rasio 16:10). Sisanya bisa SVG
  buatan sendiri berukuran 1200 × 750.
- `cover` boleh bernilai `null` kalau proyeknya tidak punya tangkapan layar.
  Kartu dan halaman detailnya lalu tampil tanpa gambar — bukan gambar rusak —
  dan `gallery` sebaiknya dikosongkan juga.

## Menambah proyek baru

1. Salin satu objek di `projects.ts`, ubah `slug`-nya (harus unik).
2. Buat berkas cover di `frontend/public/images/projects/<slug>.webp`.
3. Kalau kategorinya belum ada di `CATEGORIES`, tambahkan sekalian —
   pilihannya terbatas pada `CategoryId` di `types.ts`.
