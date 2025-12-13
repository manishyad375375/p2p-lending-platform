import { Router } from 'express';
import kycRoutes from './kyc.routes';
import scoreRoutes from './score.routes';
import analyticsRoutes from './analytics.routes';
import loanRoutes from './loan.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/kyc', kycRoutes);
router.use('/score', scoreRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/loans', loanRoutes);
router.use('/users', userRoutes);

export default router;