// Vercel Function untuk seluruh /api/*.
//
// Berkas ini sengaja JavaScript CommonJS biasa, bukan TypeScript: yang
// dipanggilnya adalah hasil `npm run build` backend (lihat buildCommand di
// vercel.json), jadi Vercel tidak perlu mengompilasi ulang sumber backend —
// cukup membundel satu berkas ini beserta `require`-nya.
//
// `backend/dist/app.js` mengekspor aplikasi Express sebagai default export,
// dan aplikasi Express memang handler `(req, res)` — persis yang diminta
// Vercel. Rutenya tetap `/api/...` seperti di lokal karena Vercel meneruskan
// path aslinya, sehingga `app.use('/api', routes)` di app.ts tetap cocok.
//
// ponytail: `require` relatif ke dalam `backend/` adalah yang membuat
// `express` ketemu — Node menelusuri node_modules dari folder berkasnya
// sendiri, jadi dependensi backend ikut terbundel di posisi yang benar.
// Jangan diganti jadi import absolut.
module.exports = require('../backend/dist/app.js').default;
