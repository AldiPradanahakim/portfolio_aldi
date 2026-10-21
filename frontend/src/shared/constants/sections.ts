import type { L } from '../../content';

interface NavSection {
  id: string;
  label: L;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'about', label: { en: 'About', id: 'Tentang' } },
  { id: 'work', label: { en: 'Work', id: 'Proyek' } },
  { id: 'services', label: { en: 'Services', id: 'Layanan' } },
  { id: 'skills', label: { en: 'Stack', id: 'Teknologi' } },
  { id: 'journey', label: { en: 'Journey', id: 'Perjalanan' } },
];
