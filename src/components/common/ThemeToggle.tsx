import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: 'light' | 'dark' | 'ghost';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'light',
}) => {
  const { isDark, toggleTheme } = useTheme();

  const buttonStyle = () => {
    if (variant === 'dark') {
      return 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700/80 hover:text-white';
    }
    if (variant === 'ghost') {
      return 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent';
    }
    // light (adaptive)
    return 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs';
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg border transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 flex items-center justify-center ${buttonStyle()} ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};
