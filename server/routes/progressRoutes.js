import express from 'express';
import {
  logProgress,
  getProgressHistory
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/log', logProgress);
router.get('/history', getProgressHistory);

export default router;
