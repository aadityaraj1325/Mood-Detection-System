import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pm_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrateUser() {
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const profile = await getMe();
        if (mounted) {
          setUser(profile);
        }
      } catch {
        if (mounted) {
          setToken(null);
          localStorage.removeItem('pm_token');
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    hydrateUser();

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (payloadOrEmail, maybePassword) => {
    const payload =
      typeof payloadOrEmail === 'string'
        ? { email: payloadOrEmail, password: maybePassword }
        : payloadOrEmail;

    const response = await loginUser(payload);
    localStorage.setItem('pm_token', response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    setLoading(false);
    return response;
  };

  const register = async (payload) => registerUser(payload);

  const logout = () => {
    localStorage.removeItem('pm_token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ token, user, login, register, logout, loading, isAuthenticated: Boolean(token && user) }),
    [token, user, loading]
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
