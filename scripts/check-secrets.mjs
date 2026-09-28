#!/usr/bin/env node
// Pemindai rahasia untuk repo ini.
//
// Hanya membaca berkas yang di-track Git (`git ls-files`), jadi cepat dan aman
// dijalankan sebelum push. Nilai yang cocok TIDAK PERNAH dicetak — hanya lokasi
// dan nama polanya.
//
// Jalankan: npm run secrets:check

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

// Nilai yang jelas placeholder tidak dianggap temuan (mis. isi `.env.example`).
const placeholder = (v) =>
  /^(?:["']?\s*)?(?:x{2,}[\sx]*|\*+|\.{3,}|-{2,}|<[^>]*>)?(?:\s*["']?)$/i.test(v.trim());

// Placeholder hanya wajar di berkas contoh/dokumentasi. Di berkas lain, baris
// `EMAIL_PASSWORD=` yang terisi selalu dicurigai — apa pun isinya.
const berkasDokumen = (p) => /\.(example|sample|template|md)$/i.test(p) || /\.example\./i.test(p);

const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const grup16 = /(?:^|\s)([A-Za-z0-9]{4} [A-Za-z0-9]{4} [A-Za-z0-9]{4} [A-Za-z0-9]{4})(?:\s|$)/;

// Pola per baris: `nama` yang dicetak, `cocok` menerima satu baris.
const POLA = [
  { nama: "private-key", cocok: (l) => /-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(l) },
  { nama: "kunci-supabase-publishable", cocok: (l) => /sb_publishable_[A-Za-z0-9_-]{6,}/.test(l) },
  { nama: "kunci-supabase-secret", cocok: (l) => /sb_secret_[A-Za-z0-9_-]{6,}/.test(l) },
  { nama: "token-github", cocok: (l) => /ghp_[A-Za-z0-9]{20,}/.test(l) },
  { nama: "kunci-aws", cocok: (l) => /AKIA[0-9A-Z]{16}/.test(l) },
  { nama: "kunci-openai", cocok: (l) => /\bsk-[A-Za-z0-9_-]{20,}/.test(l) },
  {
    nama: "variabel-rahasia-terisi",
    cocok: (l, f) => {
      const m = l.match(
        /^\s*(?:export\s+)?(?:SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY|VITE_SUPABASE_ANON_KEY|EMAIL_PASSWORD)\s*=\s*(.*)$/,
      );
      if (!m || !m[1].trim()) return false;
      return berkasDokumen(f) ? !placeholder(m[1]) : true;
    },
  },
  {
    nama: "gmail-app-password",
    cocok: (l, f) => {
      const m = l.match(grup16);
      if (!m || !email.test(l)) return false;
      return berkasDokumen(f) ? !placeholder(m[1]) : true;
    },
  },
];

// Berkas `.env*` yang ikut ter-track hampir pasti salah, kecuali contohnya.
const berkasEnv = (p) => /(^|\/)\.env/.test(p) && !/\.example$/.test(p);

let berkas;
try {
  berkas = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean);
} catch {
  console.log("⚠ git tidak tersedia — pemeriksaan dilewati.");
  process.exit(0);
}

const temuan = [];
for (const f of berkas) {
  if (berkasEnv(f)) temuan.push({ f, line: 1, nama: "berkas-.env-ter-track" });

  let isi;
  try {
    isi = readFileSync(f);
  } catch {
    continue; // berkas ter-track tapi sudah dihapus dari disk
  }
  if (isi.includes(0)) continue; // biner

  const baris = isi.toString("utf8").split(/\r?\n/);
  for (let i = 0; i < baris.length; i++) {
    for (const p of POLA) if (p.cocok(baris[i], f)) temuan.push({ f, line: i + 1, nama: p.nama });
  }
}

if (temuan.length) {
  console.log(`✖ Ditemukan ${temuan.length} indikasi rahasia di ${new Set(temuan.map((t) => t.f)).size} berkas:`);
  for (const t of temuan) console.log(`  ${t.f}:${t.line}  →  ${t.nama}`);
  console.log("Nilai yang cocok sengaja tidak dicetak.");
  console.log(
    "Jangan push sebelum bersih. Kalau nilainya sudah terlanjur masuk commit, ganti (rotate) dulu — menghapus berkasnya tidak cukup.",
  );
  process.exit(1);
}

console.log(`✔ Bersih: tidak ada indikasi rahasia di ${berkas.length} berkas yang di-track Git.`);
