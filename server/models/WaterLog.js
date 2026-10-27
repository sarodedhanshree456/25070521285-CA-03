import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema(
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
    amountMl: {
      type: Number,
      default: 0,
      min: 0
    },
    goalMl: {
      type: Number,
      default: 2500
    },
    entries: [
      {
        amountMl: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

// Compound index for unique user-date
waterLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const WaterLog = mongoose.model('WaterLog', waterLogSchema);
export default WaterLog;
