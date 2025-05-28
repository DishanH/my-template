import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import colors from './colors';
import { ThemeContextType, ThemeType } from './types';

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: colors.light,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>(deviceColorScheme as ThemeType || 'light');

  // Update theme if device color scheme changes
  useEffect(() => {
    if (deviceColorScheme) {
      setTheme(deviceColorScheme as ThemeType);
    }
  }, [deviceColorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const themeColors = colors[theme];

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