/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

// Lumina Campus Color Palette
export const LUMINA_COLORS = {
  background: '#060E20',
  cardBackground: '#0C0C0C',
  primary: '#6366F1', // Indigo
  primaryContainer: '#8B5CF6', // Violet
  secondary: '#EC4899', // Pink
  tertiary: '#22D3EE', // Cyan
  tertiaryContainer: '#67E8F9', // Cyan Light
  textPrimary: 'rgba(255, 255, 255, 0.9)',
  textMuted: '#94A3B8',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  glassBg: 'rgba(255, 255, 255, 0.03)',
  indigoGlow: 'rgba(99, 102, 241, 0.4)',
};

// Utility functions
export const getLuminaColor = (colorName) => LUMINA_COLORS[colorName] || LUMINA_COLORS.primary;

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark' // Default to dark for Lumina
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: LUMINA_COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
