import { ColorThemes, CommonColors } from '@/constants/color';
import { generateCustomTheme } from '@/util/colorUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// AsyncStorage에 저장할 커스텀 색상 키
export const CUSTOM_COLORS_KEY = 'customColors';

// ColorThemes 객체의 키를 타입으로 추출하고 'custom1' 추가
export type ThemeName = keyof typeof ColorThemes | 'custom1';

// 기본 색상만 가진 커스텀 색상 타입
export type CustomColors = {
	daily: string;
	weekly: string;
	monthly: string;
};

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
	const [colors, setColors] = useState<Record<string, string>>({ ...ColorThemes.red, ...CommonColors });

	useEffect(() => {
		loadTheme();
	}, []);

	const loadTheme = async () => {
		try {
			const storedTheme = await AsyncStorage.getItem('colorTheme');
			if (!storedTheme) return;

			// custom1 테마인 경우
			if (storedTheme === 'custom1') {
				const customColorsJson = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);
				if (customColorsJson) {
					const customColors: CustomColors = JSON.parse(customColorsJson);
					const generatedTheme = generateCustomTheme(customColors);
					setCurrentTheme('custom1');
					setColors({ ...generatedTheme, ...CommonColors });
				}
			}
			// 사전 정의된 테마인 경우
			else if (ColorThemes[storedTheme as keyof typeof ColorThemes]) {
				setCurrentTheme(storedTheme as ThemeName);
				setColors({ ...ColorThemes[storedTheme as keyof typeof ColorThemes], ...CommonColors });
			}
		} catch (e) {
			console.log('테마 로드 실패:', e);
		}
	};

	const changeTheme = useCallback(async (themeName: ThemeName) => {
		try {
			// custom1 테마인 경우
			if (themeName === 'custom1') {
				const customColorsJson = await AsyncStorage.getItem(CUSTOM_COLORS_KEY);
				if (customColorsJson) {
					const customColors: CustomColors = JSON.parse(customColorsJson);
					const generatedTheme = generateCustomTheme(customColors);
					setCurrentTheme('custom1');
					setColors({ ...generatedTheme, ...CommonColors });
					await AsyncStorage.setItem('colorTheme', 'custom1');
				}
			}
			// 사전 정의된 테마인 경우
			else if (ColorThemes[themeName as keyof typeof ColorThemes]) {
				setCurrentTheme(themeName);
				setColors({ ...ColorThemes[themeName as keyof typeof ColorThemes], ...CommonColors });
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
