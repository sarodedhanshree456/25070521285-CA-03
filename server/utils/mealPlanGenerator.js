/**
 * 7-Day Indian & Global Meal Plan Generator
 */

export const generateDeterministicDietPlan = ({
  name = 'Custom Indian Fitness Diet',
  dailyCalorieTarget = 2000,
  targetMacros = { proteinG: 140, carbsG: 210, fatG: 55 },
  dietaryPreference = 'vegetarian',
  allergies = []
}) => {
  const isVeg = dietaryPreference === 'vegetarian' || dietaryPreference === 'vegan';
  const isVegan = dietaryPreference === 'vegan';
  const hasDairyAllergy = allergies.includes('dairy') || isVegan;
  const hasGlutenAllergy = allergies.includes('gluten');
  const hasEggAllergy = allergies.includes('eggs') || isVeg;

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Indian meal database
  const breakfastOptions = [
    {
      name: hasGlutenAllergy ? 'Vegetable Poha with Peanuts' : 'Rolled Oats Porridge with Chia Seeds',
      servingSize: '1 medium bowl (250g)',
      calories: 320,
      protein: 12,
      carbs: 52,
      fat: 7,
      isVeg: true,
      category: 'breakfast'
    },
    {
      name: !hasEggAllergy ? '3 Egg White Omelette with Multigrain Toast' : 'Steamed Idli (3 pcs) with Sambar & Coconut Chutney',
      servingSize: '1 plate',
      calories: 340,
      protein: 18,
      carbs: 48,
      fat: 8,
      isVeg: hasEggAllergy,
      category: 'breakfast'
    },
    {
      name: 'Moong Dal Chilla (2 pcs) with Mint Chutney',
      servingSize: '2 medium chillas',
      calories: 310,
      protein: 16,
      carbs: 44,
      fat: 6,
      isVeg: true,
      category: 'breakfast'
    },
    {
      name: 'Paneer Stuffed Besan Chilla',
      servingSize: '2 chillas (150g)',
      calories: 380,
      protein: 22,
      carbs: 36,
      fat: 14,
      isVeg: true,
      category: 'breakfast'
    }
  ];

  const lunchOptions = [
    {
      name: hasDairyAllergy 
        ? 'Chana Masala with Steamed Basmati Rice & Cucumber Salad'
        : 'Fresh Paneer Tikka with 2 Whole Wheat Phulkas & Green Salad',
      servingSize: '1 thali',
      calories: 550,
      protein: 24,
      carbs: 65,
      fat: 18,
      isVeg: true,
      category: 'lunch'
    },
    {
      name: (!isVeg && !hasEggAllergy)
        ? 'Grilled Chicken Breast with Steamed Rice & Dal Tadka'
        : 'Dal Makhani (low oil) with Jeera Rice & Mix Veg',
      servingSize: '1 plate',
      calories: 580,
      protein: 36,
      carbs: 62,
      fat: 16,
      isVeg: isVeg,
      category: 'lunch'
    },
    {
      name: 'Rajma Masala with Brown Rice & Onion Kachumber',
      servingSize: '1 bowl rajma + 1 bowl rice',
      calories: 520,
      protein: 20,
      carbs: 78,
      fat: 11,
      isVeg: true,
      category: 'lunch'
    },
    {
      name: 'Soya Chunks Bhurji with 2 Rotis & Curd',
      servingSize: '1 plate',
      calories: 490,
      protein: 32,
      carbs: 55,
      fat: 12,
      isVeg: true,
      category: 'lunch'
    }
  ];

  const dinnerOptions = [
    {
      name: (!isVeg)
        ? 'Tandoori Chicken Salad with Mint Yogurt Dressing'
        : 'Palak Paneer with 2 Whole Wheat Rotis',
      servingSize: '1 plate',
      calories: 480,
      protein: 30,
      carbs: 42,
      fat: 16,
      isVeg: isVeg,
      category: 'dinner'
    },
    {
      name: 'Yellow Dal Tadka with Steamed Brown Rice & Bhindi Masala',
      servingSize: '1 plate',
      calories: 460,
      protein: 18,
      carbs: 68,
      fat: 10,
      isVeg: true,
      category: 'dinner'
    },
    {
      name: 'Tofu & Vegetable Stir Fry with Garlic Brown Rice',
      servingSize: '1 bowl',
      calories: 440,
      protein: 22,
      carbs: 54,
      fat: 14,
      isVeg: true,
      category: 'dinner'
    },
    {
      name: 'Mixed Sprouts Khichdi with Roasted Papad & Tomato Raita',
      servingSize: '1 bowl (300g)',
      calories: 470,
      protein: 21,
      carbs: 70,
      fat: 9,
      isVeg: true,
      category: 'dinner'
    }
  ];

  const snackOptions = [
    {
      name: 'Roasted Chana & Handful of Almonds',
      servingSize: '50g mix',
      calories: 220,
      protein: 9,
      carbs: 22,
      fat: 10,
      isVeg: true,
      category: 'snacks'
    },
    {
      name: hasDairyAllergy ? 'Apple Slices with 1 tbsp Peanut Butter' : 'Greek Curd (Greek Yogurt) with Blueberries & Honey',
      servingSize: '150g',
      calories: 180,
      protein: 12,
      carbs: 20,
      fat: 5,
      isVeg: true,
      category: 'snacks'
    },
    {
      name: 'Sprouted Moong Salad with Lemon & Chaat Masala',
      servingSize: '1 bowl (150g)',
      calories: 160,
      protein: 10,
      carbs: 28,
      fat: 1.5,
      isVeg: true,
      category: 'snacks'
    }
  ];

  const days = daysOfWeek.map((dayName, idx) => {
    const b = breakfastOptions[idx % breakfastOptions.length];
    const l = lunchOptions[idx % lunchOptions.length];
    const d = dinnerOptions[idx % dinnerOptions.length];
    const s = snackOptions[idx % snackOptions.length];

    const dayCalories = b.calories + l.calories + d.calories + s.calories;
    const dayProtein = b.protein + l.protein + d.protein + s.protein;
    const dayCarbs = b.carbs + l.carbs + d.carbs + s.carbs;
    const dayFat = b.fat + l.fat + d.fat + s.fat;

    return {
      day: dayName,
      targetCalories: dailyCalorieTarget,
      totalCalories: dayCalories,
      totalProtein: dayProtein,
      totalCarbs: dayCarbs,
      totalFat: dayFat,
      meals: {
        breakfast: [b],
        lunch: [l],
        dinner: [d],
        snacks: [s]
      }
    };
  });

  return {
    name: name || 'FitForge Custom Nutrition Plan',
    dailyCalorieTarget,
    targetMacros,
    dietaryPreference,
    days
  };
};
