import ProgressEntry from '../models/ProgressEntry.js';
import User from '../models/User.js';

// @desc    Log a weight & body measurements entry
// @route   POST /api/progress/log
export const logProgress = async (req, res, next) => {
  try {
    const { date, weight, bodyFatPercent, measurements, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const weightVal = Number(weight);
    if (!weightVal) {
      return res.status(400).json({ success: false, message: 'Please provide a valid weight value in kg' });
    }

    const entryDate = date || today;

    const entry = await ProgressEntry.findOneAndUpdate(
      { userId: req.user.id, date: entryDate },
      {
        userId: req.user.id,
        date: entryDate,
        weight: weightVal,
        weightKg: weightVal,
        bodyFatPercent: bodyFatPercent ? Number(bodyFatPercent) : null,
        measurements: measurements || {},
        notes: notes || ''
      },
      { upsert: true, new: true }
    );

    // Update current weight in user model
    await User.findByIdAndUpdate(req.user.id, { weightKg: weightVal });

    res.status(201).json({
      success: true,
      message: 'Progress recorded successfully',
      entry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress history & analytical summaries
// @route   GET /api/progress/history
export const getProgressHistory = async (req, res, next) => {
  try {
    const { filter = 'all' } = req.query;
    let limit = 100;
    if (filter === 'week') limit = 7;
    if (filter === 'month') limit = 30;

    const entries = await ProgressEntry.find({ userId: req.user.id })
      .sort({ date: 1 })
      .limit(limit);

    const user = await User.findById(req.user.id);
    const startWeight = entries.length > 0 ? entries[0].weight : (user?.weightKg || 70);
    const currentWeight = entries.length > 0 ? entries[entries.length - 1].weight : (user?.weightKg || 70);
    const targetWeight = user?.targetWeightKg || 68;
    const heightM = (user?.heightCm || 175) / 100;
    const bmi = +(currentWeight / (heightM * heightM)).toFixed(1);

    const totalWeightToLose = Math.abs(startWeight - targetWeight);
    const weightLostSoFar = Math.abs(startWeight - currentWeight);
    const percentAchieved = totalWeightToLose > 0
      ? Math.min(100, Math.round((weightLostSoFar / totalWeightToLose) * 100))
      : 100;

    res.json({
      success: true,
      count: entries.length,
      summary: {
        startWeight,
        currentWeight,
        targetWeight,
        weightChange: +(currentWeight - startWeight).toFixed(1),
        bmi,
        percentAchieved,
        streakDays: Math.min(entries.length, 14)
      },
      entries
    });
  } catch (error) {
    next(error);
  }
};
