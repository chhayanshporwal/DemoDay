// ==========================================
// Socket.io event handlers — Real-time messaging
// Document 2, Section 4: WebSocket Events
// ==========================================

import { Server as SocketIOServer, Socket } from 'socket.io';
import * as messagingService from './messaging.service';
import type { SendMessageEvent, JoinConversationEvent } from '@demoday/shared';

export function registerMessagingSocket(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // ---- join_conversation: Client joins a socket room ----
    socket.on('join_conversation', (payload: JoinConversationEvent) => {
      const { conversation_id } = payload;
      socket.join(conversation_id);
      console.log(`[Socket.io] ${socket.id} joined room: ${conversation_id}`);
    });

    // ---- send_message: Client sends a message ----
    socket.on('send_message', async (payload: SendMessageEvent) => {
      try {
        const { conversation_id, message_text, media_kind, rich_media_url } = payload;

        // TODO: Verify sender identity via socket auth middleware
        const senderId = (socket.data as { userId?: string }).userId ?? 'anonymous';

        // Persist to database
        const savedMessage = await messagingService.saveMessage(
          conversation_id,
          senderId,
          message_text,
          media_kind,
          rich_media_url,
        );

        // Broadcast to all clients in the conversation room
        io.to(conversation_id).emit('receive_message', {
          ...savedMessage,
          sender: {
            username: 'user', // TODO: Fetch sender details
            avatar_url: null,
          },
        });

        // Notify the receiver if they're not in the room
        // This triggers the "message_request" event for cold outreach
        const { receiver_id } = payload;
        const receiverSockets = await io.in(conversation_id).fetchSockets();
        const receiverInRoom = receiverSockets.some(
          (s) => (s.data as { userId?: string }).userId === receiver_id
        );

        if (!receiverInRoom) {
          // Find receiver's socket and emit a notification
          io.emit(`message_request:${receiver_id}`, {
            conversation_id,
            sender: {
              id: senderId,
              username: 'user', // TODO: Fetch
              full_name: 'Unknown',
              avatar_url: null,
              role_type: 'creator',
            },
            preview_text: message_text?.slice(0, 100) ?? '',
          });
        }
      } catch (error) {
        console.error('[Socket.io] send_message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ---- leave_conversation ----
    socket.on('leave_conversation', (payload: { conversation_id: string }) => {
      socket.leave(payload.conversation_id);
    });

    // ---- disconnect ----
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
}
