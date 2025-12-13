import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { logger } from '../utils/logger';

export class AnalyticsController {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  getPlatformStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await this.analyticsService.getPlatformStats();
      res.json(stats);
    } catch (error) {
      logger.error('Get platform stats error:', error);
      next(error);
    }
  };

  getPoolAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { poolId } = req.params;
      const analytics = await this.analyticsService.getPoolAnalytics(poolId);
      res.json(analytics);
    } catch (error) {
      logger.error('Get pool analytics error:', error);
      next(error);
    }
  };

  getUserPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const portfolio = await this.analyticsService.getUserPortfolio(address);
      res.json(portfolio);
    } catch (error) {
      logger.error('Get user portfolio error:', error);
      next(error);
    }
  };

  getTVL = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tvl = await this.analyticsService.getTVL();
      res.json(tvl);
    } catch (error) {
      logger.error('Get TVL error:', error);
      next(error);
    }
  };
}
