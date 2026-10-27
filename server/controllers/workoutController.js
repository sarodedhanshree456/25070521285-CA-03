import WorkoutPlan from '../models/WorkoutPlan.js';
import WorkoutSession from '../models/WorkoutSession.js';
import { generateWorkoutSchedule } from '../utils/workoutGenerator.js';

// @desc    Get user's current workout routine & schedule
// @route   GET /api/workouts/current
export const getCurrentWorkoutPlan = async (req, res, next) => {
  try {
    let plan = await WorkoutPlan.findOne({ userId: req.user.id, isActive: true });

    if (!plan) {
      const generated = generateWorkoutSchedule('Push/Pull/Legs');
      plan = await WorkoutPlan.create({
        userId: req.user.id,
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

// @desc    Generate or change workout split routine
// @route   POST /api/workouts/generate
export const generateNewWorkoutPlan = async (req, res, next) => {
  try {
    const { splitType = 'Push/Pull/Legs' } = req.body;
    const generated = generateWorkoutSchedule(splitType);

    await WorkoutPlan.deleteMany({ userId: req.user.id });
    const plan = await WorkoutPlan.create({
      userId: req.user.id,
      ...generated
    });

    res.json({
      success: true,
      message: `${splitType} routine generated successfully`,
      plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a completed workout session with set-by-set details
// @route   POST /api/workouts/log
export const logWorkoutSession = async (req, res, next) => {
  try {
    const { routineName, durationMinutes, caloriesBurned, exercisesCompleted } = req.body;

    const session = await WorkoutSession.create({
      userId: req.user.id,
      routineName: routineName || 'Workout Routine',
      durationMinutes: Number(durationMinutes) || 45,
      caloriesBurned: Number(caloriesBurned) || 300,
      exercisesCompleted: exercisesCompleted || []
    });

    res.status(201).json({
      success: true,
      message: 'Workout session recorded successfully! Great effort!',
      session
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's past workout session history
// @route   GET /api/workouts/history
export const getWorkoutHistory = async (req, res, next) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user.id })
      .sort({ completedAt: -1 })
      .limit(30);

    const totalWorkouts = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalCaloriesBurned = sessions.reduce((acc, s) => acc + (s.caloriesBurned || 0), 0);

    res.json({
      success: true,
      stats: {
        totalWorkouts,
        totalMinutes,
        totalCaloriesBurned
      },
      count: sessions.length,
      sessions
    });
  } catch (error) {
    next(error);
  }
};
