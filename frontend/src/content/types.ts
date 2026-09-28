export type Lang = 'id' | 'en';
export type L = Record<Lang, string>;
export type CategoryId = 'web-app' | 'pos-retail' | 'iot-realtime' | 'marketplace';

export interface Metric { value: string; label: L }
export interface Feature { title: L; detail: L }

export interface Project {
  slug: string; name: string; category: CategoryId; year: string;
  role: L; tagline: L; summary: L; problem: L; solution: L;
  features: Feature[]; metrics: Metric[]; stack: string[];
  cover: string; gallery: string[]; links: { demo?: string; repo?: string };
  status: 'shipped' | 'in-development'; featured: boolean;
}

export interface Profile {
  name: string; initials: string; role: L; tagline: L; bio: L[];
  location: L; email: string; photo: string | null;
  availability: L; responseTime: L;
  socials: { label: string; url: string; icon: 'mail' | 'github' | 'linkedin' | 'instagram' }[];
}

export interface Service { id: string; title: L; description: L; deliverables: L[]; icon: string }
export interface SkillGroup { id: string; title: L; items: L[] }
export interface Milestone { period: string; title: L; org: L; detail: L; kind: 'education' | 'project' | 'work' }
export interface Step { n: string; title: L; detail: L }
export interface Faq { q: L; a: L }
