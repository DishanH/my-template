import React, { createContext, useContext, useEffect, useState } from 'react';
import { darkThemeColors, lightThemeColors } from '../constants/colors';
import StorageHelper from '../services/storageHelper';

export type ThemeType = 'light' | 'dark' | 'system';
export type FontSizeType = 'small' | 'medium' | 'large';

// Fallback colors in case import fails
const fallbackLightColors = {
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

const fallbackDarkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceVariant: '#2C2C2E',
  headerBackground: '#000000',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textPrimary: '#FFFFFF',
  primary: '#0A84FF',
  primaryDark: '#0056CC',
  secondary: '#8E8E93',
  accent: '#0A84FF',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  info: '#0A84FF',
  border: '#38383A',
  divider: '#38383A',
  icon: '#8E8E93',
  statusActive: '#30D158',
  statusInactive: '#8E8E93',
  bubbleSent: '#0A84FF',
  bubbleReceived: '#2C2C2E',
  drawerBackground: '#1C1C1E',
  drawerItemBackground: '#1C1C1E',
  drawerActiveItemBackground: '#2C2C2E',
  drawerHeaderBackground: '#2C2C2E',
};

// Re-export colors from constant file for backward compatibility
export { darkThemeColors, lightThemeColors };

interface SettingsContextType {
  theme: ThemeType;
  fontSizeLevel: FontSizeType;
  isDarkMode: boolean;
  fontSize: {
    small: number;
    normal: number;
    large: number;
    xlarge: number;
  };
  colors: typeof darkThemeColors | typeof lightThemeColors;
  setTheme: (theme: ThemeType) => void;
  setFontSizeLevel: (size: FontSizeType) => void;
}

// Default values
const defaultSettings = {
  theme: 'system' as ThemeType,
  fontSizeLevel: 'medium' as FontSizeType
};

// Font size mapping
const fontSizeMapping = {
  small: {
    small: 12,
    normal: 14,
    large: 16,
    xlarge: 20
  },
  medium: {
    small: 14,
    normal: 16,
    large: 18,
    xlarge: 22
  },
  large: {
    small: 16,
    normal: 18,
    large: 20,
    xlarge: 24
  }
};

const SettingsContext = createContext<SettingsContextType>({
  theme: defaultSettings.theme,
  fontSizeLevel: defaultSettings.fontSizeLevel,
  isDarkMode: false,
  fontSize: fontSizeMapping.medium,
  colors: lightThemeColors || fallbackLightColors,
  setTheme: () => {},
  setFontSizeLevel: () => {}
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: defaultSettings.theme,
    fontSizeLevel: defaultSettings.fontSizeLevel
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colors, setColors] = useState(lightThemeColors || fallbackLightColors);
  
  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await StorageHelper.getItem('app_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Determine if dark mode should be active
  useEffect(() => {
    const checkDarkMode = () => {
      if (settings.theme === 'dark') {
        setIsDarkMode(true);
        setColors(darkThemeColors || fallbackDarkColors);
        return;
      }
      
      if (settings.theme === 'light') {
        setIsDarkMode(false);
        setColors(lightThemeColors || fallbackLightColors);
        return;
      }
      
      // If system, check device preference
      if (settings.theme === 'system') {
        // This is a simplified check. In a real app, you'd use Appearance.getColorScheme()
        const isDark = window.matchMedia && 
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
        setColors(isDark ? (darkThemeColors || fallbackDarkColors) : (lightThemeColors || fallbackLightColors));
      }
    };
    
    checkDarkMode();
  }, [settings.theme]);
  
  // Save settings to storage when they change
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await StorageHelper.setItem('app_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    };
    
    saveSettings();
  }, [settings]);
  
  // Function to update theme
  const setTheme = (theme: ThemeType) => {
    setSettings(prev => ({ ...prev, theme }));
  };
  
  // Function to update font size
  const setFontSizeLevel = (fontSizeLevel: FontSizeType) => {
    setSettings(prev => ({ ...prev, fontSizeLevel }));
  };
  
  // Get current font sizes based on selected level
  const fontSize = fontSizeMapping[settings.fontSizeLevel];
  
  return (
    <SettingsContext.Provider 
      value={{
        theme: settings.theme,
        fontSizeLevel: settings.fontSizeLevel,
        isDarkMode,
        fontSize,
        colors,
        setTheme,
        setFontSizeLevel
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}; 