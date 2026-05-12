import { createContext, useContext, useEffect, useState } from 'react';

/** Keep in sync with the inline script in `client/index.html`. */
export const THEME_STORAGE_KEY = 'portfolio-theme';

/** @typedef {'light' | 'dark'} Theme */

/** @type {import('react').Context<null | { theme: Theme; setTheme: (t: Theme) => void; toggleTheme: () => void; isDark: boolean }>} */
const ThemeContext = createContext(null);

function readStoredTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return raw === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === 'dark';
    root.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore quota / private mode */
    }
  }, [theme]);

  const setTheme = (t) => setThemeState(t === 'dark' ? 'dark' : 'light');
  const toggleTheme = () => setThemeState((p) => (p === 'dark' ? 'light' : 'dark'));
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
