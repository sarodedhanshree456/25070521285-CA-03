import express from 'express';
import {
  getCurrentWorkoutPlan,
  generateNewWorkoutPlan,
  logWorkoutSession,
  getWorkoutHistory
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/current', getCurrentWorkoutPlan);
router.post('/generate', generateNewWorkoutPlan);
router.post('/log', logWorkoutSession);
router.get('/history', getWorkoutHistory);

export default router;
