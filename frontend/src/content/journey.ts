import type { Milestone } from './types';

/**
 * Tonggak yang bisa ditelusuri ke repositori: tanggal commit tiap proyek,
 * keterangan semester capstone pada README, dan rentang pengerjaan tugas akhir.
 * Tidak ada nama perusahaan atau klien — seluruhnya proyek dan perkuliahan.
 */

export const JOURNEY: Milestone[] = [
  {
    period: '2022 — 2026',
    kind: 'education',
    title: {
      id: 'Sarjana Teknik (S.T.), Teknik Informatika',
      en: 'Bachelor of Engineering (S.T.), Informatics Engineering',
    },
    org: {
      id: 'Program studi Teknik Informatika — lulus 2026',
      en: 'Informatics Engineering programme — graduated 2026',
    },
    detail: {
      id: 'Menyelesaikan pendidikan Teknik Informatika dengan fokus pada rekayasa perangkat lunak dan pengembangan web, dan lulus dengan gelar Sarjana Teknik (S.T.). Proyek nyata berjalan berdampingan dengan perkuliahan: hampir semua aplikasi di halaman ini lahir dari tugas kuliah, capstone, atau tugas akhir, bukan dari latihan yang berhenti di kelas.',
      en: 'Completed an Informatics Engineering degree focused on software engineering and web development, graduating with the title Sarjana Teknik (S.T., Bachelor of Engineering). Real project work ran alongside coursework: almost every application on this page came out of a course assignment, a capstone, or a final thesis rather than a classroom exercise that stopped at the classroom.',
    },
  },
  {
    period: 'Jan 2025',
    kind: 'project',
    title: {
      id: 'Tugas besar: platform podcast PodCentral',
      en: 'Course project: the PodCentral podcast platform',
    },
    org: {
      id: 'Proyek tugas besar (tim)',
      en: 'Course project (team)',
    },
    detail: {
      id: 'Bagian dari tim tugas besar yang membangun platform podcast dengan Laravel dan Blade. Bagian yang saya kerjakan: halaman baca podcast beserta halaman detail dan daftar per penulis, CRUD di dashboard admin, serta logika login, profil, dan pemutar audio. Di sini saya terbiasa menyusun tabel lewat migrasi berversi dengan relasi berkunci, dan belajar bahwa tampilan yang dipakai berulang lebih enak dirawat kalau disusun sebagai komponen.',
      en: 'Part of the course-project team that built a podcast platform with Laravel and Blade. My share: the podcast reading pages with their detail page and per-author listing, the admin dashboard CRUD, and the login, profile, and audio player logic. This is where I got used to building tables through versioned migrations with keyed relations, and learned that an interface used in many places is easier to maintain when it is assembled from components.',
    },
  },
  {
    period: 'Okt — Des 2025',
    kind: 'project',
    title: {
      id: 'Capstone: platform marketplace SkillConnect',
      en: 'Capstone: the SkillConnect marketplace',
    },
    org: {
      id: 'Proyek capstone tim, semester tujuh',
      en: 'Team capstone project, seventh semester',
    },
    detail: {
      id: 'Bagian dari tim capstone yang membangun marketplace jasa dengan delapan modul backend berarsitektur Domain-Driven Design dan antarmuka React. Bekerja dalam tim sebesar ini mengajarkan hal yang tidak muncul di proyek pribadi: batas antarmodul harus disepakati lebih dulu, karena setiap orang mengerjakan bagiannya secara paralel dan integrasi tidak bisa ditunda sampai akhir.',
      en: 'Part of the capstone team that built a services marketplace with eight DDD-structured backend modules and a React interface. Working in a team this size taught what solo projects never do: module boundaries have to be agreed on first, because everyone builds in parallel and integration cannot be postponed to the end.',
    },
  },
  {
    period: 'Jul — Sep 2026',
    kind: 'project',
    title: {
      id: 'Tugas akhir: AF GPS Tracker, pelacakan kendaraan GPS',
      en: 'Final thesis: AF GPS Tracker, GPS vehicle tracking',
    },
    org: {
      id: 'Tugas akhir Teknik Informatika',
      en: 'Informatics Engineering final thesis',
    },
    detail: {
      id: 'Membangun sistem pelacakan kendaraan GPS dari nol: firmware perangkat, ingest MQTT dengan verifikasi tanda tangan HMAC per perangkat, geofence radius/administratif/polygon, deteksi berhenti, riwayat perjalanan dengan playback, notifikasi email dan WhatsApp, ekspor PDF, dashboard admin, sampai konfigurasi deploy untuk server produksi. Proyek ini paling banyak mengubah cara saya bekerja: setiap keputusan keamanan dan setiap proses latar belakang harus punya alasan yang bisa saya jelaskan, bukan sekadar berhasil dijalankan di laptop.',
      en: 'Built a GPS vehicle tracking system from scratch: device firmware, MQTT ingest with per-device HMAC signature verification, radius/administrative/polygon geofences, stop detection, trip history with playback, email and WhatsApp notifications, PDF exports, an admin dashboard, and production deploy configuration. This project changed how I work the most: every security decision and every background process needs a reason I can explain, not merely a laptop that ran it once.',
    },
  },
  {
    period: 'Sep 2026',
    kind: 'project',
    title: {
      id: 'POS Toko Hakim — aplikasi kasir grosir',
      en: 'POS Toko Hakim — grocery point-of-sale',
    },
    org: {
      id: 'Proyek aplikasi kasir',
      en: 'Point-of-sale application project',
    },
    detail: {
      id: 'Membangun aplikasi kasir untuk toko grosir sembako: transaksi dengan satuan bertingkat, aturan stok minus yang bisa dibuka per produk, laporan penjualan dan laba, dashboard, serta saran pembelian yang bisa diunduh sebagai CSV untuk dibawa ke supplier. Aplikasi ini harus tetap melayani penjualan saat internet mati, jadi transaksinya disimpan lebih dulu di perangkat lewat IndexedDB lalu dikirim ulang dengan penanda yang sama supaya tidak menjadi transaksi ganda. Spesifikasi awal mengunci Laravel, lalu diganti menjadi Node dan React atas permintaan pemilik proyek — dari situ saya belajar memisahkan aturan bisnis dari framework, karena aturan stok dan nomor struk yang sama harus tetap berlaku setelah seluruh lapisan teknisnya diganti.',
      en: 'Built a point-of-sale for a grocery wholesaler: transactions with multi-level units, a negative-stock rule that can be opened per product, sales and profit reports, a dashboard, and purchase suggestions downloadable as a CSV to take to the supplier. The app has to keep serving sales when the internet drops, so a transaction is written to the device through IndexedDB first and resent with the same marker so it never becomes a duplicate. The original specification locked in Laravel and was replaced with Node and React at the project owner\u2019s request — which taught me to keep business rules separate from the framework, because the same stock rule and receipt numbering still had to hold after the whole technical layer was swapped out.',
    },
  },
];
