import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : 'theme-toggle--light'} ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
      aria-label="Ganti tema tampilan"
    >
      <div className="theme-toggle__track">
        <span className="theme-toggle__thumb">
          {isDark ? <Moon size={13} className="theme-toggle__icon" /> : <Sun size={13} className="theme-toggle__icon" />}
        </span>
      </div>
    </button>
  );
}

