import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'snacks'],
      required: true
    },
    foodItem: {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food',
        default: null
      },
      name: {
        type: String,
        required: true
      },
      servingSize: {
        type: String,
        default: '1 serving'
      },
      quantity: {
        type: Number,
        default: 1,
        min: 0.1
      },
      calories: {
        type: Number,
        required: true
      },
      protein: {
        type: Number,
        default: 0
      },
      carbs: {
        type: Number,
        default: 0
      },
      fat: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

const MealLog = mongoose.model('MealLog', mealLogSchema);
export default MealLog;
