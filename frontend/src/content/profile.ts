import type { Profile } from './types';

export const PROFILE: Profile = {
  name: 'Aldi Pradan Hakim',
  initials: 'AP',

  role: {
    id: 'Pengembang Web Full-Stack',
    en: 'Full-Stack Web Developer',
  },

  tagline: {
    id: 'Saya membangun aplikasi web sampai selesai — dari skema database dan alur data, sampai halaman terakhir yang dipakai orang.',
    en: 'I build web applications end to end — from the database schema and the data flow, all the way to the last screen people actually use.',
  },

  bio: [
    {
      id: 'Saya menempuh studi Teknik Informatika dan mengerjakan aplikasi web dari sisi belakang sampai sisi depan. Pekerjaan yang paling sering saya ambil bentuknya bukan halaman statis, tapi sistem yang punya alur: ada data masuk, ada proses di belakang, ada riwayat yang harus bisa ditelusuri, dan ada laporan yang harus bisa diunduh. Karena itu saya terbiasa menulis sendiri bagian yang biasanya dipisah-pisah: skema database dan migrasinya, API, otentikasi, sampai antarmuka penggunanya.',
      en: 'I studied Informatics Engineering and work on web applications from the back end through to the front end. The work I take on most often is not static pages but systems with a flow: data comes in, something processes it in the background, there is a history that must stay traceable, and there is a report that must be downloadable. That habit means I write the parts that are usually split across people myself: the database schema and its migrations, the API, the authentication, and the user interface.',
    },
    {
      id: 'Proyek terbesar saya, AF GPS Tracker, adalah sistem pelacakan kendaraan GPS untuk tugas akhir. Perangkat GPS lapangan mengirim lokasi lewat MQTT, server memverifikasi tanda tangan HMAC setiap perangkat sebelum datanya dipercaya, lalu lokasinya dievaluasi terhadap geofence radius, wilayah administratif, dan polygon custom. Dari sana muncul riwayat perjalanan, deteksi berhenti, peringatan kecepatan, notifikasi realtime, dan ekspor PDF. Saya mengerjakan bagian firmware, ingest, backend, sampai antarmuka petanya.',
      en: 'My largest project, AF GPS Tracker, is a GPS vehicle tracking system built for my final thesis. Field GPS devices publish their location over MQTT, the server verifies each device\u2019s HMAC signature before trusting the payload, and the position is then evaluated against radius, administrative-region, and custom-polygon geofences. From there come trip history, stop detection, overspeed alerts, realtime notifications, and PDF exports. I built the firmware, the ingest pipeline, the back end, and the map interface.',
    },
    {
      id: 'Selain itu saya pernah mengerjakan platform marketplace sebagai bagian dari tim capstone kampus, aplikasi kasir untuk toko grosir, dan platform podcast PodCentral bersama tim tugas besar. Dari proyek-proyek itu saya belajar bahwa yang membuat aplikasi bertahan bukan fitur yang banyak, tapi alur yang jelas, penanganan error yang benar, dan kode yang bisa dibaca lagi enam bulan kemudian — termasuk oleh orang lain yang melanjutkannya.',
      en: 'Beyond that I have worked on a marketplace platform as part of a university capstone team, a grocery point-of-sale application, and the PodCentral podcast platform with a course-project team. Those projects taught me that what keeps an application alive is not the number of features but a clear flow, correct error handling, and code that can still be read six months later — including by whoever continues it.',
    },
  ],

  location: {
    id: 'Indonesia — kerja remote',
    en: 'Indonesia — working remotely',
  },

  email: 'aldi.pradan.hakim26@gmail.com',

  // ponytail: no real photo of Aldi exists in this repo; the old aldi.jpeg was an
  // AI-generated stock face, so the UI falls back to the "AP" monogram.
  photo: null,

  availability: {
    id: 'Terbuka untuk proyek freelance baru',
    en: 'Open to new freelance projects',
  },

  responseTime: {
    id: 'Pesan masuk biasanya dibalas dalam 1×24 jam kerja',
    en: 'Messages are usually answered within one business day',
  },

  socials: [
    // ponytail: add your own profile links here when you have them, e.g.
    // { label: 'GitHub', url: 'https://github.com/<username>', icon: 'github' },
    // { label: 'LinkedIn', url: 'https://www.linkedin.com/in/<username>', icon: 'linkedin' },
    // { label: 'Instagram', url: 'https://instagram.com/<username>', icon: 'instagram' },
    {
      label: 'Email',
      url: 'mailto:aldi.pradan.hakim26@gmail.com',
      icon: 'mail',
    },
  ],
};
