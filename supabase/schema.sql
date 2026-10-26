-- Skema simpanan konten situs untuk adapter Supabase.
-- Jalankan di SQL Editor Supabase. Tabel menyimpan SATU baris dengan id 'main';
-- kolom `data` menampung seluruh dokumen SiteContent sebagai JSONB.

create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "public read" on public.site_content for select using (true);
create policy "auth write" on public.site_content for insert to authenticated with check (true);
create policy "auth update" on public.site_content for update to authenticated using (true) with check (true);

-- CATATAN KONFIGURASI (jalankan manual lewat dashboard Supabase):
--
-- 1. Aktifkan provider Email di Authentication → Sign In / Up → Email.
--    (Otentikasi panel memakai POST /auth/v1/token?grant_type=password.)
-- 2. Buat pengguna admin:
--      - dashboard → Authentication → Users → Add user → isi email + kata sandi.
--      - pengguna ini yang dipakai untuk masuk di /admin.
-- 3. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di frontend/.env (anon key
--    untuk baca publik; penulisan memakai access_token pengguna yang sudah masuk).