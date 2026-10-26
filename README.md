# Portofolio Aldi Pradana Hakim

Situs portofolio pribadi: profil, daftar proyek, riwayat, dan formulir kontak.
Frontend React + Vite + Tailwind, backend Go kecil yang hanya dipakai untuk
mengirim email dari formulir kontak.

**Isi halaman tidak bergantung pada layanan luar apa pun secara bawaan.** Seluruh
teks dan data website berasal dari berkas TypeScript lokal di
`frontend/src/content/`; tanpa konfigurasi tambahan situs tetap tampil penuh.
Sejak ada panel CMS (`/admin`), isi itu bisa ditimpa dari satu dokumen JSON yang
disimpan di `localStorage`, Supabase, atau Firebase — semuanya opsional. Layanan
luar yang dipakai hanya Gmail SMTP lewat stdlib Go (`net/smtp`) untuk formulir
kontak: kalau kredensialnya kosong, seluruh halaman tetap tampil normal, hanya
pengiriman pesannya yang tidak jalan.

## Cara menjalankan

Prasyarat: **Node.js** (untuk frontend) dan **Go 1.22 atau lebih baru** (untuk
backend). Kalau belum ada, install dari https://nodejs.org dan
https://go.dev/dl/ terlebih dahulu.

**Paling gampang — dobel klik `Jalankan.bat`.**

1. Jendela hitam (console) terbuka — itu jendela server, biarkan tetap terbuka.
2. Beberapa detik kemudian jendela aplikasi terbuka sendiri (tanpa address bar).
3. Untuk mematikan semuanya: klik jendela hitamnya, tekan **Ctrl+C**.

Kalau `Jalankan.bat` bilang Node.js atau Go tidak ditemukan, install dari
alamat di atas lalu dobel klik lagi. Dependensi frontend (`npm install`)
dipasang otomatis saat pertama kali dijalankan.

