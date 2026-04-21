import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // Clear corrupted persisted state to avoid rendering a blank app.
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (payload) => {
    const response = await loginUser(payload);
    setToken(response.access_token);
    setUser(response.user);
    return response;
  };

  const register = async (payload) => registerUser(payload);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, register, logout, isAuthenticated: Boolean(token) }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
