import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const analyticsController = new AnalyticsController();

// Platform-wide analytics
router.get('/platform', analyticsController.getPlatformStats);

// Pool analytics
router.get('/pool/:poolId', analyticsController.getPoolAnalytics);

// User portfolio (premium feature)
router.get('/portfolio/:address', authenticate, analyticsController.getUserPortfolio);

// TVL and utilization rates
router.get('/tvl', analyticsController.getTVL);

export default router;