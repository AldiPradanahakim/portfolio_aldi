import type { DataAdapter, DataSource } from './types';
import { localAdapter } from './local';
import { supabaseAdapter } from './supabase';
import { firebaseAdapter } from './firebase';

function explicitSource(): DataSource | undefined {
  const value = import.meta.env.VITE_DATA_SOURCE;
  if (value === 'local' || value === 'supabase' || value === 'firebase') return value;
  return undefined;
}

/**
 * Urutan pemilihan adapter:
 * 1. `VITE_DATA_SOURCE` bila diisi eksplisit (tetap dipakai walau kuncinya belum lengkap);
 * 2. kredensial Supabase bila lengkap;
 * 3. kredensial Firebase bila lengkap;
 * 4. local.
 */
export function getAdapter(): DataAdapter {
  const explicit = explicitSource();

  if (explicit === 'local') return localAdapter;
  if (explicit === 'supabase') {
    return supabaseAdapter(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
  }
  if (explicit === 'firebase') {
    return firebaseAdapter(import.meta.env.VITE_FIREBASE_API_KEY, import.meta.env.VITE_FIREBASE_PROJECT_ID);
  }

  const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  if (hasSupabase) {
    return supabaseAdapter(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  const hasFirebase = Boolean(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID);
  if (hasFirebase) {
    return firebaseAdapter(import.meta.env.VITE_FIREBASE_API_KEY, import.meta.env.VITE_FIREBASE_PROJECT_ID);
  }

  return localAdapter;
}