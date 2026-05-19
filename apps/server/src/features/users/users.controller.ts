import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';

export async function syncUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, full_name, role_type, avatar_url, tech_stack } = req.body;
    const userId = req.user!.id;
    const user = await usersService.syncUser(userId, { email, full_name, role_type, avatar_url, tech_stack });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const updates = req.body;
    const user = await usersService.updateProfile(id, updates);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getPortfolio(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const portfolio = await usersService.getPortfolio(id);
    res.json(portfolio);
  } catch (err) {
    next(err);
  }
}
