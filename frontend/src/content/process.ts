import type { Step } from './types';

export const PROCESS: Step[] = [
  {
    n: '01',
    title: { id: 'Diskusi kebutuhan', en: 'Requirements discussion' },
    detail: {
      id: 'Kita mulai dari percakapan, bukan dari daftar fitur. Saya perlu tahu siapa yang akan memakai aplikasinya, pekerjaan apa yang sekarang dilakukan manual, dan bagian mana yang paling sering menimbulkan kesalahan. Dari situ saya bisa menyarankan bentuk paling sederhana yang tetap mencapai tujuan — kadang jawabannya bukan aplikasi baru, melainkan perbaikan pada alur yang sudah berjalan.',
      en: 'We start with a conversation, not a feature list. I need to know who will use the application, which work is done by hand today, and where mistakes happen most often. From there I can suggest the simplest shape that still reaches the goal — sometimes the answer is not a new application but a fix to a flow you already have.',
    },
  },
  {
    n: '02',
    title: { id: 'Lingkup & estimasi', en: 'Scope & estimate' },
    detail: {
      id: 'Hasil diskusi saya rangkum menjadi daftar pekerjaan yang konkret: halaman apa saja yang dibuat, data apa yang disimpan, siapa yang boleh mengakses apa, dan laporan apa yang harus bisa diunduh. Bersamaan dengan itu saya berikan estimasi waktu beserta urutan pengerjaannya, sehingga jelas bagian mana yang selesai lebih dulu dan apa yang bisa ditunda ke tahap berikutnya.',
      en: 'I turn the discussion into a concrete list of work: which screens exist, what data is stored, who may access what, and which reports must be downloadable. Alongside it I give a time estimate with the build order, so it is clear which part finishes first and what can move to a later stage.',
    },
  },
  {
    n: '03',
    title: { id: 'Pengembangan dengan kabar rutin', en: 'Development with regular updates' },
    detail: {
      id: 'Pengerjaan berjalan bertahap, dan setiap tahap bisa Anda lihat sebelum lanjut ke tahap berikutnya. Anda menerima kabar berkala berisi apa yang sudah selesai, apa yang sedang dikerjakan, dan kendala bila ada — bukan pesan "sedang dikerjakan" tanpa keterangan. Perubahan permintaan di tengah jalan boleh, asal dibicarakan lebih dulu supaya dampaknya ke waktu dan biaya bisa saya sampaikan apa adanya.',
      en: 'Work proceeds in stages, and you can see each stage before the next one begins. You get regular updates covering what is done, what is in progress, and any blockers — not a vague "still working on it". Changes mid-project are fine as long as we discuss them first, so I can tell you plainly how they affect time and cost.',
    },
  },
  {
    n: '04',
    title: { id: 'Rilis & serah terima kode', en: 'Release & code handover' },
    detail: {
      id: 'Setelah aplikasi berjalan di server Anda, saya serahkan seluruh kode sumber beserta berkas konfigurasinya, skema database, dan catatan cara menjalankan serta memperbaruinya. Bagian-bagian penting saya jelaskan langsung kepada Anda atau tim yang akan melanjutkannya, supaya tidak ada bagian yang hanya saya yang tahu.',
      en: 'Once the application runs on your server, I hand over the full source code with its configuration files, the database schema, and notes on running and updating it. I walk you or whoever continues the work through the important parts, so nothing stays knowledge that only I hold.',
    },
  },
  {
    n: '05',
    title: { id: 'Garansi bug', en: 'Bug warranty' },
    detail: {
      id: 'Setelah serah terima berlaku masa garansi untuk bug: kesalahan pada kode yang saya tulis saya perbaiki tanpa biaya tambahan. Yang tidak termasuk adalah permintaan fitur baru, perubahan alur, dan hal-hal di luar kode seperti konfigurasi server atau layanan pihak ketiga yang berubah kebijakan. Lama masa garansi kita sepakati di awal, dan setelahnya perawatan bisa dilanjutkan sebagai kesepakatan terpisah.',
      en: 'After handover a warranty window applies to bugs: mistakes in code I wrote are fixed at no extra cost. Not covered are new feature requests, flow changes, and anything outside the code such as server configuration or third-party services changing their policies. We agree the window up front, and afterwards maintenance can continue as a separate arrangement.',
    },
  },
];
