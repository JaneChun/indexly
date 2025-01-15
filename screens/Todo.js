import {
	View,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
} from 'react-native';
import { useEffect, useState } from 'react';

import CollapsibleView from '../components/Todo/CollapsibleView';
import Input from '../components/Todo/Input';
import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';
import { useActiveSections } from '../hooks/useActiveSections';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const DAILY = 'Daily';

const Todo = ({ route }) => {
	const [contentHeight, setContentHeight] = useState(0);
	const { isKeyboardVisible } = useKeyboardVisibility();
	const { currentSection, activeSections, toggleSection } =
		useActiveSections(null);

	const { params: { type } = {} } = route;

	useEffect(() => {
		if (type) toggleSection(type);
	}, [type, toggleSection]);

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
					onToggle={() => toggleSection(MONTHLY)}
					isEllipsed={activeSections.has(WEEKLY) || activeSections.has(DAILY)}
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
					onToggle={() => toggleSection(WEEKLY)}
					isEllipsed={activeSections.has(DAILY)}
				/>

				<CollapsibleView
					type={DAILY}
					width='90%'
					offsetX={0}
					offsetY={isKeyboardVisible && currentSection === DAILY ? 0 : 200}
					contentHeight={contentHeight}
					isCollapsed={activeSections.has(DAILY)}
					onToggle={() => toggleSection(DAILY)}
					isEllipsed={false}
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
