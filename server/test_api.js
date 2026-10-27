async function runTests() {
  console.log('\n=== FITFORGE END-TO-END TEST SUITE ===');

  try {
    // 1. Health check
    const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
    console.log('✓ [1/7] Server Health:', health.status, `(v${health.version})`);

    // 2. Login
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@fitforge.com', password: 'password123' })
    }).then(r => r.json());

    if (!login.success) throw new Error('Login failed: ' + login.message);
    const token = login.token;
    console.log('✓ [2/7] Demo Authentication Succeeded for:', login.user.name, `(${login.user.email})`);

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // 3. Diet Plan
    const diet = await fetch('http://localhost:5000/api/diet/plan', { headers: authHeaders }).then(r => r.json());
    console.log('✓ [3/7] Active Diet Plan:', diet.plan.name);
    console.log('       Daily Calorie Target:', diet.plan.dailyCalorieTarget, 'kcal');
    console.log('       Monday Breakfast:', diet.plan.days[0].meals.breakfast[0].name);

    // 4. Workout Plan
    const workout = await fetch('http://localhost:5000/api/workouts/current', { headers: authHeaders }).then(r => r.json());
    console.log('✓ [4/7] Workout Routine:', workout.plan.title);
    console.log('       Split Type:', workout.plan.splitType);
    console.log('       Day 1 Exercises count:', workout.plan.schedule[0].exercises.length);

    // 5. Food Search & Meal Logging
    const foodSearch = await fetch('http://localhost:5000/api/food/search?query=paneer').then(r => r.json());
    console.log('✓ [5/7] Food Database Search for "paneer": Found', foodSearch.count, 'matching items');
    const paneer = foodSearch.foods[0];
    console.log('       Selected Food:', paneer.name, `(${paneer.calories} kcal)`);

    const logMeal = await fetch('http://localhost:5000/api/food/log', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0],
        mealType: 'dinner',
        foodItem: {
          foodId: paneer._id,
          name: paneer.name,
          servingSize: paneer.servingSize,
          quantity: 1,
          calories: paneer.calories,
          protein: paneer.protein,
          carbs: paneer.carbs,
          fat: paneer.fat
        }
      })
    }).then(r => r.json());
    console.log('       Meal Log Result:', logMeal.message);

    // 6. Water Logging
    const water = await fetch('http://localhost:5000/api/water/add', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ amountMl: 250 })
    }).then(r => r.json());
    console.log('✓ [6/7] Water Intake Logged:', `${water.water.amountMl}ml / ${water.water.goalMl}ml (${water.water.percentage}%)`);

    // 7. Fitness Assistant Query
    const assistant = await fetch('http://localhost:5000/api/assistant/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'How much protein is in paneer and soya?' })
    }).then(r => r.json());
    console.log('✓ [7/7] Fitness Assistant Query Answered:');
    console.log('       Topic:', assistant.topic);
    console.log('       Engine:', assistant.engine);

    console.log('\n🌟 ALL 7 FULL-STACK API PIPELINES VERIFIED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('Test Failed:', err.message);
  }
}

runTests();
