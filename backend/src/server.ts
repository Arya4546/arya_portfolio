import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { testConnection, sequelize } from './db';
import activityRoutes from './routes/activity.routes';

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(express.json({ limit: '1kb' }));

app.use(
  cors({
    origin: env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting: 30 requests per minute per IP
const activityLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

app.use('/api/activity', activityLimiter);

// ── Routes ─────────────────────────────────────────────────
app.use('/api', activityRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start ──────────────────────────────────────────────────
const start = async (): Promise<void> => {
  await testConnection();
  await sequelize.sync({ alter: env.NODE_ENV === 'development' });
  console.log('✅ Database schema synchronized');

  app.listen(env.PORT, () => {
    console.log(`🚀 Activity API running on http://localhost:${env.PORT}`);
    console.log(`📡 CORS origin: ${env.ALLOWED_ORIGIN}`);
  });
};

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
