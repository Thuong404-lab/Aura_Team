import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'dark' | 'cream';

interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cream',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Khởi tạo mặc định là 'cream' (Trắng Kem Ngà) như người dùng yêu cầu
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      // Clear legacy dark theme from previous versions so user doesn't get trapped in dark mode
      localStorage.removeItem('aura_theme');
      const saved = localStorage.getItem('aura_theme_v3') as AppTheme;
      if (saved === 'cream' || saved === 'dark') {
        return saved;
      }
      localStorage.setItem('aura_theme_v3', 'cream');
    }
    return 'cream';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_theme_v3', theme);
      const root = document.documentElement;
      if (theme === 'cream') {
        root.classList.add('theme-cream');
        root.classList.remove('theme-dark');
      } else {
        root.classList.add('theme-dark');
        root.classList.remove('theme-cream');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'cream' : 'dark'));
  };

  const setTheme = (t: AppTheme) => {
    setThemeState(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
