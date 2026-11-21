import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục đăng nhập khi F5
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user: u }) => {
    localStorage.setItem('token', token);
    setUser(u);
  };
  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
  }, []);
  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    saveSession(data);
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
