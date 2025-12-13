import { Request, Response, NextFunction } from 'express';
import { CivicService } from '../services/civic.service';
import { SelfKeyService } from '../services/selfkey.service';
import { KYCService } from '../services/kyc.service';
import { logger } from '../utils/logger';

export class KYCController {
  private civicService: CivicService;
  private selfKeyService: SelfKeyService;
  private kycService: KYCService;

  constructor() {
    this.civicService = new CivicService();
    this.selfKeyService = new SelfKeyService();
    this.kycService = new KYCService();
  }

  initVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address, provider } = req.body;

      let verificationUrl: string;

      if (provider === 'civic') {
        verificationUrl = await this.civicService.initVerification(address);
      } else if (provider === 'selfkey') {
        verificationUrl = await this.selfKeyService.initVerification(address);
      } else {
        return res.status(400).json({ error: 'Invalid KYC provider' });
      }

      res.json({ verificationUrl, provider });
    } catch (error) {
      logger.error('KYC init error:', error);
      next(error);
    }
  };

  civicCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, address } = req.body;

      const isValid = await this.civicService.verifyToken(token);

      if (isValid) {
        await this.kycService.setKYCStatus(address, true, 'civic');
        res.json({ success: true, message: 'KYC verified via Civic' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid Civic token' });
      }
    } catch (error) {
      logger.error('Civic callback error:', error);
      next(error);
    }
  };

  selfKeyCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, address } = req.body;

      const isValid = await this.selfKeyService.verifyToken(token);

      if (isValid) {
        await this.kycService.setKYCStatus(address, true, 'selfkey');
        res.json({ success: true, message: 'KYC verified via SelfKey' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid SelfKey token' });
      }
    } catch (error) {
      logger.error('SelfKey callback error:', error);
      next(error);
    }
  };

  getKYCStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = req.params;
      const status = await this.kycService.getKYCStatus(address);
      res.json(status);
    } catch (error) {
      logger.error('Get KYC status error:', error);
      next(error);
    }
  };
}
