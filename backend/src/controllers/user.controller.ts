import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const profile = await this.userService.getUserProfile(address);
      res.json(profile);
    } catch (error) {
      logger.error('Get user profile error:', error);
      next(error);
    }
  };

  updatePreferences = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.user; // from auth middleware
      const preferences = req.body;
      await this.userService.updatePreferences(address, preferences);
      res.json({ success: true });
    } catch (error) {
      logger.error('Update preferences error:', error);
      next(error);
    }
  };
}
