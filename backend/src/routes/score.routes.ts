import { Router } from 'express';
import { ScoreController } from '../controllers/score.controller';
import { authenticate, adminOnly } from '../middleware/auth';

const router = Router();
const scoreController = new ScoreController();

// Get credit score for an address
router.get('/:address', scoreController.getScore);

// Recompute credit score (admin or automated job)
router.post('/recompute/:address', authenticate, adminOnly, scoreController.recomputeScore);

// Update score on-chain (admin or automated updater)
router.post('/update/:address', authenticate, adminOnly, scoreController.updateScoreOnChain);

// Get score history
router.get('/history/:address', scoreController.getScoreHistory);

export default router;