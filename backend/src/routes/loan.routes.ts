import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const loanController = new LoanController();

// Get user's active loans
router.get('/user/:address', loanController.getUserLoans);

// Get loan history
router.get('/history/:address', loanController.getLoanHistory);

// Get liquidation opportunities
router.get('/liquidations', loanController.getLiquidationOpportunities);

export default router;