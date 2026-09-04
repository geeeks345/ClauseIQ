import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('clauseiq_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('clauseiq_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token;
  const role = user?.role || 'user';
  const isAdmin = role === 'admin';
  const isReviewer = role === 'legal_reviewer' || role === 'admin';

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', credentials);
      const { user: userData, token: tokenData } = res.data.data;
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('clauseiq_user', JSON.stringify(userData));
      localStorage.setItem('clauseiq_token', tokenData);
      setLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', userData);
      const { user: newUser, token: tokenData } = res.data.data;
      setUser(newUser);
      setToken(tokenData);
      localStorage.setItem('clauseiq_user', JSON.stringify(newUser));
      localStorage.setItem('clauseiq_token', tokenData);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('clauseiq_user');
    localStorage.removeItem('clauseiq_token');
  };

  const clearError = () => setError(null);

  const updateCurrentUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('clauseiq_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin,
        isReviewer,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
