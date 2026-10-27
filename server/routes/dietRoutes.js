import express from 'express';
import {
  getActiveDietPlan,
  regenerateDietPlan,
  swapMeal,
  getGroceryList
} from '../controllers/dietController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/plan', getActiveDietPlan);
router.post('/generate', regenerateDietPlan);
router.post('/swap', swapMeal);
router.get('/grocery-list', getGroceryList);

export default router;
