import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DietPlan from './pages/DietPlan';
import Workouts from './pages/Workouts';
import WorkoutDetail from './pages/WorkoutDetail';
import FoodTracker from './pages/FoodTracker';
import ProgressTracker from './pages/ProgressTracker';
import WaterTracker from './pages/WaterTracker';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ProfileSettings from './pages/ProfileSettings';
import Assistant from './pages/Assistant';

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Pages that don't need the dashboard sidebar (Landing, auth forms, onboarding)
  const isAuthOrLanding = ['/', '/login', '/signup', '/forgot-password', '/onboarding'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-password');

  const showSidebar = isAuthenticated && !isAuthOrLanding && user?.onboardingCompleted;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100">
      <Navbar />
      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 w-full ${showSidebar ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto' : ''}`}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ForgotPassword />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />

              {/* Onboarding Wizard (Requires Auth, but onboarding not yet finished) */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireOnboarding={false}>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />

              {/* Protected Core Fitness Platform Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diet-plan"
                element={
                  <ProtectedRoute>
                    <DietPlan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workouts"
                element={
                  <ProtectedRoute>
                    <Workouts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workouts/:id"
                element={
                  <ProtectedRoute>
                    <WorkoutDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/food-tracker"
                element={
                  <ProtectedRoute>
                    <FoodTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <ProgressTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/water"
                element={
                  <ProtectedRoute>
                    <WaterTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assistant"
                element={
                  <ProtectedRoute>
                    <Assistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
