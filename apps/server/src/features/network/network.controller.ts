import { Request, Response, NextFunction } from 'express';
import * as networkService from './network.service';

export async function connect(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const { target_user_id } = req.body;
    const result = await networkService.createConnection(userId, target_user_id);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getSuggested(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const suggestions = await networkService.getSuggestedConnections(userId);
    res.json({ success: true, data: suggestions });
  } catch (err) {
    next(err);
  }
}
