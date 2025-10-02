import { ColorThemes, CommonColors } from '@/constants/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// ColorThemes 객체의 키를 타입으로 추출
export type ThemeName = keyof typeof ColorThemes;

// ThemeContext에서 제공하는 값의 타입
interface ThemeContextValue {
	currentTheme: ThemeName;
	colors: Record<string, string>;
	changeTheme: (themeName: ThemeName) => Promise<void>;
	themeNames: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentTheme, setCurrentTheme] = useState<ThemeName>('red');
	const [colors, setColors] = useState({ ...ColorThemes.red, ...CommonColors });

	useEffect(() => {
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const storedTheme = await AsyncStorage.getItem('colorTheme');
			if (storedTheme && ColorThemes[storedTheme as ThemeName]) {
				setCurrentTheme(storedTheme as ThemeName);
				setColors({ ...ColorThemes[storedTheme as ThemeName], ...CommonColors });
			}
		} catch (e) {
			console.log('테마 로드 실패:', e);
		}
	};

	const changeTheme = useCallback(async (themeName: ThemeName) => {
		try {
			if (ColorThemes[themeName]) {
				setCurrentTheme(themeName);
				setColors({ ...ColorThemes[themeName], ...CommonColors });
				await AsyncStorage.setItem('colorTheme', themeName);
			}
		} catch (e) {
			console.log('테마 저장 실패:', e);
		}
	}, []);

	const themeNames = useMemo(() => Object.keys(ColorThemes) as ThemeName[], []);

	const value = useMemo(
		() => ({
			currentTheme,
			colors,
			changeTheme,
			themeNames,
		}),
		[currentTheme, colors, changeTheme, themeNames],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
