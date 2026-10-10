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

Gambar proyek ada di `frontend/public/images/projects/` — cover berupa tangkapan
layar `.webp` (rasio 16:10), sisanya SVG 1200 × 750. SkillConnect sengaja tidak
punya cover (`cover: null`) sehingga kartunya tampil tanpa gambar.

Foto profil ada di `frontend/public/images/aldi.webp`. Berkasnya **bukan foto
apa adanya**: latar studio putihnya sudah dibuang, jadi yang tersisa potret
dada-ke-atas dengan latar transparan (760 × 950, rasio 4:5). Kalau fotonya
diganti, ganti dengan potret berlatar transparan juga — kalau tidak, latar
putihnya akan tampak sebagai kotak terang di tema gelap.

## Cara halaman utama bekerja

Halaman utama **tidak bisa di-scroll**. Yang tampil selalu satu panel penuh
setinggi layar, dan menu di header menggantinya di tempat: klik **Proyek**,
isinya berganti jadi panel proyek dengan animasi slide, bukan meluncur ke
bawah. Panel yang isinya lebih panjang dari layar (Proyek, Layanan, Proses,
Perjalanan, FAQ) punya scroll sendiri di dalamnya, sementara header tetap di
atas.

- Alamatnya memakai hash, jadi setiap panel bisa dibuka langsung:
  `/#work`, `/#contact`, dan seterusnya.
- Daftar panelnya ada di `frontend/src/pages/Home/Home.tsx` (`PANELS`). Menu
  header mengikuti daftar yang sama di `shared/constants/sections.ts`.
- Tombol **See my work** dan **Hire me** di panel pembuka juga berpindah panel,
  bukan menggulir.
- Halaman detail proyek (`/project/<slug>`) tetap halaman biasa yang bisa
  di-scroll, lengkap dengan footer.

## Animasi

Semua gerakan memakai satu kurva dan tiga durasi (`--ease`, `--dur-fast/-/-slow`
di `frontend/src/index.css`), dan semuanya transform/opacity saja. Yang perlu
diketahui kalau mau mengubahnya:

- **Animasi masuk saat pertama kali dibuka.** Tirai penuh layar dengan
  penghitung di `shared/components/LoadingScreen.tsx` naik ke atas, lalu panel
  pembuka masuk berurutan. Tirai ini muncul satu kali per pemuatan halaman, dan
  **dilewati** kalau pengunjung menyalakan Reduce Motion atau kembali lewat
  tombol back browser.
- **Panel pembuka dipegang dulu oleh `<html data-intro="pending">`.** Atribut
  itu diset skrip pra-paint di `frontend/index.html` dan dilepas oleh
  `LoadingScreen`; CSS memakai atribut itu untuk menahan isi hero sampai tirai
  mulai terbuka. Skrip yang sama melepasnya paksa setelah 2,5 detik, jadi isi
  halaman tidak akan pernah tertinggal tersembunyi kalau animasinya gagal.
- **Foto profil dibangun "bata per bata"** — 25 pelat bergaya lego menutupinya,
  lalu luruh dari sudut kiri atas. Pelatnya dilepas dari DOM setelah selesai
  (`Hero.tsx`), jadi foto yang sudah tenang tidak menyimpan node animasi.
- Gerakan yang menyala terus-menerus hanya tiga: marquee teknologi, denyut halo
  foto, dan dua busur aurora di belakang foto.
- Reduce Motion mematikan seluruh gerakan, termasuk yang berulang — bukan
  sekadar mempercepatnya.

## Formulir kontak

Frontend mengirim `POST /api/contact` ke backend, backend mengirimkannya ke
`EMAIL_RECIPIENT` lewat Gmail. Backend hanya punya dua endpoint: `POST /api/contact`
dan `GET /api/health` (tersedia juga sebagai `GET /health` saat dijalankan lokal).

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

### Kalau kiriman gagal dengan "Terjadi kesalahan di server"

Penyebab paling sering: App Password-nya sudah tidak berlaku. Google membalas
`535-5.7.8 Username and Password not accepted`, dan backend sengaja hanya
mengirim kode `SERVER_ERROR` ke pengunjung — detailnya ada di log server saja.

Cara memastikan tanpa mengirim email apa pun, dari folder `backend/`:

```
node -e "require('dotenv').config();const n=require('nodemailer');n.createTransport({service:'gmail',auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASSWORD}}).verify().then(()=>console.log('OK')).catch(e=>console.log('GAGAL: '+e.message.split('\n')[0]))"
```

