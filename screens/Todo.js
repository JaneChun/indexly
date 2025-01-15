import {
	View,
	StyleSheet,
	SafeAreaView,
	KeyboardAvoidingView,
	Alert,
} from 'react-native';
import { useEffect, useState } from 'react';

import CollapsibleView from '../components/Todo/CollapsibleView';
import Input from '../components/Todo/Input';

import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';
import { useActiveSections } from '../hooks/useActiveSections';
import {
	insertTodo,
	updateTodo,
	deleteTodo,
	fetchAllTodos,
} from '@/util/database';

const MONTHLY = 'Monthly';
const WEEKLY = 'Weekly';
const DAILY = 'Daily';

const Todo = ({ route }) => {
	const [contentHeight, setContentHeight] = useState(0);
	const [id, setId] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [isInputVisible, setIsInputVisible] = useState(false);
	const { isKeyboardVisible } = useKeyboardVisibility(setIsInputVisible);
	const { currentSection, activeSections, toggleSection } =
		useActiveSections(null);

	const { params: { type } = {} } = route;

	useEffect(() => {
		if (type) toggleSection(type);
	}, [type, toggleSection]);

	useEffect(() => {
		const loadTodos = async () => {
			const todos = await fetchAllTodos();
			console.log(todos);
		};

		loadTodos();
	}, []);

	useEffect(() => {
		if (!isKeyboardVisible) {
			setIsInputVisible(false);
		}
	}, [isKeyboardVisible]);

	const handleBackgroundPress = () => {
		setIsInputVisible(true);
	};

	const handleInputValueSubmit = async ({ inputValue }) => {
		if (!inputValue.trim()) {
			Alert.alert('할 일을 입력해주세요.', '');
			setIsInputVisible(false);
			return;
		}

		try {
			if (!id) {
				await insertTodo({ type: currentSection, text: inputValue });
			} else {
				await updateTodo({ id, text: inputValue });
				setId(null);
			}
		} catch (err) {
			console.log(err);
		}

		setIsInputVisible(false);
	};

	const handleEditButtonPress = async ({ id, text }) => {
		setIsInputVisible(true);
		setInputValue(text);
		setId(id);
	};

	const handleDeleteButtonPress = async ({ id }) => {
		try {
			await deleteTodo({ id });
		} catch (err) {
			console.log(err);
		}
	};

	const collapsibleConfigs = [
		{
			type: MONTHLY,
			width: '100%',
			offsetX: -180,
			offsetY: 0,
			isEllipsed: activeSections.has(WEEKLY) || activeSections.has(DAILY),
		},
		{
			type: WEEKLY,
			width: '95%',
			offsetX: -90,
			offsetY:
				isKeyboardVisible &&
				(currentSection === WEEKLY || currentSection === DAILY)
					? 0
					: 100,
			isEllipsed: activeSections.has(DAILY),
		},
		{
			type: DAILY,
			width: '90%',
			offsetX: 0,
			offsetY: isKeyboardVisible && currentSection === DAILY ? 0 : 200,
			isEllipsed: false,
		},
	];

	return (
		<SafeAreaView style={styles.screen}>
			<View
				style={styles.container}
				onLayout={(event) => {
					const { height } = event.nativeEvent.layout;
					setContentHeight(height);
				}}
			>
				{collapsibleConfigs.map((config) => (
					<CollapsibleView
						key={config.type}
						type={config.type}
						width={config.width}
						contentHeight={contentHeight}
						offsetX={config.offsetX}
						offsetY={config.offsetY}
						isCollapsed={activeSections.has(config.type)}
						isEllipsed={config.isEllipsed}
						currentSection={currentSection}
						onToggle={() => toggleSection(config.type)}
						onPressBackground={handleBackgroundPress}
						onEditButtonPress={handleEditButtonPress}
						onDeleteButtonPress={handleDeleteButtonPress}
					/>
				))}
			</View>
			<KeyboardAvoidingView
				enabled={true}
				behavior='padding'
				keyboardVerticalOffset={60}
			>
				{isInputVisible && (
					<Input
						inputValue={inputValue}
						setInputValue={setInputValue}
						onSubmitInputValue={handleInputValueSubmit}
					/>
				)}
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
