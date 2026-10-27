/**
 * Rules-Based Clinical Fitness & Nutrition Assistant Engine
 */

const KNOWLEDGE_BASE = [
  {
    topic: 'Indian Protein Sources',
    keywords: ['protein', 'soya', 'paneer', 'veg protein', 'vegetarian protein', 'dal', 'sources', 'curd', 'whey'],
    answer: `Here are the top high-protein vegetarian and Indian staples to hit your daily macro goals:
1. **Soya Chunks / Mealmaker**: ~52g protein per 100g dry. The highest density plant protein available. Soak in boiling water and rinse thoroughly.
2. **Fresh Paneer (Cottage Cheese)**: ~18-20g protein per 100g. Great slow-digesting casein protein, ideal for dinner.
3. **Low-Fat Paneer / Tofu**: ~16-18g protein, significantly lower saturated fat.
4. **Greek Yogurt / Hung Curd**: ~10-12g protein per 100g. Excellent probiotic and gut-friendly snack.
5. **Lentils & Pulses (Moong, Chana, Rajma, Sattu)**: ~20-25g protein per 100g dry. Pair with whole wheat roti or brown rice to form complete amino acid chains.
6. **Eggs (if Eggetarian)**: ~6g protein per whole egg; ~3.6g protein per egg white.
7. **Whey Protein**: 24-27g pure bioavailable protein per scoop (30g).`
  },
  {
    topic: 'Mifflin-St Jeor Formula',
    keywords: ['mifflin', 'bmr', 'tdee', 'formula', 'calculation', 'metabolic', 'calories'],
    answer: `FitForge calculates your basal metabolism using the clinically validated Mifflin-St Jeor equation:
- **Men**: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
- **Women**: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161

**TDEE (Total Daily Energy Expenditure)** is obtained by multiplying BMR with your activity multiplier:
- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Highly Active: 1.725

For sustainable fat loss, we apply a moderate 500 kcal deficit, resulting in approximately 0.5kg of healthy fat loss per week.`
  },
  {
    topic: 'Fat Loss & Calorie Deficit',
    keywords: ['fat loss', 'lose weight', 'cutting', 'deficit', 'plateau', 'belly fat'],
    answer: `To break through fat loss plateaus:
1. **Accurate Tracking**: Weigh your food raw using a kitchen scale. Cooking oils, sauces, and ghee can add 200-400 untracked calories.
2. **Protein Prioritization**: Keep protein high (2.0-2.2g per kg of bodyweight). Protein has a 20-30% thermic effect of food (TEF) and preserves muscle mass.
3. **NEAT (Non-Exercise Activity Thermogenesis)**: Aim for 8,000 to 10,000 steps daily. Walking burns fat without generating systemic fatigue.
4. **Sleep & Stress**: Cortisol from chronic sleep deprivation (< 7 hours) causes water retention and spikes ghrelin (hunger hormone).`
  },
  {
    topic: 'Workout Splits & Rest Intervals',
    keywords: ['ppl', 'split', 'push pull legs', 'upper lower', 'rest', 'timer', 'sets', 'reps'],
    answer: `FitForge offers 4 scientifically designed training routines:
- **Push / Pull / Legs (PPL)**: Separates pushing muscles (chest/shoulders/triceps), pulling muscles (back/rear delts/biceps), and legs. Great for hypertrophy.
- **Upper / Lower**: 4-day split ideal for balancing heavy compound strength with recovery.
- **Full Body**: 3 days per week, perfect for beginners and time-constrained athletes.
- **Home Calisthenics**: Progressive bodyweight training requiring zero equipment.

**Rest Timer Guidelines**:
- Heavy Compound Lifts (Squat, Bench, Deadlift): 90-180 seconds.
- Accessory Isolation (Curls, Lateral Raises, Pushdowns): 45-60 seconds.`
  },
  {
    topic: 'Hydration Guidelines',
    keywords: ['water', 'hydration', 'fluid', 'glasses', 'drink', 'ml'],
    answer: `Hydration directly governs workout endurance, glycogen transport, and cognitive focus:
- Standard recommendation: **35ml per kg of body weight** (e.g. 70kg × 35 = ~2,450ml minimum).
- Add +500ml for every 45 minutes of intense sweating or resistance training.
- Drinking 500ml of cold water first thing in the morning boosts metabolic rate by ~24% for 60 minutes.`
  },
  {
    topic: 'Creatine & Pre-Workout',
    keywords: ['creatine', 'monohydrate', 'pre workout', 'caffeine', 'supplements'],
    answer: `**Creatine Monohydrate**:
- The most researched fitness supplement on earth. 
- Dosage: 3g to 5g daily, taken consistently at any time of day with water or carbohydrates.
- Increases intracellular phosphocreatine stores, directly improving 1-5 rep explosive power and strength.`
  }
];

export const askAssistant = async (req, res, next) => {
  try {
    const { question = '' } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please ask a fitness or nutrition question'
      });
    }

    const qLower = question.toLowerCase();

    // Match keywords against knowledge base
    let matchedTopic = null;
    let bestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (qLower.includes(kw)) score += 1;
      }
      if (score > bestScore) {
        bestScore = score;
        matchedTopic = item;
      }
    }

    let answer = '';
    let topic = 'General Fitness Guidance';

    if (matchedTopic && bestScore > 0) {
      topic = matchedTopic.topic;
      answer = matchedTopic.answer;
    } else {
      topic = 'Personalized Coaching Tips';
      answer = `To maximize your progress on FitForge:
1. Ensure your daily meals are logged inside the **Food Tracker** (/food-tracker).
2. Target your Mifflin-St Jeor daily calorie budget with at least 2.0g protein per kg.
3. Use the **Rest Timer** during your scheduled workout sets to keep training intensity high.
4. Log daily hydration using the **Water Tracker** to maintain metabolic efficiency.

Feel free to ask specifically about:
- Indian vegetarian protein sources (paneer, soya, lentils)
- Mifflin-St Jeor metabolic formulas
- Push/Pull/Legs vs Upper/Lower splits
- Overcoming fat loss plateaus`;
    }

    res.json({
      success: true,
      question,
      topic,
      engine: 'FitForge Rules & Clinical Knowledge Engine',
      answer,
      disclaimer: 'FitForge fitness suggestions are for educational guidance and do not constitute clinical medical diagnosis.'
    });
  } catch (error) {
    next(error);
  }
};
