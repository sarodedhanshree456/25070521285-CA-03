import mongoose from 'mongoose';

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  servingSize: { type: String, default: '1 serving' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  isVeg: { type: Boolean, default: true },
  category: { type: String, default: 'meal' }
});

const dayMealSchema = new mongoose.Schema({
  day: { type: String, required: true },
  targetCalories: { type: Number, default: 2000 },
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFat: { type: Number, default: 0 },
  meals: {
    breakfast: [mealItemSchema],
    lunch: [mealItemSchema],
    dinner: [mealItemSchema],
    snacks: [mealItemSchema]
  }
});

const dietPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    name: {
      type: String,
      default: 'FitForge Custom Nutrition Plan'
    },
    dailyCalorieTarget: {
      type: Number,
      required: true
    },
    targetMacros: {
      proteinG: { type: Number, default: 140 },
      carbsG: { type: Number, default: 210 },
      fatG: { type: Number, default: 55 }
    },
    dietaryPreference: {
      type: String,
      default: 'vegetarian'
    },
    days: [dayMealSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);
export default DietPlan;
