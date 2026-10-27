import User from '../models/User.js';
import DietPlan from '../models/DietPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import MealLog from '../models/MealLog.js';
import WaterLog from '../models/WaterLog.js';
import ProgressEntry from '../models/ProgressEntry.js';
import WorkoutSession from '../models/WorkoutSession.js';
import { calculateMacroTargets } from '../utils/macroCalculator.js';
import { generateDeterministicDietPlan } from '../utils/mealPlanGenerator.js';
import { generateWorkoutSchedule } from '../utils/workoutGenerator.js';

// @desc    Get user profile
// @route   GET /api/user/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile & recalculate metabolic metrics
// @route   PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      age,
      sex,
      heightCm,
      weightKg,
      targetWeightKg,
      fitnessGoal,
      activityLevel,
      dietaryPreference,
      allergies
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (age) user.age = Number(age);
    if (sex) user.sex = sex;
    if (heightCm) user.heightCm = Number(heightCm);
    if (weightKg) user.weightKg = Number(weightKg);
    if (targetWeightKg) user.targetWeightKg = Number(targetWeightKg);
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;
    if (activityLevel) user.activityLevel = activityLevel;
    if (dietaryPreference) user.dietaryPreference = dietaryPreference;
    if (allergies) user.allergies = allergies;

    // Recalculate Mifflin-St Jeor metrics
    const metrics = calculateMacroTargets({
      sex: user.sex,
      weightKg: user.weightKg,
      heightCm: user.heightCm,
      age: user.age,
      fitnessGoal: user.fitnessGoal,
      activityLevel: user.activityLevel
    });

    user.bmr = metrics.bmr;
    user.tdee = metrics.tdee;
    user.targetCalories = metrics.targetCalories;
    user.targetProtein = metrics.targetProtein;
    user.targetCarbs = metrics.targetCarbs;
    user.targetFat = metrics.targetFat;
    user.waterTargetMl = metrics.waterTargetMl;

    await user.save();

    res.json({
      success: true,
      message: 'Profile & metabolic metrics updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete 5-step onboarding wizard
// @route   POST /api/user/onboarding
export const completeOnboarding = async (req, res, next) => {
  try {
    const {
      age,
      sex,
      heightCm,
      weightKg,
      targetWeightKg,
      fitnessGoal,
      activityLevel,
      dietaryPreference,
      allergies,
      workoutSplit
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.age = Number(age) || user.age;
    user.sex = sex || user.sex;
    user.heightCm = Number(heightCm) || user.heightCm;
    user.weightKg = Number(weightKg) || user.weightKg;
    user.targetWeightKg = Number(targetWeightKg) || user.targetWeightKg;
    user.fitnessGoal = fitnessGoal || user.fitnessGoal;
    user.activityLevel = activityLevel || user.activityLevel;
    user.dietaryPreference = dietaryPreference || user.dietaryPreference;
    user.allergies = allergies || user.allergies;

    // Metabolic calculations
    const metrics = calculateMacroTargets({
      sex: user.sex,
      weightKg: user.weightKg,
      heightCm: user.heightCm,
      age: user.age,
      fitnessGoal: user.fitnessGoal,
      activityLevel: user.activityLevel
    });

    user.bmr = metrics.bmr;
    user.tdee = metrics.tdee;
    user.targetCalories = metrics.targetCalories;
    user.targetProtein = metrics.targetProtein;
    user.targetCarbs = metrics.targetCarbs;
    user.targetFat = metrics.targetFat;
    user.waterTargetMl = metrics.waterTargetMl;
    user.onboardingCompleted = true;

    await user.save();

    // Generate and persist custom Diet Plan
    const dietData = generateDeterministicDietPlan({
      name: `${user.name}'s ${user.dietaryPreference.charAt(0).toUpperCase() + user.dietaryPreference.slice(1)} Nutrition Plan`,
      dailyCalorieTarget: user.targetCalories,
      targetMacros: {
        proteinG: user.targetProtein,
        carbsG: user.targetCarbs,
        fatG: user.targetFat
      },
      dietaryPreference: user.dietaryPreference,
      allergies: user.allergies
    });

    await DietPlan.deleteMany({ userId: user._id });
    await DietPlan.create({
      userId: user._id,
      ...dietData
    });

    // Generate and persist custom Workout Plan
    const workoutData = generateWorkoutSchedule(workoutSplit || 'Push/Pull/Legs');
    await WorkoutPlan.deleteMany({ userId: user._id });
    await WorkoutPlan.create({
      userId: user._id,
      ...workoutData
    });

    // Initialize first Progress entry
    const today = new Date().toISOString().split('T')[0];
    await ProgressEntry.findOneAndUpdate(
      { userId: user._id, date: today },
      { userId: user._id, date: today, weight: user.weightKg, weightKg: user.weightKg, notes: 'Starting weight from onboarding.' },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Onboarding completed successfully! Custom fitness & diet plans generated.',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and cascade delete all personal records
// @route   DELETE /api/user/account
export const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Promise.all([
      User.findByIdAndDelete(userId),
      DietPlan.deleteMany({ userId }),
      WorkoutPlan.deleteMany({ userId }),
      MealLog.deleteMany({ userId }),
      WaterLog.deleteMany({ userId }),
      ProgressEntry.deleteMany({ userId }),
      WorkoutSession.deleteMany({ userId })
    ]);

    res.json({
      success: true,
      message: 'Your FitForge account and all personal fitness records have been permanently erased.'
    });
  } catch (error) {
    next(error);
  }
};
