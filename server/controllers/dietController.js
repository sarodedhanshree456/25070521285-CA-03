import DietPlan from '../models/DietPlan.js';
import User from '../models/User.js';
import { generateDeterministicDietPlan } from '../utils/mealPlanGenerator.js';

// @desc    Get user's active diet plan
// @route   GET /api/diet/plan
export const getActiveDietPlan = async (req, res, next) => {
  try {
    let plan = await DietPlan.findOne({ userId: req.user.id, isActive: true });

    if (!plan) {
      // Auto-generate if not yet existing
      const user = await User.findById(req.user.id);
      const generated = generateDeterministicDietPlan({
        name: `${user.name}'s Nutrition Plan`,
        dailyCalorieTarget: user.targetCalories || 2000,
        targetMacros: {
          proteinG: user.targetProtein || 140,
          carbsG: user.targetCarbs || 210,
          fatG: user.targetFat || 55
        },
        dietaryPreference: user.dietaryPreference || 'vegetarian',
        allergies: user.allergies || []
      });

      plan = await DietPlan.create({
        userId: user._id,
        ...generated
      });
    }

    res.json({
      success: true,
      plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate diet plan
// @route   POST /api/diet/generate
export const regenerateDietPlan = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { dietaryPreference, dailyCalorieTarget } = req.body;

    const generated = generateDeterministicDietPlan({
      name: `${user.name}'s Custom Nutrition Plan`,
      dailyCalorieTarget: dailyCalorieTarget || user.targetCalories || 2000,
      targetMacros: {
        proteinG: user.targetProtein || 140,
        carbsG: user.targetCarbs || 210,
        fatG: user.targetFat || 55
      },
      dietaryPreference: dietaryPreference || user.dietaryPreference || 'vegetarian',
      allergies: user.allergies || []
    });

    await DietPlan.deleteMany({ userId: user._id });
    const plan = await DietPlan.create({
      userId: user._id,
      ...generated
    });

    res.json({
      success: true,
      message: 'Diet plan regenerated successfully',
      plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Swap a specific meal in the schedule
// @route   POST /api/diet/swap
export const swapMeal = async (req, res, next) => {
  try {
    const { day, mealType, newMeal } = req.body;
    const plan = await DietPlan.findOne({ userId: req.user.id, isActive: true });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }

    const dayObj = plan.days.find(d => d.day.toLowerCase() === day.toLowerCase());
    if (dayObj && dayObj.meals[mealType]) {
      dayObj.meals[mealType] = [newMeal];
      // Recalculate day calories
      let dayCals = 0, dayProt = 0, dayCarbs = 0, dayFat = 0;
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(m => {
        (dayObj.meals[m] || []).forEach(item => {
          dayCals += item.calories || 0;
          dayProt += item.protein || 0;
          dayCarbs += item.carbs || 0;
          dayFat += item.fat || 0;
        });
      });
      dayObj.totalCalories = dayCals;
      dayObj.totalProtein = dayProt;
      dayObj.totalCarbs = dayCarbs;
      dayObj.totalFat = dayFat;

      await plan.save();
    }

    res.json({
      success: true,
      message: 'Meal swapped successfully',
      plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated grocery shopping checklist
// @route   GET /api/diet/grocery-list
export const getGroceryList = async (req, res, next) => {
  try {
    const plan = await DietPlan.findOne({ userId: req.user.id, isActive: true });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'No active diet plan found' });
    }

    const itemsMap = new Map();

    plan.days.forEach(day => {
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(m => {
        (day.meals[m] || []).forEach(food => {
          const key = food.name;
          if (itemsMap.has(key)) {
            itemsMap.set(key, {
              ...itemsMap.get(key),
              count: itemsMap.get(key).count + 1
            });
          } else {
            itemsMap.set(key, {
              name: food.name,
              category: food.category || 'General',
              servingSize: food.servingSize,
              count: 1
            });
          }
        });
      });
    });

    const groceryList = Array.from(itemsMap.values());

    res.json({
      success: true,
      count: groceryList.length,
      groceries: groceryList
    });
  } catch (error) {
    next(error);
  }
};
