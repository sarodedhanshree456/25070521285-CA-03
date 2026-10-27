import express from 'express';
import {
  addWater,
  getTodayWater,
  getWeeklyWater,
  resetWater
} from '../controllers/waterController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/add', addWater);
router.get('/today', getTodayWater);
router.get('/weekly', getWeeklyWater);
router.post('/reset', resetWater);

export default router;
