import type { Profile } from './types';

export const PROFILE: Profile = {
  name: 'Aldi Pradana Hakim',
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
      id: 'Saya menyelesaikan studi Teknik Informatika dan mengerjakan aplikasi web dari sisi belakang sampai sisi depan. Pekerjaan yang paling sering saya ambil bukan halaman statis, tapi sistem yang punya alur: data masuk, ada proses di belakang, ada riwayat yang bisa ditelusuri, dan ada laporan yang bisa diunduh. Jadi saya terbiasa menulis sendiri bagian yang biasanya dipegang orang berbeda — skema database, API, otentikasi, sampai antarmuka.',
      en: 'I completed my Informatics Engineering degree and build web applications from the back end through to the front end. The work I take on most often is not static pages but systems with a flow: data comes in, something processes it in the background, there is a history that stays traceable, and there is a report that can be downloaded. So I write the parts usually split across people myself — the database schema, the API, the authentication, and the interface.',
    },
    {
      id: 'Proyek terbesar saya, AF GPS Tracker, adalah sistem pelacakan kendaraan GPS untuk tugas akhir: perangkat lapangan mengirim lokasi lewat MQTT, server memverifikasi tanda tangan HMAC tiap perangkat sebelum datanya dipercaya, lalu lokasinya dievaluasi terhadap geofence radius, wilayah administratif, dan polygon. Dari situ muncul riwayat perjalanan, deteksi berhenti, peringatan kecepatan, dan ekspor PDF. Saya mengerjakan firmware, ingest, backend, sampai antarmuka petanya.',
      en: 'My largest project, AF GPS Tracker, is a GPS vehicle tracking system built for my final thesis: field devices publish their location over MQTT, the server verifies each device’s HMAC signature before trusting the payload, and the position is evaluated against radius, administrative-region, and custom-polygon geofences. From there come trip history, stop detection, overspeed alerts, and PDF exports. I built the firmware, the ingest pipeline, the back end, and the map interface.',
    },
  ],

  location: {
    id: 'Indonesia — kerja remote',
    en: 'Indonesia — working remotely',
  },

  email: 'aldi.pradan.hakim26@gmail.com',

  photo: '/images/aldi-pixar.webp',

  availability: {
    id: 'Terbuka untuk proyek freelance baru',
    en: 'Open to new freelance projects',
  },

  responseTime: {
    id: 'Pesan masuk biasanya dibalas dalam 1×24 jam kerja',
    en: 'Messages are usually answered within one business day',
  },

  socials: [
    { label: 'WhatsApp', url: 'https://wa.me/6281573384106', icon: 'whatsapp' },
    {
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/aldi-pradana-hakim-029b98422',
      icon: 'linkedin',
    },
    { label: 'GitHub', url: 'https://github.com/AldiPradanahakim', icon: 'github' },
    { label: 'Instagram', url: 'https://instagram.com/aldprdnhkm8', icon: 'instagram' },
    {
      label: 'Email',
      url: 'mailto:aldi.pradan.hakim26@gmail.com',
      icon: 'mail',
    },
  ],
};
