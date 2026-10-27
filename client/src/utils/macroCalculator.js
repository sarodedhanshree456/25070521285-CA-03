/**
 * Mifflin-St Jeor Metabolic and Macro Calculations (Client Side)
 */

export const calculateBMR = ({ sex = 'male', weightKg, heightCm, age }) => {
  const w = Number(weightKg);
  const h = Number(heightCm);
  const a = Number(age);

  if (sex && sex.toLowerCase() === 'female') {
    // Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
    return Math.round(10 * w + 6.25 * h - 5 * a - 161);
  }
  // Men: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
  return Math.round(10 * w + 6.25 * h - 5 * a + 5);
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,        // Little or no exercise, desk job
  light: 1.375,          // Light exercise 1-3 days/week
  lightly_active: 1.375,
  moderate: 1.55,        // Moderate exercise 3-5 days/week
  moderately_active: 1.55,
  active: 1.725,         // Hard exercise 6-7 days/week
  very_active: 1.9       // Very hard exercise, physical job or 2x training
};

export const calculateTDEE = (bmr, activityLevel = 'moderate') => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

export const calculateMacroTargets = ({
  sex = 'male',
  weightKg,
  heightCm,
  age,
  fitnessGoal = 'fat_loss',
  activityLevel = 'moderate'
}) => {
  const bmr = calculateBMR({ sex, weightKg, heightCm, age });
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories = tdee;

  if (fitnessGoal === 'fat_loss' || fitnessGoal === 'weight_loss') {
    targetCalories = Math.max(1200, Math.round(tdee - 400));
  } else if (fitnessGoal === 'muscle_gain') {
    targetCalories = Math.round(tdee + 350);
  } else if (fitnessGoal === 'endurance') {
    targetCalories = Math.round(tdee + 150);
  } else {
    targetCalories = tdee;
  }

  let proteinPerKg = 2.0;
  if (fitnessGoal === 'fat_loss' || fitnessGoal === 'weight_loss') proteinPerKg = 2.2;
  if (fitnessGoal === 'maintenance') proteinPerKg = 1.8;

  const targetProtein = Math.round(Number(weightKg) * proteinPerKg);
  const proteinCalories = targetProtein * 4;

  const fatPercentage = 0.25;
  const fatCalories = targetCalories * fatPercentage;
  const targetFat = Math.round(fatCalories / 9);

  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const targetCarbs = Math.round(remainingCalories / 4);

  return {
    bmr,
    tdee,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat
  };
};
