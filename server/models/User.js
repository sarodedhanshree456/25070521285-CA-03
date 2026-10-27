import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a secure password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    // Onboarding & Physical Metrics
    age: {
      type: Number,
      default: 24
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      default: 'male'
    },
    heightCm: {
      type: Number,
      default: 175
    },
    weightKg: {
      type: Number,
      default: 72
    },
    targetWeightKg: {
      type: Number,
      default: 68
    },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'],
      default: 'weight_loss'
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate'
    },
    dietaryPreference: {
      type: String,
      enum: ['vegetarian', 'vegan', 'non_vegetarian', 'eggetarian'],
      default: 'vegetarian'
    },
    allergies: [{
      type: String
    }],
    // Calculated Metabolic Metrics
    bmr: {
      type: Number,
      default: 1700
    },
    tdee: {
      type: Number,
      default: 2400
    },
    targetCalories: {
      type: Number,
      default: 1900
    },
    targetProtein: {
      type: Number,
      default: 145
    },
    targetCarbs: {
      type: Number,
      default: 195
    },
    targetFat: {
      type: Number,
      default: 55
    },
    waterTargetMl: {
      type: Number,
      default: 2500
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
