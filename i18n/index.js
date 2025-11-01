import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './locales/en.json';
import ko from './locales/ko.json';

// i18n 인스턴스 생성
const i18n = new I18n({
	ko,
	en,
});

// 기본 언어를 한국어로 설정
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// 시스템 언어 감지 및 초기 설정
export const initializeLanguage = () => {
	// 시스템 언어 감지
	const systemLocale = Localization.getLocales()[0];
	const deviceLanguage = systemLocale.languageCode;

	// 지원하는 언어인지 확인 (ko, en)
	const supportedLanguage = ['ko', 'en'].includes(deviceLanguage) ? deviceLanguage : 'en';

	i18n.locale = supportedLanguage;
	return i18n.locale;
};

// 번역 함수
export const t = (key, options = {}) => {
	return i18n.t(key, options);
};

// 현재 언어 가져오기
export const getCurrentLanguage = () => {
	return i18n.locale;
};

export default i18n;