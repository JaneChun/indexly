import { useState, useCallback } from 'react';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const DAILY = 'Daily';

export const useActiveSections = (initialSection) => {
	const [currentSection, setCurrentSection] = useState(initialSection);
	const [activeSections, setActiveSections] = useState(new Set());

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

	return { currentSection, activeSections, toggleSection };
};
