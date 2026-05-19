// ==========================================
// app.ts — Express application configuration
// Middleware chain, route mounting, error handling
// ==========================================

import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { errorHandler } from './middlewares/errorHandler';
import { maskUserDataMiddleware } from './middlewares/maskUserData';

// Feature routers
import usersRouter from './features/users/users.routes';
import studioRouter from './features/studio/studio.routes';
import networkRouter from './features/network/network.routes';
import messagingRouter from './features/messaging/messaging.routes';

const app = express();

// ---- Core Middleware ----
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Data masking (intercepts res.json for CGPA redaction) ----
app.use(maskUserDataMiddleware);

// ---- Health check ----
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'demoday-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ---- Feature Routes ----
app.use('/api/users', usersRouter);
app.use('/api/studio', studioRouter);
app.use('/api/network', networkRouter);
app.use('/api/messaging', messagingRouter);

// ---- 404 handler ----
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found', code: 404 });
});

// ---- Global error handler (must be last) ----
app.use(errorHandler);

export default app;
