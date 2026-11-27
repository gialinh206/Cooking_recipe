import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded border px-3 py-1 text-sm dark:border-gray-600"
      aria-label="Đổi giao diện sáng/tối"
    >
      {theme === 'dark' ? 'Sáng' : 'Tối'}
    </button>
  );
};

export default ThemeToggle;
