import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      trim: true
    },
    targetMuscle: {
      type: String,
      enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'],
      required: true
    },
    equipment: {
      type: String,
      enum: ['Barbell', 'Dumbbell', 'Machine', 'Bodyweight', 'Cable', 'Kettlebell', 'None'],
      default: 'Bodyweight'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    instructions: [{
      type: String
    }],
    tips: [{
      type: String
    }],
    caloriesBurnedPerMin: {
      type: Number,
      default: 7.5
    },
    demoImageUrl: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);
export default Exercise;
