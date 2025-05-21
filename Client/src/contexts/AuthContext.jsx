import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getMe, logout as logoutService, login as loginService, register as registerService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMe();
      setUser(data?.user || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (userData) => {
    try {
      const { data } = await loginService(userData);
      setUser(data?.user || null);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await registerService(userData);
      await checkAuth();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
  try {
    await logoutService();
    setUser(null); 
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
};

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      logout,
      register,
      updateUser,
      refetchUser: checkAuth 
    }}>
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