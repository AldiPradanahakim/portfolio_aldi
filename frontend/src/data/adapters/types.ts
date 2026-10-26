import type { SiteContent } from '../../content/types';

export type DataSource = 'local' | 'supabase' | 'firebase';

export interface AdminSession { email: string }

export interface DataAdapter {
  source: DataSource;
  /** local = 'password', remote (supabase/firebase) = 'email' */
  authMode: 'password' | 'email';
  /** false when the adapter was selected but its env keys are missing. */
  configured: boolean;
  load(): Promise<SiteContent | null>;
  save(content: SiteContent): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  getSession(): Promise<AdminSession | null>;
}