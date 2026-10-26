import type { Project, SiteContent } from '../content/types';

export function isUrl(value: string): boolean {
  return !value || value.startsWith('/') || value.startsWith('http') || value.startsWith('mailto:');
}

export function emailError(email: string): string | undefined {
  if (!email.trim()) return undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : 'Email tidak valid.';
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function slugError(projects: Project[], slug: string, selfIndex: number): string | undefined {
  if (!slug) return 'Slug wajib diisi.';
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Hanya huruf kecil, angka, dan tanda hubung.';
  if (projects.some((project, index) => index !== selfIndex && project.slug === slug)) {
    return `Slug "${slug}" sudah dipakai proyek lain.`;
  }
  return undefined;
}

/** Validasi penuh sebelum menyimpan; mengembalikan daftar pesan kesalahan. */
export function validateContent(content: SiteContent): string[] {
  const errors: string[] = [];

  if (content.categories.length === 0) errors.push('Minimal satu kategori wajib ada.');

  const seen = new Set<string>();
  content.projects.forEach((project, index) => {
    const label = project.name.trim() || `Proyek #${index + 1}`;
    if (!project.name.trim()) errors.push(`${label}: nama wajib diisi.`);
    if (!project.slug) {
      errors.push(`${label}: slug wajib diisi.`);
    } else if (!/^[a-z0-9-]+$/.test(project.slug)) {
      errors.push(`${label}: slug hanya boleh huruf kecil, angka, dan tanda hubung.`);
    } else if (seen.has(project.slug)) {
      errors.push(`${label}: slug "${project.slug}" dipakai lebih dari satu.`);
    }
    seen.add(project.slug);
    if (!content.categories.some((category) => category.id === project.category)) {
      errors.push(`${label}: kategori "${project.category}" tidak ada.`);
    }
  });

  const emailIssue = emailError(content.profile.email);
  if (emailIssue) errors.push(`Profil: ${emailIssue}`);

  const urls: Array<[string, string]> = [];
  if (content.profile.photo) urls.push(['Profil: foto', content.profile.photo]);
  content.profile.socials.forEach((social) => urls.push([`Profil: sosial ${social.label}`, social.url]));
  content.projects.forEach((project) => {
    if (project.cover) urls.push([`Proyek ${project.name}: cover`, project.cover]);
    project.gallery.forEach((url) => urls.push([`Proyek ${project.name}: galeri`, url]));
    if (project.links.demo) urls.push([`Proyek ${project.name}: tautan demo`, project.links.demo]);
    if (project.links.repo) urls.push([`Proyek ${project.name}: tautan repo`, project.links.repo]);
  });
  urls.forEach(([label, url]) => {
    if (!isUrl(url)) errors.push(`${label}: URL harus diawali "/", "http", atau "mailto:".`);
  });

  return errors;
}