import { Router } from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT';
import * as studioController from './studio.controller';

const router = Router();

// GET /api/studio/signature — Cloudinary upload signature
router.get('/signature', verifyJWT, studioController.getUploadSignature);

// POST /api/studio/posts — Create a new post
router.post('/posts', verifyJWT, studioController.createPost);

// GET /api/studio/feed — Cursor-paginated feed
router.get('/feed', studioController.getFeed);

export default router;
