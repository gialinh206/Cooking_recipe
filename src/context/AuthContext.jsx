import { createContext, useContext, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, register, loginWithGoogle, logout } from '../store/authSlice';
import { clearFavorites } from '../store/favoriteSlice';

const AuthContext = createContext(null);

// Context chia sẻ thông tin đăng nhập; dữ liệu gốc nằm ở authSlice
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((s) => s.auth);

  const signIn = useCallback((creds) => dispatch(login(creds)).unwrap(), [dispatch]);
  const signUp = useCallback((form) => dispatch(register(form)).unwrap(), [dispatch]);
  const signInWithGoogle = useCallback((credential) => dispatch(loginWithGoogle(credential)).unwrap(), [dispatch]);
  const signOut = useCallback(() => {
    dispatch(logout());
    dispatch(clearFavorites());
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user, token, status, error,
      isAuthenticated: Boolean(token),
      isAdmin: user?.role === 'admin',
      signIn, signUp, signInWithGoogle, signOut,
    }),
    [user, token, status, error, signIn, signUp, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải nằm trong AuthProvider');
  return ctx;
};
