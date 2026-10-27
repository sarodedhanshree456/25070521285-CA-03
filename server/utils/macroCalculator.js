/**
 * Mifflin-St Jeor Metabolic and Macro Calculations
 */

export const calculateBMR = ({ sex = 'male', weightKg, heightCm, age }) => {
  const w = Number(weightKg);
  const h = Number(heightCm);
  const a = Number(age);

  if (sex.toLowerCase() === 'female') {
    // Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
    return Math.round(10 * w + 6.25 * h - 5 * a - 161);
  }
  // Men: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
  return Math.round(10 * w + 6.25 * h - 5 * a + 5);
};

export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,        // Little or no exercise, desk job
  light: 1.375,          // Light exercise 1-3 days/week
  moderate: 1.55,        // Moderate exercise 3-5 days/week
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
  fitnessGoal = 'weight_loss',
  activityLevel = 'moderate'
}) => {
  const bmr = calculateBMR({ sex, weightKg, heightCm, age });
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories = tdee;

  if (fitnessGoal === 'weight_loss') {
    targetCalories = Math.max(1200, Math.round(tdee - 500));
  } else if (fitnessGoal === 'muscle_gain') {
    targetCalories = Math.round(tdee + 350);
  } else if (fitnessGoal === 'endurance') {
    targetCalories = Math.round(tdee + 150);
  } else {
    // maintenance
    targetCalories = tdee;
  }

  // Protein calculation: 1.8g to 2.2g per kg based on goal
  let proteinPerKg = 2.0;
  if (fitnessGoal === 'weight_loss') proteinPerKg = 2.2; // preserve lean mass
  if (fitnessGoal === 'maintenance') proteinPerKg = 1.8;

  const targetProtein = Math.round(Number(weightKg) * proteinPerKg);
  const proteinCalories = targetProtein * 4;

  // Fat calculation: 25% of total calories
  const fatCalories = targetCalories * 0.25;
  const targetFat = Math.round(fatCalories / 9);

  // Carbs calculation: remaining calories
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const targetCarbs = Math.round(remainingCalories / 4);

  // Recommended daily water: 35ml per kg of bodyweight
  const waterTargetMl = Math.max(2000, Math.round(Number(weightKg) * 35));

  return {
    bmr,
    tdee,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    waterTargetMl
  };
};
