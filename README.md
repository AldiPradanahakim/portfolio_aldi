# Portofolio Aldi Pradan Hakim

Situs portofolio pribadi: profil, daftar proyek, layanan, riwayat, dan formulir kontak.
Frontend React + Vite + Tailwind, backend Express kecil yang hanya dipakai untuk
mengirim email dari formulir kontak.

**Isi halaman tidak bergantung pada apa pun di luar repositori ini.** Seluruh
teks dan data website berasal dari berkas TypeScript lokal di
`frontend/src/content/` — tidak ada database dan tidak ada API konten pihak
ketiga. Satu-satunya layanan luar yang dipakai adalah Gmail SMTP lewat
Nodemailer, dan itu hanya untuk formulir kontak: kalau kredensialnya kosong,
seluruh halaman tetap tampil normal, hanya pengiriman pesannya yang tidak jalan.

## Cara menjalankan

**Paling gampang — dobel klik `Jalankan.bat`.**

1. Jendela hitam (console) terbuka — itu jendela server, biarkan tetap terbuka.
2. Beberapa detik kemudian jendela aplikasi terbuka sendiri (tanpa address bar).
3. Untuk mematikan semuanya: klik jendela hitamnya, tekan **Ctrl+C**.

Kalau `Jalankan.bat` bilang Node.js tidak ditemukan, install dulu dari
https://nodejs.org lalu dobel klik lagi. Dependensi (`npm install`) dipasang
otomatis saat pertama kali dijalankan.

**Lewat terminal:**

```
npm run dev
```

Sama saja: backend dan frontend jalan bersamaan, jendela aplikasi terbuka otomatis.

## Alamat & port

| Bagian | Alamat |
|---|---|
| Backend | http://localhost:3001 |
| Frontend | http://localhost:5180 — otomatis pindah ke 5181 lalu 5182 kalau portnya terpakai |

Port 5173 tidak dipakai project ini karena sudah dipakai project lain di komputer ini.

## Di mana mengubah isi website

Semua teks ada di **`frontend/src/content/`**, satu berkas per bagian:

| Ingin mengubah | Berkas |
|---|---|
| Nama, peran, bio, email, lokasi, tautan sosial | `content/profile.ts` |
| Daftar proyek, kategori, gambar cover | `content/projects.ts` |
| Layanan yang ditawarkan | `content/services.ts` |
| Keahlian | `content/skills.ts` |
| Riwayat kuliah & proyek | `content/journey.ts` |
| Tahapan kerja sama dengan klien | `content/process.ts` |
| Pertanyaan yang sering diajukan | `content/faq.ts` |

Semua teks wajib diisi dua bahasa (`id` dan `en`). Penjelasan lengkapnya ada di
`frontend/src/content/README.md`.

Gambar proyek ada di `frontend/public/images/projects/` (SVG, ukuran 1200 × 750).

## Formulir kontak

Frontend mengirim `POST /api/contact` ke backend, backend mengirimkannya ke
`EMAIL_RECIPIENT` lewat Gmail. Backend hanya punya dua endpoint: `POST /api/contact`
dan `GET /health`.

Agar formulir berfungsi, isi **`backend/.env`**:

```
PORT=3001
EMAIL_USER=aldi.pradan.hakim26@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_RECIPIENT=aldi.pradan.hakim26@gmail.com
```

