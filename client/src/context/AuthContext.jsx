import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fitforge_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('fitforge_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Re-verify session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('fitforge_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('fitforge_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[FitForge] Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('fitforge_token', receivedToken);
        localStorage.setItem('fitforge_user', JSON.stringify(receivedUser));
        return { success: true, user: receivedUser };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to sign in. Please verify your credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const loginDemo = async () => {
    return login('demo@fitforge.com', 'password123');
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('fitforge_token', receivedToken);
        localStorage.setItem('fitforge_user', JSON.stringify(receivedUser));
        return { success: true, user: receivedUser };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fitforge_token');
    localStorage.removeItem('fitforge_user');
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('fitforge_user', JSON.stringify(updatedUser));
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    loginDemo,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
