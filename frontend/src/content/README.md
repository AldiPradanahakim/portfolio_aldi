# Isi Website — `frontend/src/content/`

Seluruh teks dan data bawaan website ada di folder ini sebagai file TypeScript
biasa. Mengubah tulisan di sini langsung mengubah isi halaman setelah disimpan
(Vite memuat ulang otomatis). Sejak ada panel CMS (`/admin`), berkas-berkas ini
berperan sebagai **isi bawaan** (`SEED_CONTENT`) — kalau adapter CMS punya
dokumen tersimpan, dokumen itulah yang menang. Satu-satunya bagian yang
menghubungi backend adalah formulir kontak, yang mengirim pesan ke API Go di
folder `api/`.

## Mau mengubah apa? Edit file ini

| Ingin mengubah | File |
|---|---|
| Nama, peran, bio, email, lokasi, tautan sosial | `profile.ts` |
| Daftar proyek, kategori, cover, teknologi | `projects.ts` |
| Daftar keahlian per kelompok (dipakai chip hero & statistik) | `skills.ts` |
| Riwayat kuliah & proyek (timeline) | `journey.ts` |
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
- `PROFILE.socials` berisi empat tautan: WhatsApp (`wa.me`), LinkedIn,
  Instagram, dan email. Nomor WhatsApp ditulis dalam format internasional tanpa
  tanda plus dan tanpa nol di depan (`62…`) supaya tautan `wa.me` valid.
  Kalau ada akun baru (misalnya GitHub), tambahkan di situ — jangan diisi
  tautan karangan.
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

## Panel admin (`/admin`)

Isi sekarang juga bisa diedit lewat `/admin` tanpa menyentuh kode: masuk
(mode lokal: sandi `admin`), ubah, lalu simpan. Isi disimpan sebagai satu
dokumen JSON lewat adapter (localStorage / Supabase / Firebase). Berkas di
folder ini tetap menjadi **isi bawaan** — `frontend/src/data/seed.ts` menyusun
`SEED_CONTENT` dari ekspor di sini dan dipakai saat adapter belum punya data.
