import Exercise from '../models/Exercise.js';

// @desc    Get all library exercises with filters
// @route   GET /api/exercises
export const getAllExercises = async (req, res, next) => {
  try {
    const { targetMuscle, equipment, difficulty, search } = req.query;
    const filter = {};

    if (targetMuscle && targetMuscle !== 'All') {
      filter.targetMuscle = targetMuscle;
    }

    if (equipment && equipment !== 'All') {
      filter.equipment = equipment;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    const exercises = await Exercise.find(filter).sort({ targetMuscle: 1, name: 1 });

    res.json({
      success: true,
      count: exercises.length,
      exercises
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single exercise details
// @route   GET /api/exercises/:id
export const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    res.json({
      success: true,
      exercise
    });
  } catch (error) {
    next(error);
  }
};
