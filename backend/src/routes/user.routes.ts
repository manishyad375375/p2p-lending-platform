import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Get user profile
router.get('/:address', userController.getUserProfile);

// Update user preferences
router.put('/preferences', authenticate, userController.updatePreferences);

export default router;