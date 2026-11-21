import { useTheme } from '../context/ThemeContext.jsx';

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" onClick={toggle} className="btn-outline" aria-label="Đổi giao diện sáng/tối">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
export default ThemeToggle;
