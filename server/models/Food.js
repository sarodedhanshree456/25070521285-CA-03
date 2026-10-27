import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true
    },
    localName: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      enum: ['grains', 'pulses', 'dairy', 'poultry', 'vegetables', 'fruits', 'snacks', 'beverages', 'nuts_seeds'],
      default: 'grains'
    },
    servingSize: {
      type: String,
      required: [true, 'Serving size is required (e.g., 100g or 1 cup)']
    },
    servingWeightGrams: {
      type: Number,
      default: 100
    },
    calories: {
      type: Number,
      required: [true, 'Calories count is required'],
      min: 0
    },
    protein: {
      type: Number,
      required: [true, 'Protein content in grams is required'],
      min: 0
    },
    carbs: {
      type: Number,
      required: [true, 'Carbohydrates content in grams is required'],
      min: 0
    },
    fat: {
      type: Number,
      required: [true, 'Fat content in grams is required'],
      min: 0
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    isVegan: {
      type: Boolean,
      default: false
    },
    allergens: [{
      type: String
    }],
    isCustom: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

// Text index for search
foodSchema.index({ name: 'text', localName: 'text', category: 'text' });

const Food = mongoose.model('Food', foodSchema);
export default Food;
