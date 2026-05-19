// ==========================================
// server.ts — HTTP server + Socket.io bootstrap
// Entry point — starts listening on PORT
// ==========================================

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config/env';
import { registerMessagingSocket } from './features/messaging/messaging.socket';

// ---- Create HTTP server from Express app ----
const httpServer = http.createServer(app);

// ---- Attach Socket.io ----
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Register socket event handlers
registerMessagingSocket(io);

// ---- Start listening ----
httpServer.listen(config.port, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🚀 DemoDay API Server                 ║
  ║   Port:  ${config.port}                           ║
  ║   Env:   ${config.nodeEnv.padEnd(20)}       ║
  ║   CORS:  ${config.clientUrl.padEnd(20)}   ║
  ╚══════════════════════════════════════════╝
  `);
});

export { io, httpServer };
