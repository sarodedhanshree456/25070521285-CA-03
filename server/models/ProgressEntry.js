import mongoose from 'mongoose';

const progressEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    weightKg: {
      type: Number
    },
    bodyFatPercent: {
      type: Number,
      default: null
    },
    measurements: {
      chestCm: { type: Number, default: 0 },
      waistCm: { type: Number, default: 0 },
      hipsCm: { type: Number, default: 0 },
      armsCm: { type: Number, default: 0 },
      thighsCm: { type: Number, default: 0 }
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

progressEntrySchema.pre('save', function (next) {
  if (this.weight && !this.weightKg) {
    this.weightKg = this.weight;
  } else if (this.weightKg && !this.weight) {
    this.weight = this.weightKg;
  }
  next();
});

const ProgressEntry = mongoose.model('ProgressEntry', progressEntrySchema);
export default ProgressEntry;
