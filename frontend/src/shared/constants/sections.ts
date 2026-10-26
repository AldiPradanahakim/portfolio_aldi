import type { L } from '../../content';

interface NavSection {
  id: string;
  label: L;
}

/** Document order of the home page, shared by Home and the section index labels. */
export const SECTION_IDS = ['hero', 'about', 'journey', 'work', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const NAV_SECTIONS: NavSection[] = [
  { id: 'about', label: { en: 'About', id: 'Tentang' } },
  { id: 'journey', label: { en: 'Experience', id: 'Pengalaman' } },
  { id: 'work', label: { en: 'Work', id: 'Portofolio' } },
  { id: 'contact', label: { en: 'Contact', id: 'Kontak' } },
];
