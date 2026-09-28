import type { SkillGroup } from './types';

/**
 * Hanya teknologi yang benar-benar dipakai di proyek pada projects.ts.
 *
 * Sebagian besar butir adalah nama teknologi, jadi `id` dan `en` memang sama —
 * sama seperti daftar `stack` pada projects.ts. Yang berupa frasa (bukan nama
 * produk) ditulis dua bahasa, supaya tidak ada kalimat Indonesia yang bocor ke
 * tampilan berbahasa Inggris.
 */

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'backend',
    title: { id: 'Backend', en: 'Backend' },
    items: [
      { id: 'PHP 8.3', en: 'PHP 8.3' },
      { id: 'Laravel 13', en: 'Laravel 13' },
      { id: 'Node.js 20', en: 'Node.js 20' },
      { id: 'Express', en: 'Express' },
      { id: 'TypeScript', en: 'TypeScript' },
      { id: 'REST API', en: 'REST API' },
    ],
  },
  {
    id: 'frontend',
    title: { id: 'Frontend', en: 'Frontend' },
    items: [
      { id: 'React 18', en: 'React 18' },
      { id: 'Vite', en: 'Vite' },
      { id: 'Tailwind CSS', en: 'Tailwind CSS' },
      { id: 'Blade', en: 'Blade' },
      { id: 'Alpine.js', en: 'Alpine.js' },
      { id: 'React Query', en: 'React Query' },
      { id: 'Zustand', en: 'Zustand' },
      { id: 'Leaflet', en: 'Leaflet' },
      { id: 'Dexie (IndexedDB)', en: 'Dexie (IndexedDB)' },
      { id: 'PWA (vite-plugin-pwa)', en: 'PWA (vite-plugin-pwa)' },
    ],
  },
  {
    id: 'database',
    title: { id: 'Database', en: 'Databases' },
    items: [
      { id: 'PostgreSQL 14', en: 'PostgreSQL 14' },
      { id: 'MySQL / MariaDB', en: 'MySQL / MariaDB' },
      { id: 'Eloquent & migrasi Laravel', en: 'Eloquent & Laravel migrations' },
      { id: 'Sequelize', en: 'Sequelize' },
    ],
  },
  {
    id: 'realtime',
    title: { id: 'Realtime & perangkat', en: 'Realtime & devices' },
    items: [
      { id: 'MQTT (php-mqtt/client)', en: 'MQTT (php-mqtt/client)' },
      { id: 'Pusher', en: 'Pusher' },
      { id: 'Laravel Echo', en: 'Laravel Echo' },
      { id: 'Socket.io', en: 'Socket.io' },
      { id: 'Penandatanganan data HMAC-SHA256', en: 'HMAC-SHA256 payload signing' },
      { id: 'ESP / Arduino', en: 'ESP / Arduino' },
    ],
  },
  {
    id: 'layanan',
    title: { id: 'Layanan pihak ketiga', en: 'Third-party services' },
    items: [
      { id: 'Midtrans', en: 'Midtrans' },
      { id: 'Xendit', en: 'Xendit' },
      { id: 'Nodemailer', en: 'Nodemailer' },
      { id: 'WhatsApp Gateway', en: 'WhatsApp gateway' },
      { id: 'OpenStreetMap', en: 'OpenStreetMap' },
      { id: 'Data wilayah administratif', en: 'administrative-region datasets' },
    ],
  },
  {
    id: 'operasional',
    title: { id: 'Operasional & pengujian', en: 'Operations & testing' },
    items: [
      { id: 'Git', en: 'Git' },
      { id: 'Composer & npm', en: 'Composer & npm' },
      { id: 'PHPUnit', en: 'PHPUnit' },
      { id: 'Supervisor', en: 'Supervisor' },
      { id: 'Cron & penjadwal Laravel', en: 'Cron & Laravel scheduler' },
      { id: 'Worker antrian', en: 'Queue worker' },
      { id: 'dompdf', en: 'dompdf' },
    ],
  },
];