Kalau hasilnya GAGAL, buat App Password baru di
https://myaccount.google.com/apppasswords (yang lama hapus), lalu perbarui
**dua** tempat: `backend/.env` untuk lokal dan Environment Variable
`EMAIL_PASSWORD` di Vercel untuk produksi. Lihat catatan rotasi di bagian
[Rahasia](#rahasia--jangan-pernah-di-commit) — App Password pernah bocor lewat
riwayat commit, jadi nilai lama memang harus dianggap mati.

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
| `frontend/.env` | opsional, hanya `VITE_API_URL` — lihat catatan di bawah |

`frontend/.env` sengaja **tidak** ada. Di lokal frontend sudah menunjuk ke
`http://localhost:3001/api`, dan di produksi ke `/api` (satu origin dengan
situsnya), jadi tidak ada yang perlu diisi. Buat berkasnya hanya kalau
backendnya benar-benar dipisah ke domain lain.

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
api/              Vercel Function: meneruskan /api/* ke backend
  [...path].js        satu berkas, hanya me-require backend/dist/app.js
backend/          Express + TypeScript
  src/app.ts          aplikasi Express (tanpa listen) — dipakai lokal & Vercel
  src/index.ts        entry lokal: listen di PORT
  src/config/env.ts   baca & validasi variabel lingkungan
  src/domain/         entitas, aturan validasi, katalog kode error
  src/infrastructure/ pengiriman email
  src/interfaces/     route HTTP dan middleware
vercel.json       konfigurasi deploy (build, output, rewrite SPA)
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

## Deploy ke Vercel

Situs ini sudah ter-deploy di Vercel. Satu project menampung frontend statis
**dan** backend Express-nya sekaligus, jadi formulir kontak tetap berfungsi
tanpa server terpisah.

| | |
|---|---|
| URL produksi | https://portofolioaldi-eta.vercel.app |
| Project | `portofolio_aldi` |
| Build | dari `vercel.json`, tidak ada setelan dashboard yang perlu diubah |

### Cara deploy ulang

```
vercel --prod
```

Vercel akan memasang dependensi, membangun kedua folder, dan menyajikan
`frontend/dist`. Tidak ada langkah manual lain.

Untuk menarik setelan project ke mesin lokal (membuat `.vercel/`, yang sudah
masuk `.gitignore`):

```
vercel link --yes --project portofolio_aldi
```

### Environment Variables

Tiga variabel ini ada di Vercel untuk Production, Preview, dan Development:

| Nama | Nilai |
|---|---|
| `EMAIL_USER` | alamat Gmail pengirim |
| `EMAIL_PASSWORD` | App Password Gmail 16 karakter |
| `EMAIL_RECIPIENT` | alamat penerima |

`PORT` tidak perlu diisi — Vercel yang menentukan portnya.

Menggantinya (misalnya setelah membuat App Password baru):

```
vercel env rm EMAIL_PASSWORD production
vercel env add EMAIL_PASSWORD production
vercel --prod
```

Setelah env berubah, **deploy ulang** perlu dijalankan: nilainya ditanam saat
build/runtime deployment, bukan dibaca ulang dari deployment lama.

### Cara kerjanya

- **Frontend** dibangun Vite lalu disajikan sebagai berkas statis dari
  `frontend/dist`.
- **Backend** dijalankan `tsc` di `backend/`, hasilnya `backend/dist/`. Satu
  Vercel Function di `api/[...path].js` hanya me-`require` hasil itu dan
  menyerahkannya sebagai handler `(req, res)`. Rutenya tetap `/api/contact` dan
  `/api/health` karena Vercel meneruskan path aslinya.
- **Rewrite SPA** di `vercel.json` mengarahkan path tanpa ekstensi berkas ke
  `/index.html`, dan sengaja **tidak** menyentuh `/api/*` maupun path yang
  berakhiran ekstensi (`.js`, `.css`, `.webp`, …) supaya aset yang hilang
  benar-benar 404, bukan HTML 200 — aturan yang sama seperti contoh nginx di
  atas. `/health` di-rewrite ke `/api/health` karena hanya `/api/*` yang sampai
  ke function.
- **Frontend memanggil `/api` di origin yang sama** saat production, jadi tidak
  ada CORS dan tidak ada URL backend yang perlu ditanam saat build.
  `VITE_API_URL` tetap menang kalau diisi.

### Batasan yang perlu diketahui

- **Pembatasan laju formulir kontak disimpan di memori proses.** Di server
  biasa itu berarti "5 kiriman per IP per 10 menit". Di Vercel, fungsi bisa
  dijalankan di beberapa instance sekaligus, jadi batasnya menjadi *per
  instance*, bukan per situs — angkanya bisa lebih longgar dari yang tertulis
  di kode. Untuk batas yang benar-benar ketat, pindahkan hitungannya ke
  penyimpanan bersama (mis. Redis) atau pasang Vercel Firewall.
- **`backend/.env` tidak ikut ter-deploy.** Di Vercel, nilainya datang dari
  Environment Variables; berkas itu ada hanya untuk pemakaian lokal.
- **Setiap deploy baru berarti proses baru**, jadi peta rate limit selalu mulai
  kosong.
- **Vercel menolak `npx vercel` yang mengeksekusi perintah npm gaya POSIX di
  shell Windows**; kalau `installCommand` gagal dengan kode aneh, jalankan
  `vercel build --prod` lalu `vercel deploy --prebuilt --prod`.

### Memeriksa setelah deploy

```
curl -s https://portofolioaldi-eta.vercel.app/api/health
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"honeypot":"bot"}' https://portofolioaldi-eta.vercel.app/api/contact
```

Yang pertama harus menjawab `{"status":"ok",...}`. Yang kedua — honeypot
terisi — harus menjawab `{"success":true}` **tanpa** mengirim email apa pun,
jadi aman untuk dijalankan kapan saja.

Untuk menguji jalur pengiriman yang sebenarnya, isi formulir di
`/#contact` dengan data sungguhan. Kalau muncul pesan error, penyebab
sesungguhnya ada di log server:

```
vercel logs https://portofolioaldi-eta.vercel.app --json
```

