import type { Faq } from './types';

export const FAQ: Faq[] = [
  {
    q: {
      id: 'Berapa lama pengerjaan satu aplikasi?',
      en: 'How long does one application take to build?',
    },
    a: {
      id: 'Estimasi saya berikan setelah lingkupnya jelas, bukan sebelum — menebak lama pengerjaan sebelum tahu jumlah halaman dan alurnya hampir selalu meleset. Yang paling menentukan adalah jumlah alur yang harus ditangani, jumlah peran pengguna, dan apakah ada integrasi pihak ketiga seperti pembayaran atau perangkat. Sebagai gambaran dari proyek yang sudah jadi: POS Toko Hakim mencakup 18 tabel PostgreSQL, 12 modul rute backend, dan alur offline dengan antrean sinkronisasi; AF GPS Tracker mencakup 23 migrasi database, 13 berkas uji, ingest perangkat, tiga jenis geofence, dan konfigurasi deploy tersendiri. Setelah lingkup disepakati, Anda menerima jadwal bertahap sehingga tahu bagian mana yang selesai lebih dulu dan bisa mulai dicoba sambil sisanya dikerjakan.',
      en: 'I give an estimate once the scope is clear, not before — guessing a timeline before knowing the number of screens and flows is almost always wrong. What matters most is how many flows must be handled, how many user roles exist, and whether there are third-party integrations such as payments or devices. For reference, from finished work: POS Toko Hakim covers 18 PostgreSQL tables, 12 backend route modules, and an offline flow with a sync queue; AF GPS Tracker covers 23 database migrations, 13 test files, device ingest, three geofence types, and its own deploy configuration. Once the scope is agreed you get a staged schedule, so you know which part finishes first and can start trying it while the rest is built.',
    },
  },
  {
    q: {
      id: 'Bagaimana kalau saya ingin revisi di tengah pengerjaan?',
      en: 'What if I want revisions while the work is in progress?',
    },
    a: {
      id: 'Revisi kecil seperti penyesuaian teks, urutan kolom, atau warna tombol bisa langsung dikerjakan dan tidak mengubah jadwal. Untuk perubahan yang lebih besar — menambah halaman, mengubah alur, atau menambah peran pengguna — saya sampaikan lebih dulu dampaknya ke waktu pengerjaan, lalu Anda yang memutuskan mau dikerjakan sekarang atau ditunda ke tahap berikutnya. Yang saya hindari adalah mengubah arah tanpa perhitungan, karena itu membuat proyek tidak pernah selesai dan biayanya jadi tidak terkendali.',
      en: 'Small revisions such as wording, column order, or button colour are done straight away and do not move the schedule. For larger changes — adding screens, altering a flow, or adding a user role — I tell you the effect on the timeline first, and you decide whether to do it now or move it to a later stage. What I avoid is changing direction without accounting for it, because that is how projects never finish and costs spiral.',
    },
  },
  {
    q: {
      id: 'Apakah kode sumbernya jadi milik saya?',
      en: 'Do I own the source code?',
    },
    a: {
      id: 'Ya. Setelah pelunasan, seluruh kode sumber yang saya tulis untuk proyek Anda menjadi milik Anda — termasuk skema database, berkas konfigurasi, dan catatan cara menjalankannya. Anda bebas melanjutkan pengembangan dengan pengembang lain, dan saya menjelaskan bagian-bagian penting sebelum serah terima supaya transisinya tidak menyulitkan. Saya hanya meminta izin menampilkan hasilnya sebagai portofolio; kalau proyeknya bersifat internal atau rahasia, cukup beri tahu saya dan tidak akan saya tampilkan.',
      en: 'Yes. After final payment, all source code I wrote for your project belongs to you — including the database schema, configuration files, and notes on how to run it. You are free to continue development with another developer, and I walk through the important parts before handover so the transition is not painful. I only ask permission to show the result in my portfolio; if the project is internal or confidential, just tell me and I will not display it.',
    },
  },
  {
    q: {
      id: 'Teknologi apa yang Anda pakai, dan bisakah saya menentukan sendiri?',
      en: 'Which technologies do you use, and can I choose my own?',
    },
    a: {
      id: 'Untuk backend saya memakai Laravel atau Node dengan Express, dengan PostgreSQL maupun MySQL, dan untuk frontend React dengan Tailwind — kombinasi itu sudah terbukti di proyek-proyek yang ada di halaman ini. Saya juga pernah membangun aplikasi kasir grosir sebagai PWA yang tetap melayani penjualan saat internet mati, serta integrasi perangkat lewat MQTT dengan verifikasi tanda tangan. Kalau hosting atau tim Anda sudah memakai teknologi tertentu, sebutkan di awal: saya akan bilang terus terang apakah saya bisa mengerjakannya dengan standar yang sama, atau menyarankan alternatif yang lebih aman daripada memaksakan diri.',
      en: 'For backends I work with Laravel or Node with Express, on PostgreSQL or MySQL, and for frontends React with Tailwind — a combination already proven in the projects on this page. I have also built a grocery point-of-sale as a PWA that keeps serving sales when the internet drops, and device integration over MQTT with signature verification. If your hosting or team already standardises on something, mention it up front: I will say plainly whether I can build to the same standard or suggest a safer alternative rather than forcing it.',
    },
  },
  {
    q: {
      id: 'Apakah ada perawatan setelah aplikasi selesai?',
      en: 'Is there maintenance after the application is finished?',
    },
    a: {
      id: 'Ada. Setelah serah terima berlaku masa garansi untuk bug: kesalahan pada kode yang saya tulis saya perbaiki tanpa biaya tambahan. Setelah masa itu, perawatan bisa dilanjutkan sebagai kesepakatan terpisah yang mencakup perbaikan masalah, penyesuaian kecil, pembaruan dependensi, dan pemantauan proses latar belakang seperti queue worker dan subscriber MQTT. Pada saat serah terima saya juga menyertakan catatan teknis, jadi kalau Anda memutuskan merawatnya sendiri atau dengan orang lain, semuanya sudah terdokumentasi dan tidak bergantung pada saya.',
      en: 'Yes. After handover a warranty window applies to bugs: mistakes in code I wrote are fixed at no extra cost. Beyond that window, maintenance continues as a separate arrangement covering issue fixes, small adjustments, dependency updates, and monitoring of background processes such as queue workers and MQTT subscribers. At handover I also include technical notes, so if you decide to maintain it yourself or with someone else, everything is documented and does not depend on me.',
    },
  },
  {
    q: {
      id: 'Bagaimana cara memulai?',
      en: 'How do we start?',
    },
    a: {
      id: 'Kirim pesan lewat formulir di halaman ini atau email ke alamat yang tertera, dan ceritakan singkat: aplikasi seperti apa yang Anda butuhkan, siapa yang akan memakainya, dan kapan targetnya. Kalau ada contoh aplikasi lain yang menurut Anda mendekati, sebutkan juga — itu sangat membantu saya menebak bentuk yang Anda inginkan. Dari situ saya balas dengan beberapa pertanyaan lanjutan, lalu mengirimkan ringkasan lingkup beserta estimasi waktu. Tahap diskusi ini tidak berbiaya, dan tidak ada kewajiban lanjut kalau ternyata belum cocok.',
      en: 'Send a message through the form on this page or email the address listed, and briefly describe: what kind of application you need, who will use it, and when you need it. If an existing application comes close to what you have in mind, mention it too — that helps me picture the shape you want. From there I reply with a few follow-up questions, then send a scope summary with a time estimate. This stage costs nothing, and there is no obligation to continue if it turns out not to be a fit.',
    },
  },
];