Agar formulir kontak berfungsi, salin `.env.example` menjadi `.env` di root
lalu isi nilainya (lihat bagian [Formulir kontak](#formulir-kontak)).

**Lewat terminal:**

```
npm run dev
```

Sama saja: backend Go dan frontend jalan bersamaan, jendela aplikasi terbuka otomatis.

## Alamat & port

| Bagian | Alamat |
|---|---|
| Backend (Go) | http://localhost:3001 |
| Frontend | http://localhost:5180 — otomatis pindah ke 5181 lalu 5182 kalau portnya terpakai |

Port 5173 tidak dipakai project ini karena sudah dipakai project lain di komputer ini.

## Di mana mengubah isi website

Semua teks ada di **`frontend/src/content/`**, satu berkas per bagian:

| Ingin mengubah | Berkas |
|---|---|
| Nama, peran, bio, email, lokasi, tautan sosial | `content/profile.ts` |
| Daftar proyek, kategori, gambar cover | `content/projects.ts` |
| Keahlian (dipakai chip hero & statistik) | `content/skills.ts` |
| Riwayat kuliah & proyek | `content/journey.ts` |

Semua teks wajib diisi dua bahasa (`id` dan `en`). Penjelasan lengkapnya ada di
`frontend/src/content/README.md`.

Gambar proyek ada di `frontend/public/images/projects/` — cover berupa tangkapan
layar `.webp` (rasio 16:10), sisanya SVG 1200 × 750. SkillConnect sengaja tidak
punya cover (`cover: null`) sehingga kartunya tampil tanpa gambar.

Foto profil ada di `frontend/public/images/aldi-character.webp`. Isinya bukan
foto, melainkan karakter ilustrasi (bukan wajah asli), potret dada-ke-atas
dengan latar transparan (1210 × 1590, rasio ± 3:4). Kalau gambarnya diganti,
ganti dengan potret berlatar transparan juga — kalau tidak, latar putihnya akan
tampak sebagai kotak terang di tema gelap. `aldi.webp` (foto lama) masih ada di
folder yang sama sebagai cadangan.

## Cara halaman utama bekerja

Halaman utama adalah halaman biasa yang **bisa di-scroll**. Semua bagian
ditumpuk berurutan — hero, tentang, proyek, perjalanan, lalu kontak — dan
header tetap menempel di atas saat halaman bergulir.
Setelah bagian kontak ada footer, sama seperti halaman detail proyek.

- Alamat memakai hash, jadi setiap bagian bisa dibuka langsung: `/#work`,
  `/#contact`, dan seterusnya. Membuka hash itu dari halaman lain akan mendarat
  di bagian tersebut, dan mengklik menu di header menggulir mulus ke bagian itu
  tanpa memuat ulang halaman.
- Daftar bagiannya ada di `frontend/src/pages/Home/Home.tsx` (`SECTIONS`). Menu
  header hanya sebagian dari daftar itu: `shared/constants/sections.ts` memuat
  `NAV_SECTIONS`, dan setiap id-nya harus berupa id bagian. Bagian pembuka
  dibuka lewat logo, bagian kontak lewat tombol di header dan di bagian lain.
- Tombol **See my work** dan **Hire me** di hero menggulir ke bagian proyek dan
  kontak.
- Sorotan menu mengikuti bagian yang sedang terlihat di layar, bukan hash di
  address bar.

## Animasi

Semua gerakan memakai satu kurva dan tiga durasi (`--ease`, `--dur-fast/-/-slow`
di `frontend/src/index.css`), dan semuanya transform/opacity saja. Yang perlu
diketahui kalau mau mengubahnya:

- **Animasi masuk saat pertama kali dibuka.** Tirai penuh layar dengan
  penghitung di `shared/components/LoadingScreen.tsx` naik ke atas, lalu isi
  hero masuk berurutan. Tirai ini muncul satu kali per pemuatan halaman, dan
  **dilewati** kalau pengunjung menyalakan Reduce Motion atau kembali lewat
  tombol back browser.
- **Hero dipegang dulu oleh `<html data-intro="pending">`.** Atribut
  itu diset skrip pra-paint di `frontend/index.html` dan dilepas oleh
  `LoadingScreen`; CSS memakai atribut itu untuk menahan isi hero sampai tirai
  mulai terbuka. Skrip yang sama melepasnya paksa setelah 2,5 detik, jadi isi
  halaman tidak akan pernah tertinggal tersembunyi kalau animasinya gagal.
- **Foto profil dibangun "bata per bata"** — 25 pelat bergaya lego menutupinya,
  lalu luruh dari sudut kiri atas. Pelatnya dilepas dari DOM setelah selesai
  (`Hero.tsx`), jadi foto yang sudah tenang tidak menyimpan node animasi.
- Gerakan yang menyala terus-menerus hanya empat: marquee teknologi, denyut halo
  foto, dua busur aurora di belakang foto, dan denyut titik garis waktu yang
  sedang aktif di `Journey.tsx`.
- Reduce Motion mematikan seluruh gerakan, termasuk yang berulang — bukan
  sekadar mempercepatnya.
- **Posisi scroll diingat per entri riwayat.** `shared/lib/scroll.ts` menyimpan
  posisi `window.scrollY` per key riwayat, dan `App.tsx` memulihkannya saat
  tombol back/forward (POP) — berlaku di semua halaman.

## Formulir kontak

Frontend mengirim `POST /api/contact` ke backend Go, backend mengirimkannya ke
`EMAIL_RECIPIENT` lewat Gmail. Backend hanya punya dua endpoint: `POST /api/contact`
dan `GET /api/health` (tersedia juga sebagai `GET /health`, baik di lokal maupun
di Vercel lewat rewrite di `vercel.json`).

Agar formulir berfungsi, isi **`.env`** di root:

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

Cara memastikan tanpa mengirim email apa pun: kirim formulir dengan honeypot
terisi (misal `{"honeypot":"bot"}`) ke `/api/contact` — harus dibalas
`{"success":true}` **tanpa** mengirim email. Untuk memeriksa kredensial yang
sebenarnya, kirim formulir sungguhan lalu lihat log server; kalau muncul
`535`, App Password-nya bermasalah.

```
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"honeypot":"bot"}' http://localhost:3001/api/contact
```

Kalau kiriman sungguhan gagal, buat App Password baru di
https://myaccount.google.com/apppasswords (yang lama hapus), lalu perbarui
**dua** tempat: `.env` di root untuk lokal dan Environment Variable
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

Ada dua lokasi `.env` yang harus dijaga, dan keduanya **tidak boleh** ikut Git:

| Berkas | Isinya |
|---|---|
| `.env` (di root) | `PORT`, `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_RECIPIENT` |
| `frontend/.env` | opsional, hanya `VITE_API_URL` — lihat catatan di bawah |

`frontend/.env` sengaja **tidak** ada. Di lokal frontend sudah menunjuk ke
`http://localhost:3001/api`, dan di produksi ke `/api` (satu origin dengan
situsnya), jadi tidak ada yang perlu diisi. Buat berkasnya hanya kalau
backendnya benar-benar dipisah ke domain lain.

`.gitignore` sudah menutup keduanya (`.env` berlaku untuk semua folder). Yang
boleh di-commit hanya `.env.example`, dan isinya placeholder.

### Sebelum push

```
go vet ./...
go build ./...
go test ./...
node --check dev.mjs
npm run secrets:check
```

`go vet`, `go build`, dan `go test` memeriksa kode Go; `node --check` memastikan
`dev.mjs` sintaksnya benar. `npm run secrets:check` membaca `git ls-files`
(hanya berkas yang ter-track, jadi cepat) dan mencari: berkas `.env*` yang ikut
ter-track selain `*.example`, baris
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
api/              Vercel Function: satu berkas Go per endpoint
  health.go           GET /api/health
  contact.go          POST /api/contact
cmd/server/       entry lokal: listen di PORT
  main.go
pkg/portfolio/  logika backend bersama (dipakai lokal & Vercel)
  app.go              router, handler health/contact, body & error
  config.go           baca & validasi variabel lingkungan (.env)
  contact.go          aturan validasi, katalog kode error
  mailer.go           pengiriman email Gmail SMTP
  middleware.go       header keamanan, CORS, pembatas laju
  contact_test.go     uji validasi & pembatas laju
go.mod            module Go (stdlib saja, tanpa dependensi)
.env.example      contoh variabel lingkungan — salin menjadi .env
vercel.json       konfigurasi deploy (build, output, rewrite SPA)
scripts/          pemeriksa rahasia (`npm run secrets:check`)
  check-secrets.mjs   memindai berkas yang di-track Git
package.json      skrip root: `dev`, `secrets:check`
Jalankan.bat      pintasan Windows untuk `node dev.mjs`
frontend/         React + Vite + Tailwind
  src/main.tsx        entry React: memasang App ke #root
  src/App.tsx         provider bahasa, router, dan daftar rute
  src/index.css       Tailwind + token warna/tipografi
  src/vite-env.d.ts   tipe untuk import.meta.env (VITE_*)
  src/content/        seluruh isi website (lihat tabel di atas)
  src/data/           dokumen SiteContent: tipe, SEED_CONTENT, adapter
                      (local / Supabase / Firebase), provider + store
  src/admin/          panel CMS: Login, Dashboard, 6 editor, validasi
  src/motion/         primitif animasi: SplitText, Reveal, Tilt, Marquee,
                      Magnetic, CountUp, MaskImage, PageTransition, Lightbox
  src/pages/          halaman: Home, ProjectDetail, NotFound
  src/widgets/        bagian halaman: Hero, About, Work, Services, Skills,
                      Journey, Contact, TrustStrip, Footer, Nav
  src/entities/       komponen data: ProjectCard
  src/shared/         ui, components, hooks, context, constants, lib
  public/             favicon dan gambar proyek
  index.html          skrip pra-paint tema + `data-intro`
  vite.config.ts      konfigurasi Vite (manual chunks, optimizeDeps)
supabase/schema.sql   tabel + RLS untuk adapter Supabase
firebase/firestore.rules  aturan baca publik / tulis terautentikasi
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
**dan** backend Go-nya sekaligus, jadi formulir kontak tetap berfungsi tanpa
server terpisah.

| | |
|---|---|
| URL produksi | https://portofolioaldi-eta.vercel.app |
| Project | `portofolio_aldi` |
| Build | dari `vercel.json`, tidak ada setelan dashboard yang perlu diubah |

### Cara deploy ulang

```
vercel --prod
```

Vercel akan memasang dependensi frontend, membangunnya, dan menyajikan
`frontend/dist`. Function Go di `api/` ikut dibangun otomatis dari `go.mod`
yang ada di root. Tidak ada langkah manual lain.

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
- **Backend** adalah function Go di `api/` (`health.go` dan `contact.go`) yang
  menyerahkan setiap request ke paket `pkg/portfolio`. Rutenya tetap
  `/api/contact` dan `/api/health` karena Vercel meneruskan path aslinya.
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
- **`.env` di root tidak ikut ter-deploy.** Di Vercel, nilainya datang dari
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

## CMS

Isi situs sekarang dikelola lewat panel `/admin` (React, tanpa dependensi baru):

- **Satu dokumen JSON.** Seluruh isi — profil, kategori, proyek, keahlian,
  perjalanan, dan pengaturan SEO — disatukan menjadi satu objek
  `SiteContent` (`frontend/src/content/types.ts`).
- **Isi bawaan tetap di `frontend/src/content/*`** sebagai `SEED_CONTENT`
  (`frontend/src/data/seed.ts`). Situs merender dari sini secara instan walau
  adapter belum punya data.
- **Adapter bisa ditukar** (local / Supabase / Firebase) tanpa SDK baru: baca
  dan tulis lewat `fetch`. Pilih sumber dengan `VITE_DATA_SOURCE`, atau biarkan
  otomatis: Supabase bila kuncinya lengkap, lalu Firebase, lalu local.

### Menjalankan

```
cd frontend
npm run dev
# buka http://localhost:5180/admin
```

Mode lokal (default): sandi `admin` (ubah lewat `VITE_ADMIN_PASSWORD`). Mode ini
**hanya untuk pratinjau** — kata sandinya dibandingkan di peramban, bukan
keamanan sungguhan; data disimpan di `localStorage`.

### Menghubungkan Supabase

1. Isi `frontend/.env`: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (atau
   set `VITE_DATA_SOURCE=supabase`).
2. Aktifkan provider Email di Authentication, buat pengguna admin.
3. Jalankan `supabase/schema.sql` di SQL Editor.

### Menghubungkan Firebase

1. Isi `frontend/.env`: `VITE_FIREBASE_API_KEY` + `VITE_FIREBASE_PROJECT_ID`
   (atau set `VITE_DATA_SOURCE=firebase`).
2. Aktifkan email/password di Authentication, buat pengguna admin.
3. Pasang `firebase/firestore.rules`.

Panel admin tidak punya endpoint upload gambar — semua kolom gambar memakai
URL. Nomor referensi lengkap ada di `frontend/.env.example`.

