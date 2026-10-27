import mongoose from 'mongoose';

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkoutPlan',
      default: null
    },
    routineName: {
      type: String,
      required: true
    },
    durationMinutes: {
      type: Number,
      default: 45
    },
    caloriesBurned: {
      type: Number,
      default: 320
    },
    exercisesCompleted: [
      {
        name: { type: String, required: true },
        setsCompleted: [
          {
            setNumber: { type: Number, required: true },
            weightKg: { type: Number, default: 0 },
            reps: { type: Number, required: true }
          }
        ]
      }
    ],
    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);
export default WorkoutSession;
