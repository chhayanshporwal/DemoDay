import { Router } from 'express';
import { verifyJWT } from '../../middlewares/verifyJWT';
import * as networkController from './network.controller';

const router = Router();

// POST /api/network/connect — Create connection edge in Neo4j
router.post('/connect', verifyJWT, networkController.connect);

// GET /api/network/suggested — Get suggested connections
router.get('/suggested', verifyJWT, networkController.getSuggested);

export default router;
