import { Router } from 'express';
import { verifyJWT, optionalJWT } from '../../middlewares/verifyJWT';
import * as studioController from './studio.controller';

const router = Router();

// GET /api/studio/signature — Cloudinary upload signature
router.get('/signature', verifyJWT, studioController.getUploadSignature);

// POST /api/studio/posts — Create a new post
router.post('/posts', verifyJWT, studioController.createPost);

// GET /api/studio/feed — Cursor-paginated feed (optional auth to return is_liked/is_saved)
router.get('/feed', optionalJWT, studioController.getFeed);

// POST /api/studio/posts/:id/like — Toggle post like
router.post('/posts/:id/like', verifyJWT, studioController.toggleLikePost);

// POST /api/studio/posts/:id/save — Toggle post save
router.post('/posts/:id/save', verifyJWT, studioController.toggleSavePost);

// GET /api/studio/posts/:id/comments — Retrieve post comments
router.get('/posts/:id/comments', studioController.getComments);

// POST /api/studio/posts/:id/comments — Create a comment
router.post('/posts/:id/comments', verifyJWT, studioController.createComment);

// POST /api/studio/posts/:id/repost — Repost/share a post
router.post('/posts/:id/repost', verifyJWT, studioController.repost);

// PATCH /api/studio/posts/:id — Update a post's settings (visibility toggles)
router.patch('/posts/:id', verifyJWT, studioController.updatePost);

// DELETE /api/studio/posts/:id — Delete a post
router.delete('/posts/:id', verifyJWT, studioController.deletePost);

export default router;

