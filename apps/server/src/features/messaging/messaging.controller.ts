import { Request, Response, NextFunction } from 'express';
import * as messagingService from './messaging.service';

export async function getConversations(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const conversations = await messagingService.getUserConversations(userId);
    res.json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 50;
    const messages = await messagingService.getConversationMessages(id, cursor, limit);
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

export async function createConversation(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { target_user_id } = req.body;
    const conversation = await messagingService.createConversation(userId, target_user_id);
    res.status(201).json({ success: true, data: conversation });
  } catch (err) {
    next(err);
  }
}
