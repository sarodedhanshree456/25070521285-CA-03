import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fitforge_super_secure_jwt_secret_key_2026_platform',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        onboardingCompleted: user.onboardingCompleted,
        fitnessGoal: user.fitnessGoal,
        targetCalories: user.targetCalories
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sign in user & get token
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        sex: user.sex,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        targetWeightKg: user.targetWeightKg,
        fitnessGoal: user.fitnessGoal,
        activityLevel: user.activityLevel,
        dietaryPreference: user.dietaryPreference,
        allergies: user.allergies,
        bmr: user.bmr,
        tdee: user.tdee,
        targetCalories: user.targetCalories,
        targetProtein: user.targetProtein,
        targetCarbs: user.targetCarbs,
        targetFat: user.targetFat,
        waterTargetMl: user.waterTargetMl,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User record not found'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - token generation
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      // Don't leak registered emails for security
      return res.json({
        success: true,
        message: 'If that email address exists in our database, a password reset link has been dispatched.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: 'Password reset token generated successfully. In development, use this link to reset password.',
      resetToken,
      resetUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password successfully changed! You are now logged in.',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};
