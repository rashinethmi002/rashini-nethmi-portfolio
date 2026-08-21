import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-ink transition-transform duration-300 hover:-rotate-[20deg] hover:border-purple"
    >
      {theme === 'dark' ? <FiMoon size={17} /> : <FiSun size={17} />}
    </button>
  );
}