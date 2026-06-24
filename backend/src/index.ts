import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { generalLimiter } from './middleware/rateLimit';
import authRoutes from './routes/authRoutes';
import appRoutes from './routes/appRoutes';
import deviceRoutes from './routes/deviceRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(generalLimiter);

app.use('/uploads', express.static(path.resolve(config.uploadDir)));

app.use('/auth', authRoutes);
app.use('/apps', appRoutes);
app.use('/device', deviceRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`[Anonymous] Backend running on http://localhost:${config.port}`);
});
