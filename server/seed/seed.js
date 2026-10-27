import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Food from '../models/Food.js';
import Exercise from '../models/Exercise.js';
import User from '../models/User.js';
import MealLog from '../models/MealLog.js';
import WaterLog from '../models/WaterLog.js';
import ProgressEntry from '../models/ProgressEntry.js';
import DietPlan from '../models/DietPlan.js';
import WorkoutPlan from '../models/WorkoutPlan.js';
import { generateDeterministicDietPlan } from '../utils/mealPlanGenerator.js';
import { generateWorkoutSchedule } from '../utils/workoutGenerator.js';

dotenv.config();

const sampleFoods = [
  // Grains & Breads
  {
    name: 'Whole Wheat Roti (Chapati)',
    localName: 'Phulka / Roti',
    category: 'grains',
    servingSize: '1 medium roti (35g)',
    servingWeightGrams: 35,
    calories: 104,
    protein: 3.5,
    carbs: 20,
    fat: 0.8,
    fiber: 3.0,
    isVeg: true,
    isVegan: true,
    allergens: ['gluten']
  },
  {
    name: 'Steamed Basmati Rice',
    localName: 'Chawal',
    category: 'grains',
    servingSize: '1 bowl cooked (150g)',
    servingWeightGrams: 150,
    calories: 195,
    protein: 4.2,
    carbs: 43.5,
    fat: 0.6,
    fiber: 0.9,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Brown Rice',
    localName: 'Brown Chawal',
    category: 'grains',
    servingSize: '1 bowl cooked (150g)',
    servingWeightGrams: 150,
    calories: 168,
    protein: 3.8,
    carbs: 35,
    fat: 1.4,
    fiber: 2.8,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Rolled Oats (Porridge)',
    localName: 'Oats',
    category: 'grains',
    servingSize: '1 bowl prepared with water (50g dry)',
    servingWeightGrams: 50,
    calories: 190,
    protein: 6.8,
    carbs: 33.5,
    fat: 3.4,
    fiber: 5.3,
    isVeg: true,
    isVegan: true,
    allergens: ['gluten']
  },
  {
    name: 'Vegetable Poha',
    localName: 'Poha / Aval',
    category: 'grains',
    servingSize: '1 medium plate (150g)',
    servingWeightGrams: 150,
    calories: 220,
    protein: 4.5,
    carbs: 42,
    fat: 4.8,
    fiber: 3.2,
    isVeg: true,
    isVegan: true,
    allergens: ['nuts']
  },
  {
    name: 'Steamed Idli',
    localName: 'Idli',
    category: 'grains',
    servingSize: '2 medium idlis (100g)',
    servingWeightGrams: 100,
    calories: 140,
    protein: 4.0,
    carbs: 29.0,
    fat: 0.6,
    fiber: 1.8,
    isVeg: true,
    isVegan: true,
    allergens: []
  },

  // Pulses & Legumes
  {
    name: 'Yellow Moong Dal Tadka',
    localName: 'Dal Tadka',
    category: 'pulses',
    servingSize: '1 medium bowl (150g)',
    servingWeightGrams: 150,
    calories: 155,
    protein: 9.2,
    carbs: 22.0,
    fat: 3.5,
    fiber: 4.5,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Chana Masala (Chickpeas Curry)',
    localName: 'Chole / Chana',
    category: 'pulses',
    servingSize: '1 medium bowl (180g)',
    servingWeightGrams: 180,
    calories: 235,
    protein: 11.5,
    carbs: 35.0,
    fat: 5.8,
    fiber: 7.2,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Rajma Masala (Kidney Beans)',
    localName: 'Rajma Curry',
    category: 'pulses',
    servingSize: '1 medium bowl (180g)',
    servingWeightGrams: 180,
    calories: 225,
    protein: 12.0,
    carbs: 34.0,
    fat: 4.5,
    fiber: 8.0,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Roasted Chana (Bengal Gram)',
    localName: 'Bhuna Chana',
    category: 'pulses',
    servingSize: 'Handful (50g)',
    servingWeightGrams: 50,
    calories: 185,
    protein: 9.8,
    carbs: 28.5,
    fat: 3.2,
    fiber: 8.5,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Sattu Drink (Roasted Gram Flour)',
    localName: 'Sattu Sharbat',
    category: 'pulses',
    servingSize: '1 glass (40g powder in water)',
    servingWeightGrams: 40,
    calories: 164,
    protein: 10.2,
    carbs: 26.0,
    fat: 2.1,
    fiber: 7.0,
    isVeg: true,
    isVegan: true,
    allergens: []
  },

  // Dairy & Plant Alternatives
  {
    name: 'Fresh Paneer (Cottage Cheese)',
    localName: 'Paneer',
    category: 'dairy',
    servingSize: '100g raw cubes',
    servingWeightGrams: 100,
    calories: 265,
    protein: 18.5,
    carbs: 3.5,
    fat: 20.0,
    fiber: 0,
    isVeg: true,
    isVegan: false,
    allergens: ['dairy']
  },
  {
    name: 'Low-Fat Cow Milk',
    localName: 'Gai Ka Doodh',
    category: 'dairy',
    servingSize: '1 glass (250ml)',
    servingWeightGrams: 250,
    calories: 125,
    protein: 8.2,
    carbs: 12.5,
    fat: 3.8,
    fiber: 0,
    isVeg: true,
    isVegan: false,
    allergens: ['dairy']
  },
  {
    name: 'Plain Curd (Dahi)',
    localName: 'Dahi',
    category: 'dairy',
    servingSize: '1 medium bowl (150g)',
    servingWeightGrams: 150,
    calories: 95,
    protein: 5.5,
    carbs: 6.8,
    fat: 5.0,
    fiber: 0,
    isVeg: true,
    isVegan: false,
    allergens: ['dairy']
  },
  {
    name: 'Greek Yogurt (Hung Curd)',
    localName: 'Chakka / Greek Dahi',
    category: 'dairy',
    servingSize: '1 bowl (150g)',
    servingWeightGrams: 150,
    calories: 145,
    protein: 14.5,
    carbs: 6.0,
    fat: 6.5,
    fiber: 0,
    isVeg: true,
    isVegan: false,
    allergens: ['dairy']
  },
  {
    name: 'Tofu (Organic Soya Paneer)',
    localName: 'Soya Paneer',
    category: 'pulses',
    servingSize: '100g raw slab',
    servingWeightGrams: 100,
    calories: 144,
    protein: 15.5,
    carbs: 2.8,
    fat: 8.5,
    fiber: 2.1,
    isVeg: true,
    isVegan: true,
    allergens: ['soy']
  },
  {
    name: 'Soya Chunks (Mealmaker)',
    localName: 'Nutrela / Soya Badi',
    category: 'pulses',
    servingSize: '50g dry uncooked',
    servingWeightGrams: 50,
    calories: 172,
    protein: 26.0,
    carbs: 16.5,
    fat: 0.5,
    fiber: 6.5,
    isVeg: true,
    isVegan: true,
    allergens: ['soy']
  },

  // Poultry & Eggs
  {
    name: 'Whole Boiled Egg',
    localName: 'Ubla Anda',
    category: 'poultry',
    servingSize: '1 large egg (50g)',
    servingWeightGrams: 50,
    calories: 74,
    protein: 6.3,
    carbs: 0.4,
    fat: 5.0,
    fiber: 0,
    isVeg: false,
    isVegan: false,
    allergens: ['eggs']
  },
  {
    name: 'Egg Whites (Scrambled / Boiled)',
    localName: 'Ande Ki Safedi',
    category: 'poultry',
    servingSize: '3 egg whites (100g)',
    servingWeightGrams: 100,
    calories: 52,
    protein: 11.0,
    carbs: 0.7,
    fat: 0.2,
    fiber: 0,
    isVeg: false,
    isVegan: false,
    allergens: ['eggs']
  },
  {
    name: 'Grilled Chicken Breast',
    localName: 'Murgh Seena',
    category: 'poultry',
    servingSize: '100g cooked breast',
    servingWeightGrams: 100,
    calories: 165,
    protein: 31.0,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    isVeg: false,
    isVegan: false,
    allergens: []
  },

  // Vegetables & Fruits
  {
    name: 'Palak (Spinach Curry Base)',
    localName: 'Palak Sabzi',
    category: 'vegetables',
    servingSize: '1 bowl cooked (150g)',
    servingWeightGrams: 150,
    calories: 65,
    protein: 3.8,
    carbs: 6.2,
    fat: 3.0,
    fiber: 3.5,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Mixed Salad (Cucumber, Tomato, Carrot)',
    localName: 'Kachumber Salad',
    category: 'vegetables',
    servingSize: '1 large bowl (200g)',
    servingWeightGrams: 200,
    calories: 45,
    protein: 2.1,
    carbs: 9.5,
    fat: 0.3,
    fiber: 3.8,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Ripe Banana',
    localName: 'Kela',
    category: 'fruits',
    servingSize: '1 medium banana (118g)',
    servingWeightGrams: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fat: 0.3,
    fiber: 3.1,
    isVeg: true,
    isVegan: true,
    allergens: []
  },
  {
    name: 'Fresh Red Apple',
    localName: 'Seb',
    category: 'fruits',
    servingSize: '1 medium apple (150g)',
    servingWeightGrams: 150,
    calories: 82,
    protein: 0.4,
    carbs: 21.5,
    fat: 0.2,
    fiber: 4.4,
    isVeg: true,
    isVegan: true,
    allergens: []
  },

  // Healthy Fats & Nuts
  {
    name: 'Raw Almonds & Walnuts Mix',
    localName: 'Badaam & Akhrot',
    category: 'nuts_seeds',
    servingSize: 'Handful (30g)',
    servingWeightGrams: 30,
    calories: 185,
    protein: 5.5,
    carbs: 4.5,
    fat: 16.5,
    fiber: 3.0,
    isVeg: true,
    isVegan: true,
    allergens: ['nuts']
  },
  {
    name: 'Pure Desi Ghee',
    localName: 'Ghee',
    category: 'dairy',
    servingSize: '1 teaspoon (5g)',
    servingWeightGrams: 5,
    calories: 45,
    protein: 0,
    carbs: 0,
    fat: 5.0,
    fiber: 0,
    isVeg: true,
    isVegan: false,
    allergens: ['dairy']
  },
  {
    name: 'Natural Peanut Butter',
    localName: 'Peanut Butter',
    category: 'nuts_seeds',
    servingSize: '1 tablespoon (16g)',
    servingWeightGrams: 16,
    calories: 95,
    protein: 4.0,
    carbs: 3.2,
    fat: 8.0,
    fiber: 1.2,
    isVeg: true,
    isVegan: true,
    allergens: ['nuts']
  },
  {
    name: 'Whey Protein Isolate (Unflavored)',
    localName: 'Protein Powder',
    category: 'dairy',
    servingSize: '1 scoop (30g)',
    servingWeightGrams: 30,
    calories: 120,
    protein: 25.0,
    carbs: 1.5,
    fat: 0.8,
    fiber: 0,
    isVeg: true,
    isVegan: false,
    allergens: ['dairy']
  }
];

