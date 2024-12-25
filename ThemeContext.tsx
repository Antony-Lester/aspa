// ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, highContrastColors } from './colors';

interface ThemeContextProps {
  colors: typeof lightColors;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  colors: lightColors,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = useColorScheme();
  const initialColors = colorScheme === 'dark' ? darkColors : lightColors;

  const [colors, setColors] = useState(initialColors);

  const setTheme = async (theme: string) => {
    switch (theme) {
      case 'light':
        setColors(lightColors);
        break;
      case 'dark':
        setColors(darkColors);
        break;
      case 'highContrast':
        setColors(highContrastColors);
        break;
      default:
        setColors(lightColors);
        break;
    }
    await AsyncStorage.setItem('theme', theme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
