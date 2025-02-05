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
import DeleteCompletedButton from '../components/Todo/DeleteCompletedButton';
import SortButton from '../components/Todo/SortButton';
import DraggingTodoItem from '../components/Todo/DraggingTodoItem';

import { MONTHLY, WEEKLY, DAILY } from '@/constants/type';
import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';
import { useActiveSections } from '../hooks/useActiveSections';
import { useTodoContext } from '../store/TodoContext';
import { useDragDropContext } from '@/store/DragDropContext';

const Todo = ({ route }) => {
	const [contentHeight, setContentHeight] = useState(0);
	const [id, setId] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [isInputVisible, setIsInputVisible] = useState(false);
	const { isKeyboardVisible } = useKeyboardVisibility(setIsInputVisible);
	const { currentSection, activeSections, toggleSection } =
		useActiveSections(DAILY);
	const { addTodo, editTodo } = useTodoContext();
	const { draggingTodo } = useDragDropContext();

	const { params: { type } = {} } = route;

	useEffect(() => {
		if (type) toggleSection(type);
	}, [type, toggleSection]);

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
			const action = id
				? editTodo({ id, text: inputValue })
				: addTodo({ type: currentSection, text: inputValue });

			await action;
			setId(null);
		} catch (err) {
			console.log(err);
		} finally {
			setIsInputVisible(false);
		}
	};

	const handleEditButtonPress = async ({ id, text }) => {
		setIsInputVisible(true);
		setInputValue(text);
		setId(id);
	};

	const collapsibleConfigs = [
		{
			type: MONTHLY,
			width: '100%',
			offsetX: -180,
			offsetY: 0,
			height: contentHeight - 95,
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
			height: contentHeight - 95,
			isEllipsed: activeSections.has(DAILY),
		},
		{
			type: DAILY,
			width: '90%',
			offsetX: 0,
			offsetY: isKeyboardVisible && currentSection === DAILY ? 0 : 200,
			height: contentHeight - 95,
			isEllipsed: false,
		},
	];

	return (
		<SafeAreaView style={styles.screen}>
			{/* 드래그 중인 아이템 렌더링 */}
			<View style={styles.draggingTodoContainer}>
				{draggingTodo && <DraggingTodoItem />}
			</View>
			<View
				style={styles.container}
				onLayout={(event) => {
					const { height } = event.nativeEvent.layout;
					setContentHeight(height);
				}}
			>
				<DeleteCompletedButton />
				<View style={styles.sortButtonContainer}>
					<SortButton />
				</View>
				{collapsibleConfigs.map((config) => (
					<CollapsibleView
						key={config.type}
						{...config}
						isCollapsed={!activeSections.has(config.type)}
						currentSection={currentSection}
						onToggle={() => toggleSection(config.type)}
						onPressBackground={handleBackgroundPress}
						onEditButtonPress={handleEditButtonPress}
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
	sortButtonContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		paddingHorizontal: 32,
		paddingVertical: 24,
	},
	draggingTodoContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		zIndex: 999,
		pointerEvents: 'box-none',
	},
});

export default Todo;
