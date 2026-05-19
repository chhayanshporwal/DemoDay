import { Router } from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT';
import * as usersController from './users.controller';

const router = Router();

// POST /api/users/sync — Create/update profile after Supabase auth
router.post('/sync', verifyJWT, usersController.syncUser);

// PATCH /api/users/:id/profile — Update profile fields
router.patch('/:id/profile', verifyJWT, usersController.updateProfile);

// GET /api/users/:id/portfolio — Fetch full portfolio view
router.get('/:id/portfolio', usersController.getPortfolio);

export default router;
