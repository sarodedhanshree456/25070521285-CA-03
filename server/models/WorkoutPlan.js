import mongoose from 'mongoose';

const workoutExerciseItemSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  sets: {
    type: Number,
    default: 3
  },
  reps: {
    type: String,
    default: '10-12'
  },
  restSeconds: {
    type: Number,
    default: 60
  },
  targetMuscle: {
    type: String,
    default: 'Full Body'
  }
});

const workoutDayScheduleSchema = new mongoose.Schema({
  dayName: {
    type: String,
    required: true
  },
  focus: {
    type: String,
    required: true
  },
  exercises: [workoutExerciseItemSchema]
});

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    splitType: {
      type: String,
      enum: ['Push/Pull/Legs', 'Upper/Lower', 'Full Body', 'Home Calisthenics', 'Custom'],
      default: 'Push/Pull/Legs'
    },
    description: {
      type: String,
      default: ''
    },
    schedule: [workoutDayScheduleSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export default WorkoutPlan;
