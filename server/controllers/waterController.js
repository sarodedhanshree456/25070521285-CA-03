import WaterLog from '../models/WaterLog.js';
import User from '../models/User.js';

// @desc    Add water intake (+150ml, +250ml, +500ml, etc.)
// @route   POST /api/water/add
export const addWater = async (req, res, next) => {
  try {
    const { amountMl = 250, date } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const logDate = date || today;

    const user = await User.findById(req.user.id);
    const goalMl = user?.waterTargetMl || 2500;

    let waterLog = await WaterLog.findOne({
      userId: req.user.id,
      date: logDate
    });

    if (!waterLog) {
      waterLog = new WaterLog({
        userId: req.user.id,
        date: logDate,
        amountMl: Number(amountMl),
        goalMl,
        entries: [{ amountMl: Number(amountMl), timestamp: new Date() }]
      });
    } else {
      waterLog.amountMl += Number(amountMl);
      waterLog.entries.push({ amountMl: Number(amountMl), timestamp: new Date() });
    }

    await waterLog.save();

    const percentage = Math.min(100, Math.round((waterLog.amountMl / waterLog.goalMl) * 100));

    res.json({
      success: true,
      message: `${amountMl}ml water logged successfully!`,
      water: {
        amountMl: waterLog.amountMl,
        goalMl: waterLog.goalMl,
        percentage,
        date: waterLog.date,
        entries: waterLog.entries
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's water status
// @route   GET /api/water/today
export const getTodayWater = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const date = req.query.date || today;

    const user = await User.findById(req.user.id);
    const goalMl = user?.waterTargetMl || 2500;

    let waterLog = await WaterLog.findOne({
      userId: req.user.id,
      date
    });

    if (!waterLog) {
      return res.json({
        success: true,
        water: {
          amountMl: 0,
          goalMl,
          percentage: 0,
          date,
          entries: []
        }
      });
    }

    const percentage = Math.min(100, Math.round((waterLog.amountMl / waterLog.goalMl) * 100));

    res.json({
      success: true,
      water: {
        amountMl: waterLog.amountMl,
        goalMl: waterLog.goalMl,
        percentage,
        date: waterLog.date,
        entries: waterLog.entries
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 7-day water intake chart data
// @route   GET /api/water/weekly
export const getWeeklyWater = async (req, res, next) => {
  try {
    const history = [];
    const today = new Date();
    const user = await User.findById(req.user.id);
    const goalMl = user?.waterTargetMl || 2500;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const log = await WaterLog.findOne({
        userId: req.user.id,
        date: dateStr
      });

      const amountMl = log ? log.amountMl : 0;
      const percentage = Math.min(100, Math.round((amountMl / goalMl) * 100));

      history.push({
        date: dateStr,
        day: dayName,
        amountMl,
        goalMl,
        percentage
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

// @desc    Reset daily water log
// @route   POST /api/water/reset
export const resetWater = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const date = req.body.date || today;

    await WaterLog.findOneAndUpdate(
      { userId: req.user.id, date },
      { amountMl: 0, entries: [] }
    );

    res.json({
      success: true,
      message: 'Water intake reset for today'
    });
  } catch (error) {
    next(error);
  }
};
