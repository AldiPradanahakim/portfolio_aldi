import type { Milestone } from './types';

/**
 * Perjalanan diisi peran, bukan per proyek — proyeknya sudah punya bagian sendiri di Work.
 * Sumber: CV (CV_Aldi_Pradana_Hakim_ATS_ID) dan repositori GitHub. Urutannya kronologis supaya
 * spine di layar terbaca sebagai garis waktu; bukan urutan kepentingan.
 */

export const JOURNEY: Milestone[] = [
  {
    period: 'Sep — Nov 2025',
    kind: 'work',
    title: { id: 'UI/UX Designer (Magang)', en: 'UI/UX Designer (Internship)' },
    org: { id: 'PT Anugrah Rizkie Gunung', en: 'PT Anugrah Rizkie Gunung' },
    detail: {
      id: 'Membuat wireframe, mockup, user flow, dan prototipe interaktif di Figma berdasarkan analisis kebutuhan pengguna dan design system yang berlaku, lalu berkolaborasi dengan developer dan stakeholder lintas fungsi agar implementasinya tetap sesuai prototipe yang disetujui. Di sini saya belajar keputusan desain harus bisa dijelaskan alasannya, karena yang menilainya adalah orang yang akan memakainya.',
      en: 'Produced wireframes, mockups, user flows, and interactive Figma prototypes from user-need analysis and the existing design system, then worked with developers and cross-functional stakeholders so the implementation stayed faithful to the approved prototype. This is where I learned a design decision has to be explainable, because the person judging it is the one who will use it.',
    },
  },
  {
    period: '2024',
    kind: 'project',
    title: { id: 'Front-end Developer', en: 'Front-end Developer' },
    org: { id: 'Praktikum Web — Teknik Informatika Unpas', en: 'Web Practicum — Informatics, Unpas' },
    detail: {
      id: 'Mengerjakan sisi tampilan: menyusun halaman dari komponen, menyambungkan form ke endpoint, dan menangani keadaan kosong, memuat, serta gagal. Bagian terakhir itu yang paling sering dilewatkan di tugas kuliah dan paling sering ditemui saat dipakai orang.',
      en: 'Built the view layer: pages assembled from components, forms wired to endpoints, and the empty, loading, and error states handled. That last part is the one most often skipped in coursework and most often met in real use.',
    },
  },
  {
    period: '2024',
    kind: 'project',
    title: { id: 'Back-end Developer', en: 'Back-end Developer' },
    org: { id: 'Praktikum Pemrograman — Teknik Informatika Unpas', en: 'Programming Practicum — Informatics, Unpas' },
    detail: {
      id: 'Menulis API dan aturan di sisi server: validasi masukan, otentikasi, otorisasi per peran, dan pengelolaan data lewat migrasi berversi. Tolok ukurnya bukan endpoint bisa diakses, tapi endpoint menolak hal yang seharusnya ditolak.',
      en: 'Wrote the API and the server-side rules: input validation, authentication, per-role authorisation, and data managed through versioned migrations. The measure was not that an endpoint answers, but that it refuses what it should refuse.',
    },
  },
  {
    period: '2025',
    kind: 'project',
    title: { id: 'Full-stack Developer', en: 'Full-stack Developer' },
    org: { id: 'Proyek mata kuliah, dikerjakan bertim', en: 'Course project, built in a team' },
    detail: {
      id: 'Memegang satu aplikasi dari ujung ke ujung: skema database, API, otentikasi, sampai antarmuka yang dipakai orang. Peran ini yang paling mengubah cara saya bekerja, karena keputusan di satu lapisan langsung terasa akibatnya di lapisan lain.',
      en: 'Owned one application end to end: database schema, API, authentication, and the interface people actually used. This role changed how I work the most, because a decision in one layer is felt immediately in another.',
    },
  },
  {
    period: '2025',
    kind: 'project',
    title: { id: 'Database Designer', en: 'Database Designer' },
    org: { id: 'Proyek mata kuliah — perancangan basis data', en: 'Course project — database design' },
    detail: {
      id: 'Merancang skema sebelum aplikasinya ditulis: menentukan entitas, relasi berkunci, normalisasi sampai tahap yang masih masuk akal, dan indeks pada kolom yang benar-benar dipakai untuk mencari. Menggambar skema lebih dulu jauh lebih murah daripada membongkarnya setelah data berjalan.',
      en: 'Designed the schema before the application was written: entities, keyed relations, normalisation up to the point where it still makes sense, and indexes on the columns actually used for lookup. Drawing the schema first is far cheaper than dismantling it once data is moving.',
    },
  },
  {
    period: '2025',
    kind: 'project',
    title: { id: 'Ketua Tim Project', en: 'Project Team Lead' },
    org: { id: 'Proyek capstone — semester tujuh', en: 'Capstone project — seventh semester' },
    detail: {
      id: 'Memimpin tim capstone: memecah pekerjaan jadi bagian yang bisa dikerjakan paralel, menyepakati batas antarmodul lebih dulu, dan menjaga integrasi tidak menumpuk di akhir. Pelajaran terbesarnya bukan teknis, tapi memastikan semua orang punya definisi "selesai" yang sama.',
      en: 'Led the capstone team: split the work into parts that could run in parallel, agreed module boundaries before anyone built, and kept integration from piling up at the end. The biggest lesson was not technical but about making sure everyone shared one definition of "done".',
    },
  },
  {
    period: '2026',
    kind: 'work',
    title: { id: 'Full-stack Developer (Tugas Akhir)', en: 'Full-stack Developer (Final Thesis)' },
    org: { id: 'AF GPS Tracker — tugas akhir Teknik Informatika', en: 'AF GPS Tracker — Informatics final thesis' },
    detail: {
      id: 'Membangun perangkat pelacak portabel ESP32 dan platform pemantauan web real-time dengan Laravel, PostgreSQL, dan MQTT: ingest tervalidasi tanda tangan HMAC per perangkat, geofencing batas wilayah administratif, riwayat perjalanan dengan playback, notifikasi, dan ekspor PDF. Geofencing diuji lewat 113 kasus black-box dengan hasil 100% — angka itu yang membuat klaimnya bisa dipertanggungjawabkan, bukan sekadar demo yang berhasil sekali.',
      en: 'Built a portable ESP32 tracking device and a real-time monitoring platform with Laravel, PostgreSQL, and MQTT: ingest verified by per-device HMAC signatures, administrative-boundary geofencing, trip history with playback, notifications, and PDF exports. The geofencing was validated through 113 black-box test cases at a 100% pass rate — that number is what makes the claim defensible rather than a demo that worked once.',
    },
  },
];