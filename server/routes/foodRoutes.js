import express from 'express';
import {
  searchFoods,
  getAllFoods,
  createCustomFood,
  logMeal,
  getDailyMealLogs,
  deleteMealLog,
  getWeeklyFoodSummary
} from '../controllers/foodController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes for food search
router.get('/search', searchFoods);
router.get('/all', getAllFoods);

// Protected routes for logging
router.use(protect);
router.post('/custom', createCustomFood);
router.post('/log', logMeal);
router.get('/logs', getDailyMealLogs);
router.delete('/log/:id', deleteMealLog);
router.get('/weekly-summary', getWeeklyFoodSummary);

export default router;
