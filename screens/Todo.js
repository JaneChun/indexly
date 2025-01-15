import { View, Text, StyleSheet } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import CollapsibleView from '../components/Todo/CollapsibleView';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const DAILY = 'Daily';

const Todo = ({ route }) => {
	const [contentHeight, setContentHeight] = useState(0);
	const [activeSections, setActiveSections] = useState(new Set());
	const { params: { type } = {} } = route;

	useEffect(() => {
		if (type) handleToggle(type);
	}, [type, handleToggle, route]);

	const handleToggle = useCallback((section) => {
		if (activeSections.has(section)) {
			setActiveSections((curActiveSections) => {
				const updatedSections = new Set(curActiveSections);
				if (section === DAILY) {
					updatedSections.delete(section);
				} else if (section === WEEKLY) {
					updatedSections.delete(DAILY);
					updatedSections.delete(WEEKLY);
				} else {
					updatedSections.delete(DAILY);
					updatedSections.delete(WEEKLY);
					updatedSections.delete(MONTHLY);
				}
				return updatedSections;
			});
		} else {
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
				offsetY={100}
				contentHeight={contentHeight}
				isCollapsed={activeSections.has(WEEKLY)}
				onToggle={() => handleToggle(WEEKLY)}
				isHidden={activeSections.has(DAILY)}
			/>

			<CollapsibleView
				type={DAILY}
				width='90%'
				offsetX={0}
				offsetY={200}
				contentHeight={contentHeight}
				isCollapsed={activeSections.has(DAILY)}
				onToggle={() => handleToggle(DAILY)}
				isHidden={false}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
});

export default Todo;
