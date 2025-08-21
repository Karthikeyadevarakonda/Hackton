import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      // Dark theme colors
      primary: 'bg-slate-900',
      secondary: 'bg-slate-800',
      accent: 'bg-teal-500',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      border: 'border-slate-700',
      hover: 'hover:bg-slate-700',
      card: 'bg-slate-800',
      input: 'bg-slate-900',
      button: 'bg-teal-500 hover:bg-teal-400',
      buttonSecondary: 'bg-slate-700 hover:bg-slate-600',
    } : {
      // Light theme colors
      primary: 'bg-white',
      secondary: 'bg-slate-50',
      accent: 'bg-blue-500',
      text: 'text-slate-900',
      textSecondary: 'text-slate-700',
      textMuted: 'text-slate-500',
      border: 'border-slate-200',
      hover: 'hover:bg-slate-100',
      card: 'bg-white',
      input: 'bg-white',
      button: 'bg-blue-500 hover:bg-blue-600',
      buttonSecondary: 'bg-slate-200 hover:bg-slate-300',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};