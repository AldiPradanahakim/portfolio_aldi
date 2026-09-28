import express from 'express';
import cors from 'cors';
import { assertConfig, config } from './config/env.js';
import routes from './interfaces/http/routes.js';
import { errorHandler, notFound, securityHeaders } from './interfaces/http/middleware/security.js';

assertConfig();

const app = express();

// Express menandai dirinya lewat header ini; mematikannya menghapus satu
// petunjuk versi yang tidak perlu dibagikan ke publik.
app.disable('x-powered-by');

app.use(securityHeaders);

app.use(
  cors({
    origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  })
);

// Batas kecil: formulir kontak tidak pernah butuh lebih dari beberapa KB.
app.use(express.json({ limit: '16kb' }));

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Backend API berjalan di http://localhost:${config.port}`);
  console.log('   GET  /health');
  console.log('   POST /api/contact');
});
