import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../app/utils/storage';
import colors from '../constants/colors';
import { ThemeContextType, ThemeType } from '../constants/types';

// Fallback colors in case import fails
const fallbackColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceVariant: '#F0F5F9',
  headerBackground: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textPrimary: '#1A1A1A',
  primary: '#007AFF',
  primaryDark: '#005BB5',
  secondary: '#6B7280',
  accent: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  border: '#E5E7EB',
  divider: '#E5E7EB',
  icon: '#6B7280',
  statusActive: '#34C759',
  statusInactive: '#6B7280',
  bubbleSent: '#007AFF',
  bubbleReceived: '#F1F3F4',
  drawerBackground: '#FFFFFF',
  drawerItemBackground: '#FFFFFF',
  drawerActiveItemBackground: '#F0F5F9',
  drawerHeaderBackground: '#F0F5F9',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: colors?.light || fallbackColors,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await storage.getTheme();
        if (savedTheme) {
          setThemeState(savedTheme);
        } else {
          // If no saved theme, use device color scheme
          const initialTheme = (deviceColorScheme as ThemeType) || 'light';
          setThemeState(initialTheme);
          await storage.setTheme(initialTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setThemeState('light');
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [deviceColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    await storage.setTheme(newTheme);
  };

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    await storage.setTheme(newTheme);
  };

  // Use fallback colors if import failed
  const themeColors = colors?.[theme] || fallbackColors;

  // Don't render children until theme is loaded
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: themeColors,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 