import type { Service } from './types';

/**
 * Ikon wajib salah satu dari: Code2, Smartphone, Database, Cpu, CreditCard,
 * BarChart3, Cloud, Wrench — nama komponen lucide-react.
 * Setiap butir di bawah menggambarkan pekerjaan yang benar-benar dikerjakan di
 * proyek pada projects.ts, bukan daftar kemampuan yang belum dibuktikan.
 */

export const SERVICES: Service[] = [
  {
    id: 'web-app',
    icon: 'Code2',
    title: {
      id: 'Aplikasi web full-stack',
      en: 'Full-stack web applications',
    },
    description: {
      id: 'Satu aplikasi utuh, dari skema database sampai halaman terakhir yang dipakai pengguna. Cocok untuk pekerjaan yang sekarang berjalan di spreadsheet atau buku catatan dan butuh alur yang jelas beserta riwayatnya.',
      en: 'One complete application, from the database schema to the last screen a user touches. A good fit for work that currently runs on spreadsheets or paper and needs a clear flow with a history behind it.',
    },
    deliverables: [
      { id: 'Skema database beserta migrasinya', en: 'Database schema with its migrations' },
      { id: 'Halaman CRUD untuk setiap data yang dikelola', en: 'CRUD screens for every managed record' },
      { id: 'Otentikasi beserta peran pengguna', en: 'Authentication with user roles' },
      { id: 'Catatan cara menjalankan dan men-deploy', en: 'Notes on running and deploying it' },
    ],
  },
  {
    id: 'api-backend',
    icon: 'Cloud',
    title: {
      id: 'REST API & integrasi layanan',
      en: 'REST APIs & service integration',
    },
    description: {
      id: 'API yang dipakai bersama oleh aplikasi web, aplikasi mobile, atau sistem lain — dengan validasi masukan, otentikasi, dan struktur yang bisa dibaca ulang, sehingga penambahan endpoint berikutnya tidak merusak yang sudah berjalan.',
      en: 'An API shared by a web app, a mobile app, or another system — with input validation, authentication, and a structure that stays readable, so adding the next endpoint does not break the ones already running.',
    },
    deliverables: [
      { id: 'Endpoint yang terdokumentasi beserta contoh permintaannya', en: 'Documented endpoints with sample requests' },
      { id: 'Validasi masukan sebelum menyentuh database', en: 'Input validation before anything touches the database' },
      { id: 'Otentikasi token atau sesi', en: 'Token or session authentication' },
      { id: 'Data awal untuk pengujian', en: 'Seed data for testing' },
    ],
  },
  {
    id: 'iot-realtime',
    icon: 'Cpu',
    title: {
      id: 'Perangkat & data realtime',
      en: 'Devices & realtime data',
    },
    description: {
      id: 'Menyambungkan perangkat lapangan ke aplikasi web lewat MQTT, lalu mengalirkan datanya ke layar tanpa perlu muat ulang halaman. Termasuk mengamankan payload supaya data dari perangkat tidak bisa dipalsukan oleh pihak yang memegang kredensial koneksi.',
      en: 'Connecting field devices to a web application over MQTT, then streaming their data to the screen without a page reload. Includes hardening the payload so device data cannot be forged by anyone holding the connection credentials.',
    },
    deliverables: [
      { id: 'Pemrosesan pesan MQTT beserta verifikasi tanda tangan', en: 'MQTT message processing with signature verification' },
      { id: 'Penyiaran data realtime ke antarmuka', en: 'Realtime broadcast into the interface' },
      { id: 'Proses latar belakang yang dijaga Supervisor', en: 'Background processes kept alive by Supervisor' },
      { id: 'Firmware perangkat bila memang diperlukan', en: 'Device firmware when it is actually needed' },
    ],
  },
  {
    id: 'dashboard',
    icon: 'BarChart3',
    title: {
      id: 'Dashboard & laporan yang bisa diunduh',
      en: 'Dashboards & downloadable reports',
    },
    description: {
      id: 'Mengubah data yang menumpuk di database menjadi ringkasan yang bisa dibaca sekilas, tabel yang bisa disaring per rentang tanggal, dan laporan PDF yang siap dicetak atau dikirim ke pemilik usaha.',
      en: 'Turning data piling up in the database into a summary you can read at a glance, tables you can filter by date range, and PDF reports ready to print or send to the business owner.',
    },
    deliverables: [
      { id: 'Ringkasan angka dan grafik tren', en: 'Headline figures and trend charts' },
      { id: 'Tabel dengan penyaring rentang tanggal', en: 'Tables with date-range filters' },
      { id: 'Ekspor PDF dengan tata letak kolom yang rapi', en: 'PDF export in a tidy column layout' },
      { id: 'Rekap per periode yang bisa diunduh', en: 'Per-period summaries you can download' },
    ],
  },
  {
    id: 'payment',
    icon: 'CreditCard',
    title: {
      id: 'Integrasi pembayaran & webhook',
      en: 'Payment & webhook integration',
    },
    description: {
      id: 'Menyambungkan Midtrans atau Xendit ke alur transaksi, menangani callback pembayaran, dan mencocokkan setiap notifikasi dengan transaksinya — supaya tidak ada pesanan yang statusnya menggantung karena pembayaran tidak pernah dikonfirmasi.',
      en: 'Wiring Midtrans or Xendit into your transaction flow, handling payment callbacks, and matching every notification to its transaction — so no order hangs because a payment was never confirmed.',
    },
    deliverables: [
      { id: 'Pembuatan transaksi dan halaman pembayaran', en: 'Transaction creation and the payment page' },
      { id: 'Penanganan webhook beserta verifikasi tanda tangannya', en: 'Webhook handling with signature verification' },
      { id: 'Penyelarasan status pesanan dengan status pembayaran', en: 'Order status aligned with payment status' },
      { id: 'Penanganan pembayaran gagal dan kedaluwarsa', en: 'Handling for failed and expired payments' },
    ],
  },
  {
    id: 'database',
    icon: 'Database',
    title: {
      id: 'Perancangan & perbaikan database',
      en: 'Database design & repair',
    },
    description: {
      id: 'Merancang tabel, relasi, dan indeks untuk PostgreSQL atau MySQL, lalu mengelolanya sebagai migrasi berversi supaya perubahan struktur bisa diterapkan berurutan di komputer lokal maupun di server — tanpa ada lingkungan yang tertinggal.',
      en: 'Designing tables, relations, and indexes for PostgreSQL or MySQL, then managing them as versioned migrations so structural changes apply in order on a laptop and on a server — with no environment left behind.',
    },
    deliverables: [
      { id: 'Skema tabel beserta relasinya', en: 'Table schema with its relations' },
      { id: 'Migrasi berversi yang aman dijalankan ulang', en: 'Versioned migrations that are safe to rerun' },
      { id: 'Indeks untuk query yang lambat', en: 'Indexes for slow queries' },
      { id: 'Data contoh untuk pengujian', en: 'Sample data for testing' },
    ],
  },
  {
    id: 'maintenance',
    icon: 'Wrench',
    title: {
      id: 'Perawatan & perbaikan aplikasi',
      en: 'Maintenance & application repair',
    },
    description: {
      id: 'Meneruskan aplikasi yang sudah berjalan: memperbaiki bug, membereskan alur yang membingungkan, memperbarui dependensi, dan menambah fitur — tanpa membongkar ulang bagian yang sebenarnya sudah bekerja dengan baik.',
      en: 'Taking over a running application: fixing bugs, cleaning up confusing flows, updating dependencies, and adding features — without tearing apart the parts that already work fine.',
    },
    deliverables: [
      { id: 'Pemeriksaan kode beserta daftar temuan', en: 'A code review with a list of findings' },
      { id: 'Perbaikan bug beserta penyebabnya', en: 'Bug fixes together with their root cause' },
      { id: 'Pengamanan dasar: validasi, header, pembatasan akses', en: 'Basic hardening: validation, headers, access limits' },
      { id: 'Catatan perubahan dan cara menjalankannya', en: 'A changelog and instructions for running it' },
    ],
  },
];