const sampleExercises = [
  {
    name: 'Flat Barbell Bench Press',
    targetMuscle: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on the bench with eyes directly under the racked bar.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Unrack the bar and stabilize over your upper chest.',
      'Lower the bar with controlled cadence until it gently touches mid-chest.',
      'Drive powerfully through your palms and extend elbows to lockout.'
    ],
    tips: [
      'Retract your scapulae (pull shoulder blades together) throughout the movement.',
      'Keep feet firmly planted on the floor for drive stability.'
    ],
    caloriesBurnedPerMin: 8.5
  },
  {
    name: 'Incline Dumbbell Press',
    targetMuscle: 'Chest',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    instructions: [
      'Set an adjustable bench to approximately 30-45 degrees.',
      'Sit back and kick dumbbells up onto your shoulders.',
      'Press dumbbells upwards along a slight inward arc without clanking them at the top.',
      'Lower under control until upper arms are parallel to the floor.'
    ],
    tips: [
      'Do not set bench higher than 45 degrees to avoid shifting emphasis to front delts.'
    ],
    caloriesBurnedPerMin: 8.0
  },
  {
    name: 'Standard Push-Ups',
    targetMuscle: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Assume a high plank position with hands slightly wider than shoulder-width.',
      'Keep core braced, glutes squeezed, and spine neutral.',
      'Lower your chest until 2 inches off the ground.',
      'Push back up forcefully.'
    ],
    tips: ['Avoid letting your lower back sag.'],
    caloriesBurnedPerMin: 7.0
  },
  {
    name: 'Conventional Deadlift',
    targetMuscle: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width apart, barbell over midfoot.',
      'Hinge at hips, grip bar outside your shins, chest up and lats engaged.',
      'Take a deep belly breath, pull slack out of the bar.',
      'Drive through your heels and stand tall with glutes contracted.'
    ],
    tips: ['Keep bar glued close to your body throughout the ascent.'],
    caloriesBurnedPerMin: 10.5
  },
  {
    name: 'Bent-Over Barbell Row',
    targetMuscle: 'Back',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge forward at the hips to a 45-degree torso angle.',
      'Grip bar with an overhand grip just outside knee width.',
      'Pull the bar toward your belly button, squeezing your lats.',
      'Lower under control to full arm extension.'
    ],
    tips: ['Do not use momentum or stand up as you pull.'],
    caloriesBurnedPerMin: 8.2
  },
  {
    name: 'Wide-Grip Lat Pulldown',
    targetMuscle: 'Back',
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Sit facing the cable machine with thighs locked under pads.',
      'Grip the wide bar with palms forward.',
      'Lean back slightly and pull bar down to upper chest.',
      'Slowly return the bar to full stretch at the top.'
    ],
    tips: ['Lead with your elbows pulling down and back.'],
    caloriesBurnedPerMin: 7.2
  },
  {
    name: 'Barbell Back Squat',
    targetMuscle: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Rest bar securely on upper traps (high bar) or rear delts (low bar).',
      'Step back, feet shoulder-width apart with toes turned 15-30 degrees out.',
      'Hinge hips back and bend knees, tracking knees in line with toes.',
      'Descend to parallel or below, then drive up through whole foot.'
    ],
    tips: ['Maintain a braced core and upright torso throughout.'],
    caloriesBurnedPerMin: 9.8
  },
  {
    name: 'Romanian Deadlift (RDL)',
    targetMuscle: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold barbell at hip height with slight knee bend.',
      'Push your hips backwards as far as possible while lowering the bar along your shins.',
      'Stop when you feel deep hamstring stretch (around mid-shin).',
      'Drive hips forward and squeeze glutes to return to standing.'
    ],
    tips: ['Do not bend knees further during descent; this is a pure hip hinge.'],
    caloriesBurnedPerMin: 8.0
  },
  {
    name: '45-Degree Leg Press',
    targetMuscle: 'Legs',
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Sit comfortably in machine with lower back firmly against pad.',
      'Place feet shoulder-width on the platform.',
      'Release safety handles and lower carriage until knees reach 90 degrees.',
      'Press through heels without locking knees at the top.'
    ],
    tips: ['Keep lower back pressed against pad to prevent spinal flexion.'],
    caloriesBurnedPerMin: 7.5
  },
  {
    name: 'Standing Overhead Barbell Press',
    targetMuscle: 'Shoulders',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Rerack bar at collarbone height. Grip bar shoulder-width.',
      'Squeeze glutes and brace core.',
      'Press the bar straight up overhead, moving head back slightly to clear the bar.',
      'Lock out overhead with bar centered directly over heels.'
    ],
    tips: ['Avoid overarching your lumbar spine.'],
    caloriesBurnedPerMin: 8.0
  },
  {
    name: 'Dumbbell Lateral Raise',
    targetMuscle: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    instructions: [
      'Stand tall holding light dumbbells at your sides.',
      'Raise arms out to the sides with slight bend in elbows.',
      'Lift until arms are parallel to the floor (shoulder height).',
      'Lower slowly over 2-3 seconds.'
    ],
    tips: ['Lead with elbows and avoid swinging your torso.'],
    caloriesBurnedPerMin: 6.0
  },
  {
    name: 'Face Pull with Rope',
    targetMuscle: 'Shoulders',
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Attach rope to cable pulley set at eye level.',
      'Step back, pull rope handles towards your ears while flaring elbows high.',
      'Externally rotate shoulders at peak contraction.',
      'Slowly return to start.'
    ],
    tips: ['Essential for shoulder health and rotator cuff balance.'],
    caloriesBurnedPerMin: 6.5
  },
  {
    name: 'Standing Barbell Biceps Curl',
    targetMuscle: 'Arms',
    equipment: 'Barbell',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding barbell with underhand shoulder-width grip.',
      'Keep elbows pinned at sides.',
      'Curl bar up toward shoulders, contracting biceps at the top.',
      'Lower smoothly to full extension.'
    ],
    tips: ['Do not sway your hips or lean backward.'],
    caloriesBurnedPerMin: 6.2
  },
  {
    name: 'Cable Triceps Rope Pushdown',
    targetMuscle: 'Arms',
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Attach rope to high pulley. Grip rope with neutral palms.',
      'Keep upper arms pinned to sides of ribcage.',
      'Extend elbows downwards, spreading rope tips apart at bottom.',
      'Pause and squeeze triceps before releasing.'
    ],
    tips: ['Only forearms should move; keep upper arms locked in place.'],
    caloriesBurnedPerMin: 6.0
  },
  {
    name: 'Forearm Plank Hold',
    targetMuscle: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Rest on forearms and toes with elbows directly below shoulders.',
      'Brace abdominal wall, squeeze glutes, and tuck pelvis slightly.',
      'Maintain a rigid straight line from head to heels for target duration.'
    ],
    tips: ['Breathe evenly; do not hold your breath.'],
    caloriesBurnedPerMin: 6.5
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitforge';
    console.log(`[FitForge Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[FitForge Seed] Connected. Clearing existing foods and exercises...');
    await Food.deleteMany({ isCustom: { $ne: true } });
    await Exercise.deleteMany({});

    console.log(`[FitForge Seed] Inserting ${sampleFoods.length} wholesome Indian & global food items...`);
    await Food.insertMany(sampleFoods);

    console.log(`[FitForge Seed] Inserting ${sampleExercises.length} library exercises...`);
    await Exercise.insertMany(sampleExercises);

    console.log('[FitForge Seed] Ensuring demo user exists (demo@fitforge.com / password123)...');
    let demoUser = await User.findOne({ email: 'demo@fitforge.com' });

    if (!demoUser) {
      demoUser = await User.create({
        name: 'Aaditya Gawarle',
        email: 'demo@fitforge.com',
        password: 'password123',
        age: 23,
        sex: 'male',
        heightCm: 178,
        weightKg: 72,
        targetWeightKg: 68,
        fitnessGoal: 'weight_loss',
        activityLevel: 'moderate',
        dietaryPreference: 'vegetarian',
        allergies: [],
        bmr: 1735,
        tdee: 2430,
        targetCalories: 1930,
        targetProtein: 155,
        targetCarbs: 205,
        targetFat: 55,
        waterTargetMl: 2700,
        onboardingCompleted: true
      });
    } else {
      demoUser.onboardingCompleted = true;
      demoUser.targetCalories = 1930;
      demoUser.targetProtein = 155;
      demoUser.targetCarbs = 205;
      demoUser.targetFat = 55;
      demoUser.waterTargetMl = 2700;
      await demoUser.save();
    }

    // Seed Diet Plan for Demo User
    await DietPlan.deleteMany({ userId: demoUser._id });
    const dietData = generateDeterministicDietPlan({
      name: `${demoUser.name}'s Vegetarian Fat Loss Plan`,
      dailyCalorieTarget: demoUser.targetCalories,
      targetMacros: {
        proteinG: demoUser.targetProtein,
        carbsG: demoUser.targetCarbs,
        fatG: demoUser.targetFat
      },
      dietaryPreference: 'vegetarian',
      allergies: []
    });
    await DietPlan.create({
      userId: demoUser._id,
      ...dietData
    });

    // Seed Workout Plan for Demo User
    await WorkoutPlan.deleteMany({ userId: demoUser._id });
    const workoutData = generateWorkoutSchedule('Push/Pull/Legs');
    await WorkoutPlan.create({
      userId: demoUser._id,
      ...workoutData
    });

    // Seed Progress Entries for Demo User
    const today = new Date().toISOString().split('T')[0];
    await ProgressEntry.deleteMany({ userId: demoUser._id });
    const progressSeed = [
      { date: '2026-09-15', weight: 75.5, weightKg: 75.5, notes: 'Starting FitForge journey.' },
      { date: '2026-09-22', weight: 74.8, weightKg: 74.8, notes: 'Felt great, diet adherence on point.' },
      { date: '2026-09-29', weight: 74.2, weightKg: 74.2, notes: 'Good energy during push workouts.' },
      { date: '2026-10-06', weight: 73.5, weightKg: 73.5, notes: 'Down 2kg milestone achieved!' },
      { date: '2026-10-13', weight: 73.0, weightKg: 73.0, notes: 'Strength holding steady on bench.' },
      { date: '2026-10-20', weight: 72.4, weightKg: 72.4, notes: 'Waist down 2cm.' },
      { date: today, weight: 72.0, weightKg: 72.0, notes: 'Currently 72kg, closing in on 68kg goal.' }
    ];
    for (const p of progressSeed) {
      await ProgressEntry.create({ ...p, userId: demoUser._id });
    }

    // Seed today's logged meals for demo user
    await MealLog.deleteMany({ userId: demoUser._id });
    await MealLog.create({
      userId: demoUser._id,
      date: today,
      mealType: 'breakfast',
      foodItem: {
        name: 'Rolled Oats (Porridge)',
        servingSize: '1 bowl',
        quantity: 1.5,
        calories: 285,
        protein: 10,
        carbs: 50,
        fat: 5
      }
    });
    await MealLog.create({
      userId: demoUser._id,
      date: today,
      mealType: 'lunch',
      foodItem: {
        name: 'Fresh Paneer (Cottage Cheese)',
        servingSize: '100g raw cubes',
        quantity: 1,
        calories: 265,
        protein: 18.5,
        carbs: 3.5,
        fat: 20
      }
    });
    await MealLog.create({
      userId: demoUser._id,
      date: today,
      mealType: 'lunch',
      foodItem: {
        name: 'Whole Wheat Roti (Chapati)',
        servingSize: '1 medium roti',
        quantity: 2,
        calories: 208,
        protein: 7,
        carbs: 40,
        fat: 1.6
      }
    });

    // Seed today's water intake for demo user
    await WaterLog.deleteMany({ userId: demoUser._id });
    await WaterLog.create({
      userId: demoUser._id,
      date: today,
      amountMl: 1250,
      goalMl: demoUser.waterTargetMl || 2700,
      entries: [
        { amountMl: 250, timestamp: new Date(Date.now() - 5 * 3600 * 1000) },
        { amountMl: 500, timestamp: new Date(Date.now() - 3 * 3600 * 1000) },
        { amountMl: 500, timestamp: new Date(Date.now() - 1 * 3600 * 1000) }
      ]
    });

    console.log('[FitForge Seed] Database successfully seeded with rich real-world fitness data!');
    process.exit(0);
  } catch (error) {
    console.error('[FitForge Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
