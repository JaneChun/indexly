import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorThemes, CommonColors } from '@/constants/color';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('red');
  const [colors, setColors] = useState({ ...ColorThemes.red, ...CommonColors });

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('colorTheme');
      if (savedTheme && ColorThemes[savedTheme]) {
        setCurrentTheme(savedTheme);
        setColors({ ...ColorThemes[savedTheme], ...CommonColors });
      }
    } catch (error) {
      console.error('테마 로드 실패:', error);
    }
  };

  const changeTheme = async (themeName) => {
    try {
      if (ColorThemes[themeName]) {
        setCurrentTheme(themeName);
        setColors({ ...ColorThemes[themeName], ...CommonColors });
        await AsyncStorage.setItem('colorTheme', themeName);
      }
    } catch (error) {
      console.error('테마 저장 실패:', error);
    }
  };

  const value = {
    currentTheme,
    colors,
    changeTheme,
    availableThemes: Object.keys(ColorThemes),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};