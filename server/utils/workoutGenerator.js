/**
 * Intelligent Workout Schedule & Routine Generator
 */

export const generateWorkoutSchedule = (splitType = 'Push/Pull/Legs') => {
  const normalizedSplit = splitType.trim();

  if (normalizedSplit.toLowerCase().includes('upper') || normalizedSplit.toLowerCase().includes('lower')) {
    return {
      title: 'Upper / Lower Hypertrophy Split (4-Day)',
      splitType: 'Upper/Lower',
      description: '4-day split alternating heavy compound upper body days with dedicated lower body and core training.',
      schedule: [
        {
          dayName: 'Day 1: Upper Body Power',
          focus: 'Chest, Back, Shoulders, Arms',
          exercises: [
            { name: 'Barbell Bench Press', sets: 4, reps: '6-8', restSeconds: 120, targetMuscle: 'Chest' },
            { name: 'Bent-Over Barbell Row', sets: 4, reps: '8-10', restSeconds: 90, targetMuscle: 'Back' },
            { name: 'Overhead Shoulder Press', sets: 3, reps: '8-10', restSeconds: 90, targetMuscle: 'Shoulders' },
            { name: 'Lat Pulldown', sets: 3, reps: '10-12', restSeconds: 60, targetMuscle: 'Back' },
            { name: 'Incline Dumbbell Curl', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' },
            { name: 'Triceps Rope Pushdown', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' }
          ]
        },
        {
          dayName: 'Day 2: Lower Body & Core',
          focus: 'Quads, Hamstrings, Glutes, Abs',
          exercises: [
            { name: 'Barbell Back Squat', sets: 4, reps: '6-8', restSeconds: 120, targetMuscle: 'Legs' },
            { name: 'Romanian Deadlift (RDL)', sets: 3, reps: '8-10', restSeconds: 90, targetMuscle: 'Legs' },
            { name: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 90, targetMuscle: 'Legs' },
            { name: 'Lying Leg Curl', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Legs' },
            { name: 'Standing Calf Raises', sets: 4, reps: '15-20', restSeconds: 45, targetMuscle: 'Legs' },
            { name: 'Hanging Knee Raises', sets: 3, reps: '15-20', restSeconds: 60, targetMuscle: 'Core' }
          ]
        },
        {
          dayName: 'Day 3: Active Rest & Mobility',
          focus: 'Recovery, Walking & Stretching',
          exercises: [
            { name: 'Light Incline Treadmill Walk (25 mins)', sets: 1, reps: '25 min', restSeconds: 0, targetMuscle: 'Full Body' },
            { name: 'Foam Rolling & Hip Opener Stretches', sets: 3, reps: '10 reps', restSeconds: 30, targetMuscle: 'Legs' }
          ]
        },
        {
          dayName: 'Day 4: Upper Body Volume',
          focus: 'Chest, Lats, Delts, Arms',
          exercises: [
            { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', restSeconds: 90, targetMuscle: 'Chest' },
            { name: 'Seated Cable Row', sets: 4, reps: '10-12', restSeconds: 60, targetMuscle: 'Back' },
            { name: 'Dumbbell Lateral Raise', sets: 4, reps: '15-20', restSeconds: 45, targetMuscle: 'Shoulders' },
            { name: 'Chest Flyes (Machine)', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Chest' },
            { name: 'Hammer Curls', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' },
            { name: 'Overhead Dumbbell Triceps Extension', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' }
          ]
        }
      ]
    };
  }

  if (normalizedSplit.toLowerCase().includes('calisthenics') || normalizedSplit.toLowerCase().includes('home')) {
    return {
      title: 'Home Calisthenics & Bodyweight Split',
      splitType: 'Home Calisthenics',
      description: 'Zero gym equipment required. Master your own bodyweight with progressive overload principles.',
      schedule: [
        {
          dayName: 'Day 1: Bodyweight Push',
          focus: 'Chest, Shoulders, Triceps',
          exercises: [
            { name: 'Standard Push-Ups (or Diamond)', sets: 4, reps: '15-20', restSeconds: 60, targetMuscle: 'Chest' },
            { name: 'Pike Push-Ups (Shoulders)', sets: 4, reps: '10-12', restSeconds: 60, targetMuscle: 'Shoulders' },
            { name: 'Decline Push-Ups', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Chest' },
            { name: 'Chair Triceps Dips', sets: 4, reps: '15-20', restSeconds: 45, targetMuscle: 'Arms' },
            { name: 'Plank Hold', sets: 3, reps: '60s hold', restSeconds: 45, targetMuscle: 'Core' }
          ]
        },
        {
          dayName: 'Day 2: Bodyweight Pull & Legs',
          focus: 'Back, Quads, Hamstrings',
          exercises: [
            { name: 'Inverted Table Rows / Pull-Ups', sets: 4, reps: '8-12', restSeconds: 90, targetMuscle: 'Back' },
            { name: 'Bodyweight Deep Squats', sets: 4, reps: '25-30', restSeconds: 60, targetMuscle: 'Legs' },
            { name: 'Walking Lunges', sets: 3, reps: '20 steps', restSeconds: 60, targetMuscle: 'Legs' },
            { name: 'Single-Leg Glute Bridges', sets: 3, reps: '15 each', restSeconds: 45, targetMuscle: 'Legs' },
            { name: 'Superman Back Extensions', sets: 3, reps: '15 reps', restSeconds: 45, targetMuscle: 'Back' }
          ]
        }
      ]
    };
  }

  // Default: Push / Pull / Legs (PPL)
  return {
    title: 'Push / Pull / Legs Hypertrophy Split (6-Day)',
    splitType: 'Push/Pull/Legs',
    description: 'Gold-standard training split targeting muscle synergy, progressive overload, and maximum recovery.',
    schedule: [
      {
        dayName: 'Day 1: Push (Chest, Shoulders, Triceps)',
        focus: 'Chest, Shoulders & Triceps',
        exercises: [
          { name: 'Flat Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 90, targetMuscle: 'Chest' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 75, targetMuscle: 'Chest' },
          { name: 'Standing Overhead Barbell Press', sets: 3, reps: '8-10', restSeconds: 90, targetMuscle: 'Shoulders' },
          { name: 'Dumbbell Lateral Raises', sets: 4, reps: '15-20', restSeconds: 60, targetMuscle: 'Shoulders' },
          { name: 'Cable Triceps Rope Pushdown', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' },
          { name: 'Overhead Triceps Extension', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' }
        ]
      },
      {
        dayName: 'Day 2: Pull (Back, Rear Delts, Biceps)',
        focus: 'Back, Rear Delts & Biceps',
        exercises: [
          { name: 'Conventional Deadlift (or Rack Pull)', sets: 3, reps: '5-6', restSeconds: 150, targetMuscle: 'Back' },
          { name: 'Wide-Grip Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 75, targetMuscle: 'Back' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12', restSeconds: 75, targetMuscle: 'Back' },
          { name: 'Face Pulls with Rope', sets: 4, reps: '15-20', restSeconds: 60, targetMuscle: 'Shoulders' },
          { name: 'Standing Barbell Biceps Curl', sets: 3, reps: '10-12', restSeconds: 60, targetMuscle: 'Arms' },
          { name: 'Incline Dumbbell Hammer Curl', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Arms' }
        ]
      },
      {
        dayName: 'Day 3: Legs & Core',
        focus: 'Quads, Hamstrings, Glutes & Abs',
        exercises: [
          { name: 'Barbell Back Squats', sets: 4, reps: '8-10', restSeconds: 120, targetMuscle: 'Legs' },
          { name: 'Romanian Deadlift (RDL)', sets: 3, reps: '10-12', restSeconds: 90, targetMuscle: 'Legs' },
          { name: 'Leg Press (45 Degree)', sets: 3, reps: '12-15', restSeconds: 75, targetMuscle: 'Legs' },
          { name: 'Lying Leg Curl', sets: 3, reps: '12-15', restSeconds: 60, targetMuscle: 'Legs' },
          { name: 'Standing Calf Raise', sets: 4, reps: '15-20', restSeconds: 45, targetMuscle: 'Legs' },
          { name: 'Cable Woodchopper & Plank Hold', sets: 3, reps: '15 reps / 45s', restSeconds: 45, targetMuscle: 'Core' }
        ]
      },
      {
        dayName: 'Day 4: Rest & Active Recovery',
        focus: 'Mobility, Hydration & Tissue Repair',
        exercises: [
          { name: 'Light 30-min Outdoor Walk', sets: 1, reps: '30 min', restSeconds: 0, targetMuscle: 'Full Body' },
          { name: 'Full Body Static Stretching Routine', sets: 1, reps: '15 min', restSeconds: 0, targetMuscle: 'Full Body' }
        ]
      }
    ]
  };
};
