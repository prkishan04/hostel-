import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { initDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

async function bootstrap() {
  await initDb(); // DevOps: ensure schema exists on startup; safe due to IF NOT EXISTS.

  const app = express();

  app.use(cors());
  app.use(express.json());

  // All API routes are mounted under /api; Nginx proxies /api to this service.
  app.use('/api/auth', authRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/admin', adminRoutes);

  // Simple health endpoint for monitoring / container orchestration.
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(config.port, () => {
    console.log(`Backend listening on port ${config.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

