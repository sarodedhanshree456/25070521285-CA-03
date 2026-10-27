import express from 'express';
import {
  getProfile,
  updateProfile,
  completeOnboarding,
  deleteAccount
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/onboarding', completeOnboarding);
router.delete('/account', deleteAccount);

export default router;
