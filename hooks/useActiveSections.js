import { useState, useCallback } from 'react';
import { MONTHLY, WEEKLY, DAILY } from '@/constants/type';

export const useActiveSections = (initialSection) => {
	const [currentSection, setCurrentSection] = useState(initialSection);
	const [activeSections, setActiveSections] = useState(
		new Set([MONTHLY, WEEKLY, DAILY]),
	);

	const toggleSection = useCallback((section) => {
		setActiveSections((curActiveSections) => {
			const updatedSections = new Set(curActiveSections);
			if (updatedSections.has(section)) {
				if (section === DAILY) {
					updatedSections.delete(section);
					setCurrentSection(WEEKLY);
				} else if (section === WEEKLY) {
					updatedSections.delete(DAILY);
					updatedSections.delete(WEEKLY);
					setCurrentSection(MONTHLY);
				} else {
					updatedSections.delete(DAILY);
					updatedSections.delete(WEEKLY);
					updatedSections.delete(MONTHLY);
					setCurrentSection(null);
				}
				return updatedSections;
			} else {
				setCurrentSection(section);
				if (section === DAILY) {
					updatedSections.add(DAILY).add(WEEKLY).add(MONTHLY);
				} else if (section === WEEKLY) {
					updatedSections.add(WEEKLY).add(MONTHLY);
				} else {
					updatedSections.add(MONTHLY);
				}
				return updatedSections;
			}
		});
	}, []);

	// 해당 섹션이 맨 앞에 오도록 연다 (뒤쪽 섹션은 접힘)
	const openSection = useCallback((section) => {
		const order = [MONTHLY, WEEKLY, DAILY];
		setActiveSections(new Set(order.slice(0, order.indexOf(section) + 1)));
		setCurrentSection(section);
	}, []);

	return { currentSection, activeSections, toggleSection, openSection };
};
