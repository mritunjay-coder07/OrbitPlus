import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  // We show the text for what it WILL become or current state?
  // User says: "Light Mode" when currently dark, "Dark Mode" when currently light.
  const isDark = theme === 'dark';

  return (
    <button 
      className="theme-toggle-btn" 
      onClick={toggleTheme}
    >
      {isDark ? (
        <>
          <Sun size={18} className="text-accent-blue" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={18} className="text-accent-purple" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
