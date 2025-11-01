import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeLanguage, t } from '../i18n';

const LocalizationContext = createContext();

export const useLocalization = () => {
	const context = useContext(LocalizationContext);
	if (!context) {
		throw new Error('useLocalization must be used within a LocalizationProvider');
	}
	return context;
};

export const LocalizationProvider = ({ children }) => {
	const [currentLanguage, setCurrentLanguage] = useState('en');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initialize = () => {
			try {
				const language = initializeLanguage();
				setCurrentLanguage(language);
			} catch (error) {
				console.log('Error initializing language:', error);
				setCurrentLanguage('en'); // 기본값으로 en 설정
			} finally {
				setIsLoading(false);
			}
		};

		initialize();
	}, []);

	const value = {
		currentLanguage,
		t,
		isLoading,
	};

	return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};