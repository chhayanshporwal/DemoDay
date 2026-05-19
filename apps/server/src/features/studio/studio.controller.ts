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
    const authorId = req.query.author_id as string | undefined;
    const userId = req.user?.id; // optionalJWT middleware sets this if authenticated
    const feed = await studioService.getFeed(userId, cursor, limit, authorId);
    res.json(feed);
  } catch (err) {
    next(err);
  }
}

export async function toggleLikePost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const result = await studioService.toggleLikePost(userId, postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function toggleSavePost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const result = await studioService.toggleSavePost(userId, postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const { comment_text } = req.body;
    const comment = await studioService.addComment(userId, postId, comment_text);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = req.params.id as string;
    const comments = await studioService.getComments(postId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function repost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const { commentary } = req.body;
    const reposted = await studioService.repostPost(userId, postId, commentary);
    res.status(201).json({ success: true, data: reposted });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const updated = await studioService.updatePost(userId, postId, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const result = await studioService.deletePost(userId, postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}


