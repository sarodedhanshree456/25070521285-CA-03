import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './useAuth';

export const useFitnessData = () => {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState({
    todayMeals: { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, logs: [] },
    water: { amountMl: 0, goalMl: 3000, percentage: 0 },
    workoutPlan: null,
    progressSummary: null,
    weeklyFoodSummary: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFitnessData = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];

      // Concurrently fetch user fitness data
      const [mealsRes, waterRes, workoutRes, progressRes, weeklyRes] = await Promise.allSettled([
        api.get(`/food/logs?date=${today}`),
        api.get(`/water/today?date=${today}`),
        api.get('/workouts/current'),
        api.get('/progress/history?filter=month'),
        api.get('/food/weekly-summary')
      ]);

      const mealsData = mealsRes.status === 'fulfilled' && mealsRes.value.data.success ? mealsRes.value.data : { totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, logs: [] };
      const waterData = waterRes.status === 'fulfilled' && waterRes.value.data.success ? waterRes.value.data.water : { amountMl: 0, goalMl: 3000, percentage: 0 };
      const workoutData = workoutRes.status === 'fulfilled' && workoutRes.value.data.success ? workoutRes.value.data.plan : null;
      const progressData = progressRes.status === 'fulfilled' && progressRes.value.data.success ? progressRes.value.data.summary : null;
      const weeklyData = weeklyRes.status === 'fulfilled' && weeklyRes.value.data.success ? weeklyRes.value.data.history : [];

      setData({
        todayMeals: mealsData,
        water: waterData,
        workoutPlan: workoutData,
        progressSummary: progressData,
        weeklyFoodSummary: weeklyData
      });
    } catch (err) {
      console.error('[FitForge useFitnessData error]:', err);
      setError(err.message || 'Failed to load fitness data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFitnessData();
  }, [fetchFitnessData]);

  return {
    ...data,
    loading,
    error,
    refreshData: fetchFitnessData
  };
};
