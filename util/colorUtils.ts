import { CustomColors } from '@/store/ThemeContext';

/**
 * Hex 색상을 RGBA로 변환
 * @param hex - #RRGGBB 형식의 hex 색상
 * @param alpha - 투명도 (0-1)
 * @returns rgba(r, g, b, alpha) 형식의 문자열
 */
export const hexToRgba = (hex: string, alpha: number): string => {
	// # 제거
	const cleanHex = hex.replace('#', '');

	// RGB 값 추출
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Hex 색상을 밝게 만들기
 * @param hex - #RRGGBB 형식의 hex 색상
 * @param factor - 밝기 정도 (0-1, 1에 가까울수록 흰색에 가까워짐)
 * @returns #RRGGBB 형식의 hex 색상
 */
export const lighten = (hex: string, factor: number): string => {
	// # 제거
	const cleanHex = hex.replace('#', '');

	// RGB 값 추출
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);

	// 흰색(255)으로 보간
	const newR = Math.round(r + (255 - r) * factor);
	const newG = Math.round(g + (255 - g) * factor);
	const newB = Math.round(b + (255 - b) * factor);

	// hex로 변환
	const toHex = (n: number) => n.toString(16).padStart(2, '0');
	return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`.toUpperCase();
};

/**
 * 기본 커스텀 색상(monthly, weekly, daily)을 받아서
 * 파생 색상(_opaque, _light, _medium)까지 포함한 전체 테마 객체 생성
 */
export const generateCustomTheme = (customColors: CustomColors): Record<string, string> => {
	return {
		daily: customColors.daily,
		daily_opaque: hexToRgba(customColors.daily, 0.5),
		daily_light: lighten(customColors.daily, 0.9),
		daily_medium: lighten(customColors.daily, 0.7),
		weekly: customColors.weekly,
		weekly_opaque: hexToRgba(customColors.weekly, 0.5),
		weekly_light: lighten(customColors.weekly, 0.95),
		monthly: customColors.monthly,
		monthly_opaque: hexToRgba(customColors.monthly, 0.5),
		monthly_light: lighten(customColors.monthly, 0.98),
	};
};
