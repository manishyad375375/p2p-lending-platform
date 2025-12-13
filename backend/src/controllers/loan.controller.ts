import { Request, Response, NextFunction } from 'express';
import { LoanService } from '../services/loan.service';
import { logger } from '../utils/logger';

export class LoanController {
  private loanService: LoanService;

  constructor() {
    this.loanService = new LoanService();
  }

  getUserLoans = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const loans = await this.loanService.getUserLoans(address);
      res.json(loans);
    } catch (error) {
      logger.error('Get user loans error:', error);
      next(error);
    }
  };

  getLoanHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const history = await this.loanService.getLoanHistory(address);
      res.json(history);
    } catch (error) {
      logger.error('Get loan history error:', error);
      next(error);
    }
  };

  getLiquidationOpportunities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const opportunities = await this.loanService.getLiquidationOpportunities();
      res.json(opportunities);
    } catch (error) {
      logger.error('Get liquidation opportunities error:', error);
      next(error);
    }
  };
}
