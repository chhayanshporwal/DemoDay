import { Request, Response, NextFunction } from 'express';
import * as studioService from './studio.service';

export async function getUploadSignature(req: Request, res: Response, next: NextFunction) {
  try {
    const mediaType = (req.query.type as string) || 'video';
    const signature = await studioService.generateUploadSignature(mediaType);
    res.json(signature);
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const post = await studioService.createPost(userId, req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function getFeed(req: Request, res: Response, next: NextFunction) {
  try {
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const feed = await studioService.getFeed(cursor, limit);
    res.json(feed);
  } catch (err) {
    next(err);
  }
}