`EMAIL_PASSWORD` adalah **App Password** Gmail 16 karakter
(https://myaccount.google.com/apppasswords), bukan kata sandi akun Google.
Tanpa variabel ini backend menolak jalan dan mencetak pesan yang menjelaskan
apa yang kurang.

## Rahasia — jangan pernah di-commit

Repositori ini **publik** (https://github.com/AldiPradanahakim/portfolio_aldi),
jadi apa pun yang masuk ke sebuah commit bisa dibaca siapa saja.

> **Riwayat repositori ini ditulis ulang pada 2026-09-28** untuk membuang
> kredensial yang pernah ter-commit (App Password Gmail, kunci Supabase, dan
> hasil build `dist/` yang memuat kunci itu). Commit lama sudah tidak lagi
> bagian dari riwayat, tapi nilai yang pernah bocor tetap harus dianggap bocor:
> GitHub bisa menyimpan objek lama itu untuk sementara, dan siapa pun yang
> sempat menyalinnya tetap punya salinan.

Ada tiga lokasi `.env` yang harus dijaga, dan ketiganya **tidak boleh** ikut Git:

| Berkas | Isinya |
|---|---|
| `.env` (di root) | sudah dihapus dari working tree; jangan dibuat lagi tanpa masuk `.gitignore` |
| `backend/.env` | `PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_RECIPIENT` |
| `frontend/.env` | `VITE_API_URL` saja |

`.gitignore` sudah menutup ketiganya (`.env` berlaku untuk semua folder). Yang
boleh di-commit hanya `backend/.env.example`, dan isinya placeholder.

### Sebelum push

```
npm run secrets:check
```

Skripnya membaca `git ls-files` (hanya berkas yang ter-track, jadi cepat) dan
mencari: berkas `.env*` yang ikut ter-track selain `*.example`, baris
`EMAIL_PASSWORD=` / `SUPABASE_ANON_KEY=` yang benar-benar terisi, `PRIVATE KEY`,
bentuk token yang lazim (`sb_publishable_`, `sb_secret_`, `ghp_`, `AKIA`,
`sk-`), dan pola App Password Gmail (alamat email diikuti empat kelompok
16 karakter). Nilai yang cocok tidak pernah dicetak — hanya lokasi dan nama
polanya. Keluar dengan kode 1 kalau ada temuan, jadi **jangan push selama masih
merah**.

### Kalau sebuah rahasia sudah terlanjur masuk commit

Menghapus berkasnya di commit berikutnya **tidak cukup**. Nilainya tetap
tersimpan di riwayat Git dan bisa dibaca siapa pun dengan
`git show <commit>:<path>` — jadi anggap rahasia itu sudah bocor sejak commit
pertama kali dibuat. Yang harus dilakukan, berurutan:

1. **Ganti nilainya (rotate) lebih dulu**, karena ini yang benar-benar
   menghentikan penyalahgunaan. Untuk Gmail: hapus App Password yang bocor di
   https://myaccount.google.com/apppasswords lalu buat yang baru. Untuk kunci
   Supabase: hapus/regenerate kunci di dashboard project terkait. Kunci lama
   harus dianggap tidak berlaku lagi.
2. Baru setelah itu bersihkan riwayatnya (`git filter-repo` atau BFG), lalu
   paksa push. Ini operasi berbahaya pada repositori publik — kerjakan dengan
   sadar dan setelah punya cadangan.
3. Pastikan `.gitignore` sudah benar supaya tidak terulang.

Urutannya penting: membersihkan riwayat tanpa mengganti nilainya hanya
menyembunyikan kebocoran, bukan menutupnya.

## Struktur

```
backend/          Express + TypeScript
  src/index.ts        entry: middleware, route, listen
  src/config/env.ts   baca & validasi variabel lingkungan
  src/domain/         entitas, aturan validasi, katalog kode error
  src/infrastructure/ pengiriman email
  src/interfaces/     route HTTP dan middleware
frontend/         React + Vite + Tailwind
  src/main.tsx        entry React: memasang App ke #root
  src/App.tsx         provider bahasa, router, dan daftar rute
  src/index.css       Tailwind + token warna/tipografi
  src/vite-env.d.ts   tipe untuk import.meta.env (VITE_*)
  src/content/        seluruh isi website (lihat tabel di atas)
  src/pages/          halaman: Home, ProjectDetail, NotFound
  src/widgets/        bagian halaman: Hero, About, Work, Services, Skills,
                      Journey, Process, Faq, Contact, TrustStrip, Footer, Nav
  src/entities/       komponen data: ProjectCard
  src/shared/         ui, components, hooks, context, constants, lib
  public/             favicon dan gambar proyek
dev.mjs           menjalankan backend + frontend sekaligus
```

## Menaruh situs ini di hosting statis

`npm run build` di folder `frontend/` menghasilkan berkas statis di
`frontend/dist/`. Hasilnya perlu server yang mengarahkan **semua path yang tidak
dikenal ke `/index.html`**, karena React Router memakai `BrowserRouter`: membuka
`/project/trackio` langsung dari address bar akan dicari sebagai berkas oleh
server, bukan diteruskan ke aplikasi.

`vite dev` dan `vite preview` sudah menangani ini sendiri, jadi masalahnya baru
muncul di hosting sungguhan (nginx, Apache, S3 + CloudFront, dan sejenisnya).
Aturannya:

- Path tanpa ekstensi berkas → sajikan `/index.html` (inilah rute React Router).
- Path yang berakhiran ekstensi berkas, dan semua yang ada di bawah `/assets/`,
  **jangan** diarahkan ke `index.html`. Kalau ikut diarahkan, aset yang hilang
  akan dibalas HTML 200, dan kegagalan build baru ketahuan sebagai error
  JavaScript yang membingungkan alih-alih 404 yang jelas.

Contoh nginx:

```nginx
# Rute aplikasi: apa pun yang tidak punya ekstensi berkas
location / {
    try_files $uri $uri/ /index.html;
}

# Aset: 404 sungguhan kalau berkasnya tidak ada.
# location regex menang atas prefix "/", jadi ini dipakai lebih dulu.
location ~* \.(?:js|css|svg|png|jpe?g|webp|avif|ico|gif|woff2?|ttf|txt|xml|json|map)$ {
    try_files $uri =404;
}

location /assets/ {
    try_files $uri =404;
}
```

