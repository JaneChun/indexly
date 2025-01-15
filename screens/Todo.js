import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import CollapsibleView from '../components/Todo/CollapsibleView';
import Input from '../components/Todo/Input';
import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const DAILY = 'Daily';

const Todo = ({ route }) => {
	const [contentHeight, setContentHeight] = useState(0);
	const [currentSection, setCurrentSection] = useState(null);
	const [activeSections, setActiveSections] = useState(new Set());
	const { isKeyboardVisible } = useKeyboardVisibility();

	const { params: { type } = {} } = route;

	useEffect(() => {
		if (type) handleToggle(type);
	}, [type, handleToggle, route]);

	useEffect(() => {
		if (!isKeyboardVisible) {
			setActiveSections((curActiveSections) => {
				const updatedSections = new Set(curActiveSections);
				if (currentSection === DAILY) {
					updatedSections.add(DAILY).add(WEEKLY).add(MONTHLY);
				} else if (currentSection === WEEKLY) {
					updatedSections.add(WEEKLY).add(MONTHLY);
				} else {
					updatedSections.add(MONTHLY);
				}
				return updatedSections;
			});
		}
	}, [isKeyboardVisible]);

	const handleToggle = useCallback((section) => {
		if (activeSections.has(section)) {
			setActiveSections((curActiveSections) => {
				const updatedSections = new Set(curActiveSections);
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
			});
		} else {
			setCurrentSection(section);
			setActiveSections((curActiveSections) => {
				const updatedSections = new Set(curActiveSections);
				if (section === DAILY) {
					updatedSections.add(DAILY).add(WEEKLY).add(MONTHLY);
				} else if (section === WEEKLY) {
					updatedSections.add(WEEKLY).add(MONTHLY);
				} else {
					updatedSections.add(MONTHLY);
				}
				return updatedSections;
			});
		}
	});

	return (
		<SafeAreaView style={styles.screen}>
			<View
				style={styles.container}
				onLayout={(event) => {
					const { height } = event.nativeEvent.layout;
					setContentHeight(height);
				}}
			>
				<CollapsibleView
					type={MONTHLY}
					width='100%'
					offsetX={-180}
					offsetY={0}
					contentHeight={contentHeight}
					isCollapsed={activeSections.has(MONTHLY)}
					onToggle={() => handleToggle(MONTHLY)}
					isHidden={activeSections.has(WEEKLY) || activeSections.has(DAILY)}
				/>

				<CollapsibleView
					type={WEEKLY}
					width='95%'
					offsetX={-90}
					offsetY={
						isKeyboardVisible &&
						(currentSection === WEEKLY || currentSection === DAILY)
							? 0
							: 100
					}
					contentHeight={contentHeight}
					isCollapsed={activeSections.has(WEEKLY)}
					onToggle={() => handleToggle(WEEKLY)}
					isHidden={activeSections.has(DAILY)}
				/>

				<CollapsibleView
					type={DAILY}
					width='90%'
					offsetX={0}
					offsetY={isKeyboardVisible && currentSection === DAILY ? 0 : 200}
					contentHeight={contentHeight}
					isCollapsed={activeSections.has(DAILY)}
					onToggle={() => handleToggle(DAILY)}
					isHidden={false}
				/>
			</View>
			<KeyboardAvoidingView
				enabled={true}
				behavior='padding'
				keyboardVerticalOffset={60}
			>
				<Input />
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: { flex: 1 },
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
});

export default Todo;
