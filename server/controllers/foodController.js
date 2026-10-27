import Food from '../models/Food.js';
import MealLog from '../models/MealLog.js';

// @desc    Search foods by query or category
// @route   GET /api/food/search
export const searchFoods = async (req, res, next) => {
  try {
    const { query = '', category = '', isVeg } = req.query;
    const filter = {};

    if (query.trim()) {
      filter.$or = [
        { name: { $regex: query.trim(), $options: 'i' } },
        { localName: { $regex: query.trim(), $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (isVeg === 'true') {
      filter.isVeg = true;
    }

    const foods = await Food.find(filter).sort({ name: 1 }).limit(50);

    res.json({
      success: true,
      count: foods.length,
      foods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all foods in library
// @route   GET /api/food/all
export const getAllFoods = async (req, res, next) => {
  try {
    const foods = await Food.find().sort({ category: 1, name: 1 });
    res.json({
      success: true,
      count: foods.length,
      foods
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom food item
// @route   POST /api/food/custom
export const createCustomFood = async (req, res, next) => {
  try {
    const {
      name,
      localName,
      category,
      servingSize,
      servingWeightGrams,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      isVeg,
      isVegan,
      allergens
    } = req.body;

    const food = await Food.create({
      name,
      localName: localName || '',
      category: category || 'snacks',
      servingSize: servingSize || '100g',
      servingWeightGrams: servingWeightGrams || 100,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      fiber: Number(fiber) || 0,
      isVeg: isVeg !== undefined ? isVeg : true,
      isVegan: isVegan || false,
      allergens: allergens || [],
      isCustom: true,
      createdBy: req.user ? req.user.id : null
    });

    res.status(201).json({
      success: true,
      message: 'Custom food item created successfully',
      food
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a meal item consumed
// @route   POST /api/food/log
export const logMeal = async (req, res, next) => {
  try {
    const { date, mealType, foodItem } = req.body;
    const today = new Date().toISOString().split('T')[0];

    if (!mealType || !foodItem || !foodItem.name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mealType and foodItem details'
      });
    }

    const log = await MealLog.create({
      userId: req.user.id,
      date: date || today,
      mealType,
      foodItem: {
        foodId: foodItem.foodId || null,
        name: foodItem.name,
        servingSize: foodItem.servingSize || '1 serving',
        quantity: Number(foodItem.quantity) || 1,
        calories: Number(foodItem.calories) || 0,
        protein: Number(foodItem.protein) || 0,
        carbs: Number(foodItem.carbs) || 0,
        fat: Number(foodItem.fat) || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meal logs for a specific day
// @route   GET /api/food/logs
export const getDailyMealLogs = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const date = req.query.date || today;

    const logs = await MealLog.find({
      userId: req.user.id,
      date
    }).sort({ createdAt: 1 });

    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    logs.forEach(l => {
      totals.calories += Math.round(l.foodItem.calories * (l.foodItem.quantity || 1));
      totals.protein += Math.round(l.foodItem.protein * (l.foodItem.quantity || 1));
      totals.carbs += Math.round(l.foodItem.carbs * (l.foodItem.quantity || 1));
      totals.fat += Math.round(l.foodItem.fat * (l.foodItem.quantity || 1));
    });

    res.json({
      success: true,
      date,
      totals,
      count: logs.length,
      logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a logged meal
// @route   DELETE /api/food/log/:id
export const deleteMealLog = async (req, res, next) => {
  try {
    const log = await MealLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Meal log not found' });
    }

    res.json({
      success: true,
      message: 'Meal log removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 7-day weekly food calorie summary for charts
// @route   GET /api/food/weekly-summary
export const getWeeklyFoodSummary = async (req, res, next) => {
  try {
    const history = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayLogs = await MealLog.find({
        userId: req.user.id,
        date: dateStr
      });

      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      dayLogs.forEach(l => {
        const qty = l.foodItem.quantity || 1;
        calories += Math.round(l.foodItem.calories * qty);
        protein += Math.round(l.foodItem.protein * qty);
        carbs += Math.round(l.foodItem.carbs * qty);
        fat += Math.round(l.foodItem.fat * qty);
      });

      history.push({
        date: dateStr,
        day: dayName,
        calories,
        protein,
        carbs,
        fat,
        target: req.user.targetCalories || 2000
      });
    }

    res.json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};
