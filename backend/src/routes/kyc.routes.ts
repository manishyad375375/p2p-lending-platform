import { Router } from 'express';
import { KYCController } from '../controllers/kyc.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { kycInitSchema, kycCallbackSchema } from '../validators/kyc.validator';

const router = Router();
const kycController = new KYCController();

// Initialize KYC verification
router.post(
  '/init',
  authenticate,
  validateRequest(kycInitSchema),
  kycController.initVerification
);

// Civic callback
router.post(
  '/civic/callback',
  validateRequest(kycCallbackSchema),
  kycController.civicCallback
);

// SelfKey callback
router.post(
  '/selfkey/callback',
  validateRequest(kycCallbackSchema),
  kycController.selfKeyCallback
);

// Check KYC status
router.get(
  '/status/:address',
  kycController.getKYCStatus
);

export default router;