import type { CategoryId, L, Project } from './types';

/**
 * Isi berkas ini diambil dari repositori nyata di mesin pengembang, bukan dari
 * daftar fitur yang dibayangkan. Tidak ada angka, klien, atau tautan yang
 * dikarang: setiap klaim bisa ditelusuri ke kode masing-masing proyek.
 */

export const CATEGORIES: { id: CategoryId; label: L }[] = [
  { id: 'iot-realtime', label: { id: 'IoT & Realtime', en: 'IoT & Realtime' } },
  { id: 'pos-retail', label: { id: 'POS & Ritel', en: 'POS & Retail' } },
  { id: 'marketplace', label: { id: 'Marketplace', en: 'Marketplace' } },
  { id: 'web-app', label: { id: 'Aplikasi Web', en: 'Web Application' } },
];

export const PROJECTS: Project[] = [
  {
    slug: 'af-gps-tracker',
    name: 'AF GPS Tracker',
    category: 'iot-realtime',
    year: '2026',
    featured: true,
    status: 'shipped',
    role: {
      id: 'Perancang & pengembang tunggal — firmware perangkat, backend, dan antarmuka',
      en: 'Sole designer and developer — device firmware, backend, and interface',
    },
    tagline: {
      id: 'Platform web pelacakan kendaraan GPS realtime — peta, geofence, riwayat, dan laporan PDF — yang tersambung langsung ke perangkat lapangan lewat MQTT.',
      en: 'A realtime GPS vehicle tracking web platform — map, geofences, history, and PDF reports — wired straight to field devices over MQTT.',
    },
    summary: {
      id: 'AF GPS Tracker adalah platform web pelacakan kendaraan GPS: peta Leaflet realtime, geofence radius/wilayah administratif/polygon, riwayat perjalanan yang bisa diputar ulang, notifikasi, dashboard admin, dan ekspor PDF — semuanya dipakai dari peramban. Di bawahnya ada sisi perangkat yang sungguhan: firmware ESP mempublikasikan lokasi lewat MQTT dan setiap payload diverifikasi dengan tanda tangan HMAC-SHA256 milik perangkat sebelum dipercaya. Dibangun dengan Laravel 13, PHP 8.3, dan PostgreSQL 14 sebagai tugas akhir.',
      en: 'AF GPS Tracker is a GPS vehicle tracking web platform: a realtime Leaflet map, radius/administrative-region/polygon geofences, trip history that can be replayed, notifications, an admin dashboard, and PDF exports — all used from the browser. Underneath sits a real device layer: ESP firmware publishes locations over MQTT, and every payload is verified against the device\u2019s own HMAC-SHA256 signature before it is trusted. Built with Laravel 13, PHP 8.3, and PostgreSQL 14 as a final thesis project.',
    },
    problem: {
      id: 'Pelacakan armada biasanya berhenti di titik biru di peta. Pemilik kendaraan tidak tahu apakah posisi itu benar-benar berasal dari perangkatnya, tidak punya cara memeriksa rute kemarin, dan tidak diberi tahu ketika kendaraan meninggalkan area yang seharusnya. Masalah kedua jarang dibahas: broker MQTT memverifikasi kredensial koneksi, bukan isi pesannya — siapa pun yang memegang kredensial broker bisa mengirim koordinat palsu memakai device_id milik orang lain dan mencemari seluruh riwayat.',
      en: 'Fleet tracking usually stops at a blue dot on a map. Owners cannot tell whether that position really came from their own device, have no way to inspect yesterday\u2019s route, and are never told when a vehicle leaves an area it should not. The second problem is rarely discussed: an MQTT broker authenticates the connection, not the message — anyone holding broker credentials can publish fake coordinates under someone else\u2019s device_id and poison the whole history.',
    },
    solution: {
      id: 'Setiap perangkat punya rahasia sendiri (mqtt_secret) dan menandatangani payload-nya dengan HMAC-SHA256 atas string kanonik delapan field yang urutannya identik di firmware dan di server. Server menghitung ulang tanda tangan itu dan menolak payload yang tidak cocok, sehingga device_id tidak bisa dipalsukan hanya dengan kredensial broker. Di sisi aplikasi, posisi dievaluasi terhadap tiga jenis geofence sekaligus — radius, wilayah administratif, dan polygon custom — dengan status tersimpan per area, jadi keluar dari dua area menghasilkan dua notifikasi terpisah. Semua kejadian menjadi riwayat yang bisa diputar ulang di peta dan diekspor ke PDF.',
      en: 'Each device carries its own secret (mqtt_secret) and signs its payload with HMAC-SHA256 over a canonical string of eight fields whose order is identical in the firmware and on the server. The server recomputes that signature and rejects any mismatch, so device_id cannot be forged with broker credentials alone. In the application, a position is evaluated against three kinds of geofence at once — radius, administrative region, and custom polygon — with state stored per area, so leaving two areas produces two separate notifications. Every event becomes a history that can be replayed on the map and exported to PDF.',
    },
    features: [
      {
        title: { id: 'Peta realtime dengan Leaflet & OpenStreetMap', en: 'Realtime map with Leaflet & OpenStreetMap' },
        detail: {
          id: 'Posisi terbaru, jejak perjalanan, dan penanda kendaraan digambar di atas Leaflet. Setiap payload yang bukan duplikat langsung disiarkan lewat Pusher dan diterima antarmuka melalui Laravel Echo tanpa perlu memuat ulang halaman. Inilah sisi web-nya: satu antarmuka di peramban yang menyatukan peta, panel kendaraan, geofence, riwayat, dan laporan — dipakai tanpa memasang apa pun.',
          en: 'The latest position, the travel trail, and vehicle markers are drawn on Leaflet. Every non-duplicate payload is broadcast through Pusher and received by the interface over Laravel Echo without a page reload. This is the web side of the system: one browser interface that brings together the map, the vehicle panel, geofences, history, and reports — with nothing to install.',
        },
      },
      {
        title: { id: 'Geofence radius, administratif, dan polygon', en: 'Radius, administrative, and polygon geofences' },
        detail: {
          id: 'Radius bisa dipusatkan dari lokasi rumah, posisi terakhir perangkat, atau titik manual. Geofence administratif mengikuti batas provinsi, kabupaten, kecamatan, dan kelurahan. Polygon custom digambar sendiri. Tiap geofence menyimpan statusnya sendiri, sehingga kejadian masuk dan keluar tercatat per area dan tersimpan sebagai riwayat tersendiri.',
          en: 'A radius can be centred on the home location, the device\u2019s last position, or a manual point. Administrative geofences follow province, regency, district, and village boundaries. Custom polygons are drawn by hand. Each geofence keeps its own state, so enter and exit events are recorded per area and stored as their own history.',
        },
      },
      {
        title: { id: 'Tujuh jenis notifikasi dengan tautan pelacakan', en: 'Seven notification types with a tracking link' },
        detail: {
          id: 'Keluar dan masuk geofence, berhenti, kecepatan berlebih, baterai lemah, perangkat offline, dan perangkat kembali online. Notifikasi dikirim lewat email dan WhatsApp, masing-masing berisi tautan bertanda tangan ke posisi terkait supaya peta yang terbuka selalu cocok dengan isi pesannya.',
          en: 'Geofence exit and enter, stop, overspeed, low battery, device offline, and device back online. Notifications go out over email and WhatsApp, each carrying a signed link to the relevant position, so the map that opens always matches the message it came from.',
        },
      },
      {
        title: { id: 'Deteksi berhenti & kecepatan berlebih yang bisa diatur', en: 'Configurable stop & overspeed detection' },
        detail: {
          id: 'Ambang durasi berhenti dan batas kecepatan diatur per kendaraan. Riwayat berhenti tetap dicatat pada setiap payload; pengaturannya hanya menentukan kapan notifikasi dikirim, supaya laporan tidak pernah kehilangan data karena sebuah peringatan dimatikan.',
          en: 'The stop-duration threshold and speed limit are configured per vehicle. Stop history is recorded on every payload; the setting only decides when a notification is sent, so reports never lose data because an alert was muted.',
        },
      },
      {
        title: { id: 'Riwayat perjalanan, playback rute, dan ekspor PDF', en: 'Trip history, route playback, and PDF export' },
        detail: {
          id: 'Perjalanan dipisah otomatis dan bisa diputar ulang di peta. Riwayat perjalanan maupun riwayat berhenti bisa diunduh sebagai PDF (dompdf), dengan batas jumlah baris yang dihitung dari memory_limit server sehingga ekspor yang terlalu besar gagal dengan pesan jelas, bukan mati diam-diam.',
          en: 'Trips are segmented automatically and can be replayed on the map. Both travel and stop history download as PDF (dompdf), with a row cap derived from the server\u2019s memory_limit, so an oversized export fails with a clear message instead of dying silently.',
        },
      },
      {
        title: { id: 'Aktivasi perangkat per akun & dashboard admin', en: 'Per-account device activation & admin dashboard' },
        detail: {
          id: 'Akun dibuat lewat alur aktivasi perangkat memakai device ID dan kata sandi perangkat, dengan pembatasan lima percobaan per menit. Admin punya dashboard tersendiri untuk mengelola pengguna dan perangkat, termasuk mengunduh daftar perangkat sebagai PDF.',
          en: 'Accounts are created through a device activation flow using the device ID and device password, rate-limited to five attempts per minute. Admins get a separate dashboard for managing users and devices, including a PDF export of the device list.',
        },
      },
      {
        title: { id: 'Ingest GPS lewat MQTT', en: 'GPS ingest over MQTT' },
        detail: {
          id: 'Sisi perangkat dimulai di sini: perangkat mempublikasikan lokasinya ke topik gps/+/location melalui broker MQTT memakai php-mqtt/client, dengan QoS 1, auto-reconnect (10 percobaan, jeda 3 detik), dan dukungan TLS. Subscriber berjalan sebagai proses tersendiri sehingga ingest tidak bergantung pada siklus request web, dan data yang masuk langsung menjadi bagian dari antarmuka di atasnya.',
          en: 'The device side starts here: devices publish their location to the gps/+/location topic through an MQTT broker using php-mqtt/client, at QoS 1 with auto-reconnect (10 attempts, 3-second delay) and TLS support. The subscriber runs as its own process, so ingest never depends on the web request cycle, and whatever arrives flows straight into the interface above it.',
        },
      },
      {
        title: { id: 'Tanda tangan payload HMAC-SHA256 per perangkat', en: 'Per-device HMAC-SHA256 payload signing' },
        detail: {
          id: 'MQTTSignatureService menyusun string kanonik dari message_id, lat, lng, speed, heading, battery, satellite, dan received_at, lalu membandingkannya dengan hash_equals. Perangkat yang punya kredensial broker tetap tidak bisa mengirim data atas nama perangkat lain, dan rahasia tiap perangkat bisa diperiksa lewat perintah artisan.',
          en: 'MQTTSignatureService builds a canonical string from message_id, lat, lng, speed, heading, battery, satellite, and received_at, then compares it using hash_equals. A device holding broker credentials still cannot publish on behalf of another device, and each device\u2019s secret can be inspected through an artisan command.',
        },
      },
      {
        title: { id: 'Firmware ESP untuk perangkat lapangan', en: 'ESP firmware for the field device' },
        detail: {
          id: 'Firmware Arduino/ESP (afgps_prod) membaca modul GPS, menyusun payload, menghitung tanda tangan yang sama dengan yang diharapkan server, lalu mempublikasikannya ke broker. Versi lokal disediakan untuk pengujian tanpa perangkat fisik.',
          en: 'The Arduino/ESP firmware (afgps_prod) reads the GPS module, assembles the payload, computes the same signature the server expects, and publishes it to the broker. A local build is included for testing without physical hardware.',
        },
      },
      {
        title: { id: 'Konfigurasi deploy untuk server produksi', en: 'Production deploy configuration' },
        detail: {
          id: 'Queue worker dan MQTT subscriber dijaga Supervisor, penjadwal dijalankan lewat cron, dan alur deploy memuat langkah queue:restart serta cache konfigurasi. Panduannya dipisah antara pengembangan dan produksi karena keduanya memang berbeda.',
          en: 'The queue worker and MQTT subscriber are kept alive by Supervisor, the scheduler runs from cron, and the deploy flow includes queue:restart and config caching. The guide is split between development and production because the two genuinely differ.',
        },
      },
    ],
    metrics: [
      { value: '3', label: { id: 'jenis geofence', en: 'geofence types' } },
      { value: '7', label: { id: 'jenis notifikasi', en: 'notification types' } },
      { value: '23', label: { id: 'migrasi database', en: 'database migrations' } },
      { value: '13', label: { id: 'berkas uji PHPUnit', en: 'PHPUnit test files' } },
    ],
    stack: [
      'Laravel 13',
      'PHP 8.3',
      'PostgreSQL 14',
      'MQTT (php-mqtt/client)',
      'Blade',
      'Tailwind CSS',
      'Alpine.js',
      'Vite',
      'Leaflet',
      'Pusher + Laravel Echo',
      'dompdf',
      'PHPUnit',
      'Supervisor',
      'ESP / Arduino',
    ],
    cover: '/images/projects/af-gps-tracker.webp',
    gallery: [
      '/images/projects/af-gps-tracker.webp',
      '/images/projects/af-gps-tracker-02.svg',
      '/images/projects/af-gps-tracker-03.svg',
    ],
    links: {},
  },

  {
    slug: 'kasir-pos',
    name: 'POS Toko Hakim',
    category: 'pos-retail',
    year: '2026',
    featured: true,
    status: 'shipped',
    role: {
      id: 'Pengembang tunggal — skema database, backend, dan antarmuka',
      en: 'Sole developer — database schema, backend, and interface',
    },
    tagline: {
      id: 'Aplikasi kasir grosir sembako: transaksi, stok, dan laporan — tetap jalan saat internet mati.',
      en: 'A grocery point-of-sale: transactions, stock, and reports — still working when the internet drops.',
    },
    summary: {
      id: 'POS Toko Hakim adalah aplikasi kasir untuk toko grosir sembako: rokok, minuman, dan sembako. Kasir mencari atau memindai barcode produk, memilih satuannya, memasukkan uang tunai, lalu mencetak struk; stok berkurang otomatis dan transaksi yang sudah tercetak bersifat final. Aplikasi ini juga tetap jalan saat internet mati — transaksi disimpan lebih dulu di perangkat lewat IndexedDB, lalu dikirim ke server otomatis begitu koneksi kembali tanpa menghasilkan transaksi ganda, dan seluruhnya bisa dipasang sebagai PWA. Spesifikasi awal mengunci Laravel 11 dengan Sanctum, tetapi atas permintaan pemilik proyek diganti menjadi Express 5 dengan PostgreSQL dan React 18 + TypeScript.',
      en: 'POS Toko Hakim is a point-of-sale for a mixed grocery wholesaler: cigarettes, drinks, and staples. The cashier searches or scans a product barcode, picks the unit, enters the cash tendered, and prints the receipt; stock decrements automatically and a printed sale is final. It also keeps working when the internet drops — a sale is written to the device through IndexedDB first, then sent to the server automatically once the connection returns without producing duplicates, and the whole thing installs as a PWA. The original specification locked in Laravel 11 with Sanctum, but at the project owner\u2019s request it was replaced with Express 5 on PostgreSQL and React 18 + TypeScript.',
    },
    problem: {
      id: 'Toko grosir yang masih mencatat penjualan dengan tangan menghadapi beberapa masalah sekaligus: stok di buku tidak pernah cocok dengan barang di rak, harga yang berubah sulit ditelusuri kembali, dan laporan harian harus dihitung ulang setiap malam. Masalah berikutnya muncul begitu kasir memakai tablet: internet toko putus, dan transaksi yang sedang dilayani ikut hilang bersama koneksinya.',
      en: 'A wholesale shop still recording sales by hand faces several problems at once: stock in the book never matches the shelf, prices that change are hard to trace back, and the daily report has to be recalculated every night. The next one appears as soon as the cashier uses a tablet: the shop internet drops, and the sale being served disappears along with the connection.',
    },
    solution: {
      id: 'Seluruh alur kasir berjalan di satu layar yang tidak menggulir, dengan pencarian produk, pemindaian barcode, satuan yang bisa dikonversi, dan kalkulator angka besar untuk menghitung kembalian di tablet. Transaksi disimpan lokal lebih dulu, lalu dikirim memakai uuid yang sama sehingga server mengenali kiriman ulang dan tidak membuat transaksi kedua. Aturan stok ditegakkan di server: penjualan yang membuat stok minus ditolak dengan pesan yang menyebut sisa dan kebutuhan stok, kecuali superadmin sudah memberi izin untuk produk itu — sedangkan barang masuk, pembelian, retur, dan opname tidak pernah diblokir. Harga dan isi satuan disalin ke baris penjualan saat transaksi dibuat, jadi mengubah harga besok tidak mengubah struk kemarin, dan kasir yang menimpa harga wajib menuliskan alasannya.',
      en: 'The whole cashier flow runs on one screen that does not scroll, with product search, barcode scanning, convertible units, and a large-button calculator for working out change on a tablet. A sale is stored locally first, then sent with the same uuid so the server recognises a resend and never creates a second transaction. Stock rules are enforced on the server: a sale that would push stock negative is rejected with a message naming the remaining and required stock, unless the superadmin has allowed it for that product — while stock-in, purchases, returns, and stocktakes are never blocked. Price and unit size are copied onto the sale line when the transaction is created, so changing a price tomorrow never rewrites yesterday\u2019s receipt, and a cashier who overrides a price must write down the reason.',
    },
    features: [
      {
        title: { id: 'Kasir dalam satu layar penuh', en: 'The cashier on one full screen' },
        detail: {
          id: 'Halaman kasir sengaja tidak menggulir sejak ukuran tablet; yang bergulir hanya daftar hasil cari dan tabel keranjang. Qty diubah langsung dari barisnya lewat tombol − dan +, sedangkan mengetuk nama barang atau angkanya membuka pop up untuk mengubah qty, menimpa harga, atau menghapus barisnya. Nama pelanggan hanya menerima huruf, dan setiap baris bernomor supaya kasir bisa menyebut "barang nomor tiga" saat memeriksa keranjang bersama pembeli.',
          en: 'The cashier page deliberately does not scroll from tablet size upward; only the search results and the cart table scroll. Quantity is changed straight from its row with − and + buttons, while tapping a product name or its figure opens a pop-up to change the quantity, override the price, or drop the line. The customer name accepts letters only, and every row is numbered so the cashier can say "item number three" while checking the cart together with the buyer.',
        },
      },
      {
        title: { id: 'Satuan bertingkat dan satuan hitung per produk', en: 'Multi-level units and a per-product counting unit' },
        detail: {
          id: 'Satu produk punya beberapa satuan dengan isi masing-masing — satu dus berisi sekian slop, satu slop berisi sekian bungkus — dan stok disimpan dalam satuan terkecil sehingga penjualan eceran maupun grosir mengurangi angka yang sama. Superadmin menentukan satuan hitung yang dipakai menampilkan stok (misalnya "dus" untuk rokok) lewat kolom tersendiri di produk, dan kalau belum dipilih server jatuh ke satuan terbesar milik produk itu. Alias nama dan barcode disimpan terpisah supaya pemindaian tetap cepat.',
          en: 'One product carries several units with their own contents — a crate holds so many packs, a pack holds so many pieces — and stock is stored in the smallest unit so both retail and wholesale sales decrement the same figure. The superadmin sets the counting unit used to display stock (a crate for cigarettes, say) through a dedicated column on the product, and when it is unset the server falls back to that product\u2019s largest unit. Name aliases and barcodes live in their own table so scanning stays fast.',
        },
      },
      {
        title: { id: 'Aturan stok minus yang bisa dibuka per produk', en: 'A negative-stock rule that can be opened per product' },
        detail: {
          id: 'Penjualan yang membuat stok minus ditolak dengan pesan yang menyebut sisa dan kebutuhan stok, dan izinnya diberikan superadmin per produk dari halaman stok. Pemeriksaannya berjalan di dalam transaksi database yang sama: baris produknya dikunci lebih dulu, baru stoknya dibaca, supaya dua kiriman yang datang bersamaan tidak sama-sama lolos dari stok yang sama. Barang yang benar-benar datang atau keluar — pembelian, stok masuk, retur, dan opname — tidak pernah diblokir.',
          en: 'A sale that would push stock negative is rejected with a message naming the remaining and required stock, and the superadmin grants the exception per product from the stock page. The check runs inside the same database transaction: product rows are locked first and stock is read after, so two deliveries arriving at once cannot both pass on the same stock. Goods that genuinely arrive or leave — purchases, stock-in, returns, and stocktakes — are never blocked.',
        },
      },
      {
        title: { id: 'Offline-first: transaksi tersimpan di perangkat lebih dulu', en: 'Offline-first: the sale is stored on the device first' },
        detail: {
          id: 'Master data produk, satuan, pengaturan, dan stok ditarik sekali ke IndexedDB lewat Dexie, sehingga pencarian produk dan barcode tetap jalan tanpa koneksi. Transaksi yang disimpan saat offline masuk ke antrean lokal dan dikirim satu per satu berurutan; yang ditolak server ditandai gagal beserta pesannya, bukan dihapus diam-diam. Sinkronisasi berjalan sendiri saat aplikasi dibuka, saat koneksi kembali, dan berkala selama aplikasi terbuka.',
          en: 'Product, unit, settings, and stock data are pulled once into IndexedDB through Dexie, so product and barcode search keep working without a connection. Sales saved while offline go into a local queue and are sent one at a time in order; anything the server rejects is flagged as failed together with its message instead of being dropped quietly. Synchronisation runs by itself when the app opens, when the connection returns, and periodically while the app is open.',
        },
      },
      {
        title: { id: 'Sinkronisasi yang tidak menghasilkan transaksi ganda', en: 'Synchronisation that never duplicates a sale' },
        detail: {
          id: 'Setiap transaksi dibuat dengan uuid di perangkat, dan server memeriksa uuid itu dua kali: sebelum memproses, lalu sekali lagi di dalam transaksi database sebelum barisnya dibuat. Kiriman ulang dari antrean karena koneksi putus di tengah jalan karena itu dijawab dengan transaksi yang sama, bukan transaksi baru. Stok yang ditampilkan di perangkat juga dikurangi lagi dengan transaksi yang masih mengantre, supaya angka di layar tidak menunggu server.',
          en: 'Every sale is created with a uuid on the device, and the server checks that uuid twice: before processing, then again inside the database transaction before the row is written. A resend from the queue after a dropped connection is therefore answered with the same sale, not a new one. The stock shown on the device is also reduced by sales still waiting in the queue, so the figure on screen does not wait for the server.',
        },
      },
      {
        title: { id: 'Bisa dipasang sebagai PWA', en: 'Installable as a PWA' },
        detail: {
          id: 'Aplikasi dibangun dengan service worker dan manifest sehingga bisa dipasang ke desktop dan dibuka di jendelanya sendiri tanpa tampilan peramban. Permintaan master data ke server memakai strategi jaringan dulu dengan batas tunggu lima detik, lalu jatuh ke salinan terakhir yang tersimpan — jadi aplikasi tetap terbuka dan tetap bisa melayani penjualan meski server tidak terjangkau.',
          en: 'The app ships a service worker and manifest, so it installs to the desktop and opens in its own window without browser chrome. Requests for master data use a network-first strategy with a five-second timeout, then fall back to the last stored copy — so the app still opens and can still serve sales even when the server is unreachable.',
        },
      },
      {
        title: { id: 'Snapshot harga dan alasan saat harga ditimpa', en: 'Price snapshots and a written reason for overrides' },
        detail: {
          id: 'Setiap baris penjualan menyimpan harga jual, harga modal, dan isi satuan yang berlaku saat transaksi dibuat, sehingga laporan laba kotor dihitung dari angka yang benar-benar dipakai hari itu. Kasir boleh menimpa harga saat melayani, tetapi server menolak transaksi yang harganya berubah tanpa alasan tertulis, dan harga yang ditimpa tercatat sebagai baris tersendiri di laporan perubahan harga.',
          en: 'Every sale line stores the selling price, the cost price, and the unit size in force when the transaction was created, so the gross-profit report is computed from the figures actually used that day. A cashier may override a price while serving, but the server rejects a transaction whose price changed without a written reason, and overridden prices are recorded as their own row in the price-change report.',
        },
      },
      {
        title: { id: 'Tunai saja, nomor struk per tahun, cetak 58 mm', en: 'Cash only, per-year receipt numbers, 58 mm printing' },
        detail: {
          id: 'Toko hanya menerima tunai, jadi aturan itu dipasang sebagai batasan di database dan pilihan pembayaran lain dihapus dari sistem, termasuk pengaturan gambar QRIS. Nomor struk diambil dari penghitung per tahun yang dinaikkan di dalam transaksi yang sama, dengan format INV-<tahun>-<6 digit> — cukup untuk ribuan transaksi setahun, dan struk lama tidak mungkin bertabrakan karena formatnya berbeda. Struk dicetak lewat peramban dengan ukuran kertas 58 mm, tanpa pustaka printer khusus.',
          en: 'The shop takes cash only, so that rule is enforced as a database constraint and the other payment options were removed from the system, including the QRIS image setting. The receipt number comes from a per-year counter incremented inside the same transaction, in the form INV-<year>-<6 digits> — enough for thousands of sales a year, and older receipts cannot collide because their format differs. Receipts print through the browser at 58 mm paper size, with no dedicated printer package.',
        },
      },
      {
        title: { id: 'Barang masuk lewat foto struk supplier', en: 'Stock-in from a photo of the supplier receipt' },
        detail: {
          id: 'Halaman stok masuk bisa membaca foto struk belanja: gambarnya diperkecil, dijadikan abu-abu, dan kontrasnya direntangkan lebih dulu supaya huruf tipis tidak hilang, lalu teksnya dibaca dengan mesin OCR berbahasa Indonesia. Hasilnya diurai menjadi baris barang — nama, qty, harga, subtotal — dengan baris total dan pembayaran diabaikan, dan setiap nama dicocokkan ke produk yang sudah ada sebagai usulan yang masih bisa dikoreksi. Pembelian dari supplier sendiri dicatat tanpa harga beli, hanya nama barang dan jumlahnya, sesuai kebiasaan pemilik toko.',
          en: 'The stock-in page can read a photo of a shopping receipt: the image is scaled down, turned greyscale, and contrast-stretched first so thin letters do not vanish, then the text is read with an Indonesian-language OCR engine. The result is parsed into item lines — name, quantity, price, subtotal — with total and payment lines ignored, and each name is matched against existing products as a suggestion that stays editable. Purchases from a supplier are themselves recorded without a purchase price, just the product name and quantity, matching how the shop owner actually works.',
        },
      },
      {
        title: { id: 'Dashboard, laporan, dan saran pembelian CSV', en: 'Dashboard, reports, and purchase suggestions as CSV' },
        detail: {
          id: 'Dashboard merangkum penjualan, stok menipis, kas, dan hutang/piutang, lalu menambahkan saran pembelian: produk yang stoknya tipis dibanding kecepatan jualnya, dihitung per satuan hitung produk itu sendiri. Saran itu bisa diunduh sebagai CSV siap dibawa ke supplier, dan laporan lain seperti arus kas serta arus stok juga tersedia dalam CSV di samping tampilan tabelnya.',
          en: 'The dashboard summarises sales, low stock, cash, and debts/receivables, then adds purchase suggestions: products whose stock is thin relative to how fast they sell, computed in each product\u2019s own counting unit. Those suggestions download as a CSV ready to take to the supplier, and other reports such as cash flow and stock flow are available as CSV alongside their table view.',
        },
      },
      {
        title: { id: 'Dua peran dengan hapus permanen khusus superadmin', en: 'Two roles, with permanent deletion for the superadmin only' },
        detail: {
          id: 'Kasir melayani penjualan, mencetak ulang struk, melihat stok, dan menambah stok masuk. Superadmin mendapat semuanya ditambah pengelolaan produk, kategori, satuan, dan pengguna, halaman laporan dan dashboard, serta pengaturan identitas toko; pembatasannya dipasang di kedua sisi, sebagai middleware di server dan penjaga rute di antarmuka. Transaksi yang sudah tersimpan bersifat final: tidak ada tombol pembatalan, dan satu-satunya koreksi adalah hapus permanen yang hanya muncul untuk superadmin, dengan pilihan apakah stoknya dikembalikan atau tidak.',
          en: 'The cashier serves sales, reprints receipts, views stock, and records stock-in. The superadmin gets all of that plus product, category, unit, and user management, the report and dashboard pages, and the shop identity settings; the restriction is enforced on both sides, as middleware on the server and a route guard in the interface. A stored sale is final: there is no cancel button, and the only correction is a permanent delete that appears for the superadmin alone, with a choice of whether stock is restored or not.',
        },
      },
    ],
    metrics: [
      { value: '18', label: { id: 'tabel PostgreSQL', en: 'PostgreSQL tables' } },
      { value: '12', label: { id: 'modul rute backend', en: 'backend route modules' } },
      { value: '6', label: { id: 'berkas migrasi', en: 'migration files' } },
      { value: '2', label: { id: 'peran pengguna', en: 'user roles' } },
    ],
    stack: [
      'Node.js 20',
      'Express 5',
      'PostgreSQL',
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Zustand',
      'Dexie (IndexedDB)',
      'vite-plugin-pwa',
    ],
    cover: '/images/projects/kasir-pos.webp',
    gallery: ['/images/projects/kasir-pos.webp'],
    links: {},
  },

  {
    slug: 'skillconnect',
    name: 'SkillConnect',
    category: 'marketplace',
    year: '2025',
    featured: false,
    status: 'shipped',
    role: {
      id: 'Perancang skema database dan pengembang backend',
      en: 'Database schema designer and backend developer',
    },
    tagline: {
      id: 'Marketplace jasa yang menghubungkan freelancer dengan klien, lengkap dengan pembayaran dan chat realtime.',
      en: 'A services marketplace connecting freelancers with clients, complete with payments and realtime chat.',
    },
    summary: {
      id: 'Platform marketplace jasa dengan delapan modul backend berarsitektur Domain-Driven Design: pengguna, layanan, pesanan, payment gateway, ulasan, chat, dashboard admin, dan rekomendasi. Antarmuka React 18 disusun dengan pola Atomic Design. Dikerjakan sebagai proyek capstone tim pada semester tujuh, mencakup alur dari pemesanan sampai pembayaran dan ulasan. Bagian saya di proyek tim ini ada dua: merancang skema database-nya — 25 tabel yang menampung akun, layanan, pesanan, escrow, ulasan, chat, dan pencairan dana — dan mengerjakan backend di atasnya; kedelapan modul itu dibagi ke seluruh anggota tim, bukan dikerjakan sendirian.',
      en: 'A services marketplace with eight backend modules built on Domain-Driven Design: users, services, orders, payment gateway, reviews, chat, admin dashboard, and recommendations. The React 18 interface follows the Atomic Design pattern. Built as a team capstone project in the seventh semester, covering the flow from booking through payment and review. My part in this team project came in two pieces: designing the database schema — 25 tables covering accounts, services, orders, escrow, reviews, chat, and payouts — and building the backend on top of it; those eight modules were split across the whole team rather than built solo.',
    },
    problem: {
      id: 'Freelancer lokal biasanya mencari klien lewat pesan pribadi dan media sosial. Tidak ada tempat menampilkan jasa secara terstruktur, tidak ada alur pemesanan yang jelas, dan tidak ada cara menahan pembayaran sampai pekerjaan selesai — sehingga risiko ditanggung satu pihak saja, padahal seharusnya bisa dibagi.',
      en: 'Local freelancers typically find clients through private messages and social media. There is nowhere to present services in a structured way, no clear booking flow, and no way to hold payment until the work is done — so the risk lands on one side alone when it could be shared.',
    },
    solution: {
      id: 'Pekerjaan dipecah menjadi delapan modul dengan batas tanggung jawab yang jelas sehingga tim dapat bekerja paralel tanpa saling menimpa. Alur pesanan mengikat klien, freelancer, layanan, jadwal, dan status pembayaran dalam satu rangkaian; payment gateway menangani transaksi, sedangkan chat realtime dan notifikasi menjaga kedua pihak tetap terhubung selama pekerjaan berjalan.',
      en: 'The work is split into eight modules with clear boundaries so the team could build in parallel without collisions. The order flow binds client, freelancer, service, schedule, and payment status into one chain; the payment gateway handles the transaction, while realtime chat and notifications keep both sides connected while the work is underway.',
    },
    features: [
      {
        title: { id: 'Skema database 25 tabel yang saya rancang', en: 'The 25-table schema I designed' },
        detail: {
          id: 'Skema inilah bagian yang saya pegang: 25 tabel untuk akun dan token, profil freelancer, kategori dan sub-kategori, layanan beserta paketnya, pesanan, metode pembayaran, pembayaran, escrow, pencairan dana, ulasan, percakapan dan pesan, notifikasi, favorit, serta rekomendasi layanan. Strukturnya dibangun lewat migrasi berversi bernomor, jadi tabelnya bisa dibangun ulang berurutan di mesin mana pun dan setiap perubahan skema tercatat sebagai berkas, bukan diedit langsung di database.',
          en: 'This schema is the part I owned: 25 tables for accounts and tokens, freelancer profiles, categories and sub-categories, services with their packages, orders, payment methods, payments, escrow, payouts, reviews, conversations and messages, notifications, favourites, and service recommendations. It is built through numbered, versioned migrations, so the tables can be rebuilt in order on any machine and every schema change is recorded as a file rather than edited straight in the database.',
        },
      },
      {
        title: { id: 'Delapan modul backend berarsitektur DDD', en: 'Eight DDD-structured backend modules' },
        detail: {
          id: 'Modul user, service, order, payment, review, chat, admin, dan recommendation memisahkan tanggung jawabnya masing-masing, sehingga perubahan di satu modul tidak merembet ke modul lain dan pengerjaan paralel antar anggota tim tetap aman.',
          en: 'The user, service, order, payment, review, chat, admin, and recommendation modules keep separate responsibilities, so a change in one does not bleed into another and parallel work between team members stays safe.',
        },
      },
      {
        title: { id: 'Otentikasi JWT dengan tiga peran', en: 'JWT authentication with three roles' },
        detail: {
          id: 'Registrasi, login, profil, dan reset kata sandi lewat email. Peran client, freelancer, dan admin membuka menu serta hak akses yang berbeda dari satu basis pengguna.',
          en: 'Registration, login, profile, and password reset over email. The client, freelancer, and admin roles unlock different menus and permissions from a single user base.',
        },
      },
      {
        title: { id: 'Pemesanan jasa dengan pelacakan status', en: 'Service booking with status tracking' },
        detail: {
          id: 'Klien memesan layanan pada jadwal tertentu, dan status pesanan bergerak dari menunggu sampai selesai. Kedua pihak melihat posisi pekerjaan yang sama, sehingga pertanyaan status tidak lagi menumpuk di pesan pribadi.',
          en: 'Clients book a service for a given schedule, and the order status moves from pending through completion. Both sides see the same state of the work, so status questions stop piling up in private messages.',
        },
      },
      {
        title: { id: 'Payment gateway Midtrans dan Xendit', en: 'Midtrans and Xendit payment gateways' },
        detail: {
          id: 'Modul pembayaran menangani pembuatan transaksi, status pembayaran, dan invoice, dengan dua penyedia yang bisa dipakai bergantian tanpa mengubah alur pesanan di atasnya.',
          en: 'The payment module handles transaction creation, payment status, and invoices, with two providers that can be swapped without touching the order flow above it.',
        },
      },
      {
        title: { id: 'Chat realtime dengan Socket.io', en: 'Realtime chat over Socket.io' },
        detail: {
          id: 'Klien dan freelancer berkomunikasi langsung di dalam aplikasi, dengan riwayat percakapan yang terikat pada pesanan sehingga konteks pekerjaan tidak hilang di antara obrolan lain.',
          en: 'Client and freelancer talk directly inside the application, with conversation history bound to the order so the context of the work is never lost among other chats.',
        },
      },
      {
        title: { id: 'Ulasan dan rating setelah pekerjaan selesai', en: 'Reviews and ratings after completion' },
        detail: {
          id: 'Ulasan hanya bisa diberikan pada pesanan yang sudah selesai, sehingga reputasi freelancer dibangun dari pekerjaan nyata, bukan dari klaim di profil.',
          en: 'A review can only be left on a completed order, so a freelancer\u2019s reputation is built from real work rather than profile claims.',
        },
      },
      {
        title: { id: 'Dashboard admin dan rekomendasi layanan', en: 'Admin dashboard and service recommendations' },
        detail: {
          id: 'Admin memantau pengguna, layanan, dan transaksi dari satu tempat. Modul rekomendasi menampilkan layanan populer beserta layanan yang relevan dengan riwayat pencarian pengguna.',
          en: 'Admins monitor users, services, and transactions from one place. The recommendation module surfaces popular services alongside ones relevant to a user\u2019s search history.',
        },
      },
      {
        title: { id: 'Antarmuka React dengan Atomic Design', en: 'React interface built on Atomic Design' },
        detail: {
          id: 'Komponen disusun berlapis dari atom sampai template, dengan React Query untuk pengambilan data dan Zustand untuk state global, sehingga komponen dasar dipakai ulang di banyak halaman.',
          en: 'Components are layered from atoms up to templates, with React Query for data fetching and Zustand for global state, so base components are reused across many pages.',
        },
      },
    ],
    metrics: [
      { value: '8', label: { id: 'modul backend', en: 'backend modules' } },
      { value: '2', label: { id: 'payment gateway', en: 'payment gateways' } },
      { value: '127', label: { id: 'komponen frontend', en: 'frontend components' } },
      { value: '3', label: { id: 'peran pengguna', en: 'user roles' } },
    ],
    stack: [
      'Node.js 20',
      'Express',
      'MySQL',
      'Sequelize',
      'JWT',
      'Socket.io',
      'Midtrans',
      'Xendit',
      'Nodemailer',
      'React 18',
      'Vite',
      'Tailwind CSS',
      'React Query',
      'Zustand',
    ],
    // ponytail: no screenshot of this one, so the card and detail page render without media.
    cover: null,
    gallery: [],
    links: {},
  },

  {
    slug: 'podcentral',
    name: 'PodCentral',
    category: 'web-app',
    year: '2025',
    featured: false,
    status: 'shipped',
    role: {
      id: 'Anggota tim tugas besar — halaman baca podcast, CRUD dashboard, serta logika login, profil, dan pemutar audio',
      en: 'Course-project team member — podcast reading pages, dashboard CRUD, and the login, profile, and audio player logic',
    },
    tagline: {
      id: 'Platform podcast berbasis Laravel: katalog per genre, koleksi dan riwayat dengar, serta dashboard admin dengan laporan PDF.',
      en: 'A Laravel podcast platform: a catalogue by genre, collections and listening history, and an admin dashboard with a PDF report.',
    },
    summary: {
      id: 'PodCentral adalah platform podcast berbasis Laravel 11 dan Blade. Pendengar mendaftar, menelusuri podcast yang dikelompokkan per genre, memutarnya lewat pemutar audio yang tetap ada saat berpindah halaman, lalu menyimpan podcast ke koleksi atau membiarkannya tercatat di riwayat dengar. Admin mengelola podcast, genre, dan pengguna dari dashboard tersendiri, dan seluruh rekapnya bisa diunduh sebagai satu laporan PDF. Dikerjakan bersama tim sebagai tugas besar, bukan sendirian.',
      en: 'PodCentral is a podcast platform built on Laravel 11 and Blade. Listeners register, browse podcasts grouped by genre, play them through an audio player that stays put while pages change, then save podcasts to a collection or let them accumulate in listening history. Admins manage podcasts, genres, and users from their own dashboard, and the whole summary downloads as a single PDF report. It was built with a team as a course assignment, not solo.',
    },
    problem: {
      id: 'Podcast tersebar di banyak layanan dan tidak punya tempat menampung koleksi pribadi yang rapi. Pendengar harus mengingat sendiri podcast mana yang terakhir diputar, sementara pemilik katalog tidak punya satu tempat untuk melihat genre mana yang isinya masih sedikit atau podcast mana yang paling banyak disimpan orang.',
      en: 'Podcasts are spread across many services with nowhere tidy to keep a personal collection. Listeners have to remember for themselves which podcast they played last, while whoever owns the catalogue has no single place to see which genres are still thin or which podcasts get saved most.',
    },
    solution: {
      id: 'Katalog disusun mengikuti genre, sehingga halaman utama cukup menampilkan kelompok podcast apa adanya, tanpa penyaring yang harus disusun ulang di setiap halaman. Koleksi dan riwayat dipisah menjadi dua jalur: koleksi adalah pilihan sadar pengguna lewat tombol hati yang bisa dibatalkan, sedangkan riwayat terisi sendiri begitu sebuah podcast diputar. Untuk admin, dashboard merangkum jumlah podcast, pengguna, dan genre, lalu menyediakan tabel yang bisa diurutkan beserta tombol unduh PDF berisi rekap yang sama.',
      en: 'The catalogue follows genres, so the home page simply shows the podcast groups as they are, with no filter that has to be rebuilt on every page. Collections and history are two separate paths: a collection is a deliberate choice through a heart button that can be undone, while history fills itself in as soon as a podcast is played. For admins, the dashboard summarises podcast, user, and genre counts, then offers sortable tables and a download button for the same summary as a PDF.',
    },
    features: [
      {
        title: { id: 'Otentikasi dengan dua peran', en: 'Authentication with two roles' },
        detail: {
          id: 'Registrasi menyimpan kata sandi dalam bentuk terenkripsi dan memberi peran pengguna secara otomatis, sedangkan login mengarahkan admin ke dashboard dan pendengar ke halaman utama. Area admin dijaga middleware tersendiri yang memeriksa perannya, bukan sekadar status sudah masuk atau belum.',
          en: 'Registration stores the password encrypted and assigns the user role automatically, while login sends admins to the dashboard and listeners to the home page. The admin area is guarded by its own middleware that checks the role, not merely whether someone is logged in.',
        },
      },
      {
        title: { id: 'Katalog podcast per genre', en: 'Podcast catalogue by genre' },
        detail: {
          id: 'Halaman utama menyusun podcast ke dalam kelompok genre, masing-masing berisi kartu dengan gambar sampul, foto dan nama penulis, potongan deskripsi, serta tanggal rilis. Halaman detail menampilkan durasi yang dibaca dalam jam dan menit, genre, deskripsi lengkap, dan tautan ke semua podcast penulis yang sama.',
          en: 'The home page arranges podcasts into genre groups, each holding cards with the cover image, the author photo and name, a description excerpt, and the release date. The detail page shows the duration read out in hours and minutes, the genre, the full description, and a link to every podcast by the same author.',
        },
      },
      {
        title: { id: 'Pemutar audio yang bertahan saat berpindah halaman', en: 'An audio player that survives page changes' },
        detail: {
          id: 'Tombol putar di kartu maupun di halaman detail membuka pemutar yang menempel di bagian bawah layar, dengan bilah kemajuan yang bisa diklik untuk melompat ke bagian tertentu, pengatur volume, dan tombol untuk membuka halaman detail podcast yang sedang diputar.',
          en: 'The play button on a card and on the detail page opens a player pinned to the bottom of the screen, with a progress bar you can click to jump, a volume control, and a button that opens the detail page of whatever is playing.',
        },
      },
      {
        title: { id: 'Koleksi yang bisa ditandai dan dibatalkan', en: 'A collection you can toggle' },
        detail: {
          id: 'Tombol hati di halaman detail menambah atau mencabut podcast dari koleksi pengguna lewat satu permintaan yang sama, dan halaman koleksi menampilkannya sebagai kisi kartu beserta genrenya. Setiap pengguna punya satu koleksi yang dibuat otomatis saat pertama kali dipakai.',
          en: 'The heart button on the detail page adds or removes a podcast from the user collection through the same request, and the collection page shows them as a grid of cards with their genres. Each user has a single collection, created automatically the first time it is used.',
        },
      },
      {
        title: { id: 'Riwayat dengar yang terisi sendiri', en: 'Listening history that fills itself in' },
        detail: {
          id: 'Riwayat bertambah begitu sebuah podcast mulai diputar, dan halamannya menampilkan yang terbaru lebih dulu lengkap dengan waktu dengar, penulis, dan gambar sampulnya. Pengguna baru yang belum memutar apa pun mendapat pesan kosong, bukan halaman yang gagal dimuat.',
          en: 'History grows as soon as a podcast starts playing, and its page lists the newest first with the time it was played, the author, and the cover image. A new user who has played nothing gets an empty-state message rather than a page that fails to load.',
        },
      },
      {
        title: { id: 'Profil dengan foto yang bisa diunggah dan dihapus', en: 'Profile with a picture that can be uploaded and deleted' },
        detail: {
          id: 'Halaman profil menampilkan podcast milik pengguna dan jumlah koleksinya, dengan unggah foto profil yang dibatasi jenis berkas dan ukurannya. Foto lama dihapus dari penyimpanan saat diganti, dan foto yang sedang dipakai bisa dicabut sepenuhnya lewat tombol hapus.',
          en: 'The profile page shows the podcasts a user has uploaded and how many collections they hold, with a profile picture upload restricted by file type and size. The previous file is removed from storage when replaced, and the current one can be dropped entirely with a delete button.',
        },
      },
      {
        title: { id: 'Dashboard admin dengan laporan PDF', en: 'Admin dashboard with a PDF report' },
        detail: {
          id: 'Dashboard merangkum jumlah podcast, pengguna, dan genre, jumlah podcast per genre, lima podcast yang paling banyak dikoleksi, dan lima unggahan terbaru. Tabel podcast dan pengguna bisa diurutkan per kolom serta dibagi per halaman, dan seluruh rangkuman itu bisa diunduh sebagai satu laporan PDF.',
          en: 'The dashboard summarises podcast, user, and genre counts, podcasts per genre, the five most-collected podcasts, and the five newest uploads. The podcast and user tables sort by column and paginate, and the whole summary downloads as a single PDF report.',
        },
      },
      {
        title: { id: 'Pengelolaan podcast, genre, dan pengguna', en: 'Managing podcasts, genres, and users' },
        detail: {
          id: 'Admin menambah, mengubah, dan menghapus podcast beserta gambar sampul dan berkas audionya, mengelola daftar genre dengan nama yang tidak boleh kembar, serta menelusuri dan menghapus akun pengguna dari satu area dashboard.',
          en: 'Admins create, edit, and delete podcasts together with their cover image and audio file, manage the genre list with names that must stay unique, and inspect or delete user accounts from one dashboard area.',
        },
      },
      {
        title: { id: 'Migrasi berversi dengan relasi berkunci', en: 'Versioned migrations with keyed relations' },
        detail: {
          id: 'Sebelas migrasi membangun tabelnya berurutan, dengan kunci asing dan penghapusan berantai dari podcast ke koleksi dan riwayat, sehingga menghapus satu podcast tidak meninggalkan baris menggantung. Tipe kolom tanggal rilis pernah diperbaiki lewat migrasi tersendiri, jadi perubahan skemanya tetap tercatat, bukan diedit diam-diam di database.',
          en: 'Eleven migrations build the tables in order, with foreign keys and cascading deletes from podcast down to collections and history, so deleting a podcast leaves no dangling rows. The release-date column type was once fixed through its own migration, so the schema change stays on record instead of being edited quietly in the database.',
        },
      },
      {
        title: { id: 'Antarmuka Blade dengan Tailwind dan Vite', en: 'Blade interface with Tailwind and Vite' },
        detail: {
          id: 'Halaman disusun dari komponen Blade yang dipakai berulang — layout, navbar, sidebar, kartu podcast, dan item menu — dengan gaya dari Tailwind CSS yang dibangun lewat Vite. Menu dropdown memakai Alpine.js, dan bagian yang butuh data langsung memanggil endpoint JSON tanpa memuat ulang halaman.',
          en: 'The pages are assembled from reused Blade components — layout, navbar, sidebar, podcast card, and menu item — with styling from Tailwind CSS compiled through Vite. Dropdown menus use Alpine.js, and the parts that need live data call a JSON endpoint instead of reloading the page.',
        },
      },
    ],
    metrics: [
      { value: '11', label: { id: 'migrasi database', en: 'database migrations' } },
      { value: '8', label: { id: 'model Eloquent', en: 'Eloquent models' } },
      { value: '12', label: { id: 'tabel', en: 'tables' } },
      { value: '6', label: { id: 'komponen Blade', en: 'Blade components' } },
    ],
    stack: [
      'Laravel 11',
      'PHP 8.2',
      'Blade',
      'Tailwind CSS',
      'Vite',
      'MySQL',
      'Alpine.js',
      'dompdf',
    ],
    cover: '/images/projects/podcentral-01.svg',
    gallery: ['/images/projects/podcentral-01.svg'],
    links: {},
  },
];

