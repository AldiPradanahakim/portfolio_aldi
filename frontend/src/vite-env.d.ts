/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Pilihan adapter CMS: `local` | `supabase` | `firebase`. */ readonly VITE_DATA_SOURCE?: 'local' | 'supabase' | 'firebase';
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  /** Kata sandi admin untuk mode local (default `admin`). */ readonly VITE_ADMIN_PASSWORD?: string;
}