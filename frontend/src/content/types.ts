export type Lang = 'id' | 'en';
export type L = Record<Lang, string>;

/**
 * Kategori sekarang berupa string bebas: panel `/admin` bisa menambah kategori
 * baru tanpa menyentuh kode. Kategori lama tetap sama id-nya.
 */
export type CategoryId = string;

export interface Category { id: CategoryId; label: L }

export interface Metric { value: string; label: L }
export interface Feature { title: L; detail: L }

export interface Project {
  slug: string; name: string; category: CategoryId; year: string;
  role: L; tagline: L; summary: L; problem: L; solution: L;
  features: Feature[]; metrics: Metric[]; stack: string[];
  /** null when there is no screenshot to show; the UI then renders a text-only card. */
  cover: string | null; gallery: string[]; links: { demo?: string; repo?: string };
  status: 'shipped' | 'in-development'; featured: boolean;
  /** Urutan tampil di situs; diatur dari panel admin. */
  order: number;
}

export interface Profile {
  name: string; initials: string; role: L; tagline: L; bio: L[];
  location: L; email: string; photo: string | null;
  availability: L; responseTime: L;
  socials: { label: string; url: string; icon: 'mail' | 'github' | 'linkedin' | 'instagram' | 'whatsapp' }[];
}

export interface SkillGroup { id: string; title: L; items: L[] }
export interface Milestone { period: string; title: L; org: L; detail: L; kind: 'education' | 'project' | 'work' }

export interface SiteSettings {
  title: L; description: L; footerNote: L;
  /** Disimpan walau desain belum memakainya; panel admin tidak mengeditnya. */
  nav: { id: string; label: L }[];
}

/** Satu dokumen utuh yang disimpan adapter (localStorage / Supabase / Firebase). */
export interface SiteContent {
  version: 1;
  profile: Profile;
  categories: Category[];
  projects: Project[];
  skills: SkillGroup[];
  journey: Milestone[];
  settings: SiteSettings;
}
