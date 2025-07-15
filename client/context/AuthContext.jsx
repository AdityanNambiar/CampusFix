import React, { createContext, useState, useEffect, useCallback } from 'react';
import { setMemoryToken, setForceLogoutCb } from '../services/api';

export const AuthContext = createContext();

const STORAGE_KEY_USER = 'user';
const STORAGE_KEY_TOKEN = 'token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On app load, check for token in sessionStorage only
  useEffect(() => {
    let storedUser = sessionStorage.getItem(STORAGE_KEY_USER);
    let storedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN);
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setMemoryToken(token);
    setForceLogoutCb(forceLogout);
  }, [token]);

  // On login, always store in sessionStorage
  const login = useCallback((token, user) => {
    setToken(token);
    setUser(user);
    setError(null);
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    sessionStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  }, []);

  const forceLogout = useCallback(() => {
    logout();
    setError('Session expired. Please log in again.');
  }, [logout]);

  const redirectToDashboard = useCallback((navigate, role) => {
    if (role === 'Student') navigate('/student-dashboard');
    else if (role === 'Maintenance') navigate('/maintenance-dashboard');
    else if (role === 'Admin') navigate('/admin-dashboard');
    else navigate('/login');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      loading,
      setLoading,
      error,
      setError,
      forceLogout,
      redirectToDashboard,
    }}>
      {children}
    </AuthContext.Provider>
  );
};