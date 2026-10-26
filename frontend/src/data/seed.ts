import { CATEGORIES, JOURNEY, PROFILE, PROJECTS, SKILL_GROUPS } from '../content';
import type { SiteContent } from '../content/types';

/**
 * Isi bawaan: semua teks tetap hidup di `frontend/src/content/*` dan disalin ke
 * sini sebagai satu dokumen. Panel `/admin` menyimpan salinan editannya ke
 * adapter (localStorage / Supabase / Firebase); saat adapter kosong, situs
 * merender isi dari sini tanpa perlu jaringan.
 */
export const SEED_CONTENT: SiteContent = {
  version: 1,
  profile: PROFILE,
  categories: CATEGORIES,
  // `order` tidak ditulis di content/projects.ts — diisi dari urutan dokumen di sini.
  projects: PROJECTS.map((project, index) => ({ ...project, order: index })),
  skills: SKILL_GROUPS,
  journey: JOURNEY,
  settings: {
    // Salinan persis <title> dan meta description di index.html.
    title: {
      id: 'Aldi Pradana Hakim — Pengembang Web Full-Stack',
      en: 'Aldi Pradana Hakim — Full-Stack Web Developer',
    },
    description: {
      id: 'Portofolio Aldi Pradana Hakim, pengembang web full-stack di Indonesia. Aplikasi web, sistem kasir, pelacakan perangkat realtime, REST API, dan web GIS — lengkap dengan teknologi asli dan hasilnya.',
      en: 'Portfolio of Aldi Pradana Hakim, a full-stack web developer in Indonesia. Web applications, point-of-sale systems, realtime device tracking, REST APIs and web GIS — each with its real stack and results.',
    },
    footerNote: { id: 'Indonesia · Remote', en: 'Indonesia · Remote' },
    nav: [
      { id: 'about', label: { id: 'Tentang', en: 'About' } },
      { id: 'journey', label: { id: 'Pengalaman', en: 'Experience' } },
      { id: 'work', label: { id: 'Portofolio', en: 'Work' } },
      { id: 'contact', label: { id: 'Kontak', en: 'Contact' } },
    ],
  },
};