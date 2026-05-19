import { Router } from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT';
import * as messagingController from './messaging.controller';

const router = Router();

// GET /api/messaging/conversations — List user's conversations
router.get('/conversations', verifyJWT, messagingController.getConversations);

// GET /api/messaging/conversations/:id/messages — Get messages for a conversation
router.get('/conversations/:id/messages', verifyJWT, messagingController.getMessages);

// POST /api/messaging/conversations — Create a new conversation
router.post('/conversations', verifyJWT, messagingController.createConversation);

export default router;
