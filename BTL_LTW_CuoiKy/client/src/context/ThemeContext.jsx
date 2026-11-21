import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }),
    [theme, setTheme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
