import { Request, Response, NextFunction } from 'express';
import { ScoreService } from '../services/score.service';
import { logger } from '../utils/logger';

export class ScoreController {
  private scoreService: ScoreService;

  constructor() {
    this.scoreService = new ScoreService();
  }

  getScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const score = await this.scoreService.getScore(address);
      res.json(score);
    } catch (error) {
      logger.error('Get score error:', error);
      next(error);
    }
  };

  recomputeScore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const newScore = await this.scoreService.computeScore(address);
      res.json({ address, score: newScore, computed: true });
    } catch (error) {
      logger.error('Recompute score error:', error);
      next(error);
    }
  };

  updateScoreOnChain = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const scoreData = await this.scoreService.computeScore(address);
      const txHash = await this.scoreService.updateScoreOnChain(address, scoreData);
      res.json({ address, txHash, success: true });
    } catch (error) {
      logger.error('Update score on-chain error:', error);
      next(error);
    }
  };

  getScoreHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const history = await this.scoreService.getScoreHistory(address);
      res.json(history);
    } catch (error) {
      logger.error('Get score history error:', error);
      next(error);
    }
  };
}
