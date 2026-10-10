import app from './app.js';
import { config } from './config/env.js';

// Hanya dipakai saat dijalankan lokal. Di Vercel, `api/[...path].js` yang
// memanggil aplikasi ini — tidak ada port yang dibuka di sana.
app.listen(config.port, () => {
  console.log(`Backend API berjalan di http://localhost:${config.port}`);
  console.log('   GET  /health  (dan /api/health)');
  console.log('   POST /api/contact');
});
