import { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SettingModal from '../components/Setting/SettingModal';
import CollapsibleView from '../components/Todo/CollapsibleView';
import DeleteCompletedButton from '../components/Todo/DeleteCompletedButton';
import DraggingTodoItem from '../components/Todo/DraggingTodoItem';
import Input from '../components/Todo/Input';
import SettingButton from '../components/Todo/SettingButton';
import SortButton from '../components/Todo/SortButton';

import { DAILY, MONTHLY, WEEKLY } from '@/constants/type';
import { useDragDropContext } from '@/store/DragDropContext';
import { useLocalization } from '@/store/LocalizationContext';
import { useActiveSections } from '../hooks/useActiveSections';
import { useKeyboardVisibility } from '../hooks/useKeyboardVisibility';
import { useTodoContext } from '../store/TodoContext';

const SORT_BUTTON_HEIGHT = 60;

const Todo = ({ route }) => {
	const [id, setId] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [isInputVisible, setIsInputVisible] = useState(false);
	const [isSettingVisible, setIsSettingVisible] = useState(false);
	const { t } = useLocalization();

	const { isKeyboardVisible, keyboardHeight } = useKeyboardVisibility(setIsInputVisible);
	const { currentSection, activeSections, toggleSection } = useActiveSections(DAILY);
	const { addTodo, editTodo } = useTodoContext();
	const { draggingTodo } = useDragDropContext();

	const { params: { type } = {} } = route;

	const insets = useSafeAreaInsets();
	const safeAreaHeight = Dimensions.get('window').height - insets.top * 1.4 - insets.bottom;
	const CONTENT_HEIGHT = safeAreaHeight - SORT_BUTTON_HEIGHT;

	useEffect(() => {
		if (type) toggleSection(type);
	}, [type, toggleSection]);

	useEffect(() => {
		if (!isKeyboardVisible) {
			setIsInputVisible(false);
		}
	}, [isKeyboardVisible]);

	const resetInput = () => {
		setId(null);
		setInputValue('');
		setIsInputVisible(false);
	};

	const toggleInput = () => {
		setId(null);
		setInputValue('');
		setIsInputVisible((prev) => !prev);
	};

	const handleEditSubmit = async ({ id, text }) => {
		setId(id);
		setInputValue(text);
		setIsInputVisible(true);
	};

	const handleBackgroundPress = () => {
		if (isInputVisible) {
			resetInput(); // 열려있으면 닫기
		} else {
			toggleInput(); // 닫혀있으면 열기
		}
	};

	const handleSubmit = async ({ inputValue }) => {
		if (!inputValue.trim()) {
			Alert.alert(t('message.validation.inputRequired'), '');
			setIsInputVisible(false);
			return;
		}

		try {
			if (id) {
				await editTodo({ id, text: inputValue });
			} else {
				await addTodo({ type: currentSection, text: inputValue });
			}

			resetInput();
		} catch (err) {
			console.log(err);
		}
	};

	const collapsibleConfigs = [MONTHLY, WEEKLY, DAILY].map((type, idx) => {
		const height = CONTENT_HEIGHT - 100 * idx;
		const foldedHeight = CONTENT_HEIGHT * 0.5;

		return {
			type,
			width: `${100 - idx * 5}%`,
			offsetX: (2 - idx) * 90,
			height: isInputVisible ? foldedHeight : height,
			isEllipsed:
				(idx === 0 && (activeSections.has(WEEKLY) || activeSections.has(DAILY))) ||
				(idx === 1 && activeSections.has(DAILY)) ||
				false,
		};
	});

	return (
		<Animated.View style={{ flex: 1, paddingBottom: keyboardHeight }}>
			<SettingModal
				isVisible={isSettingVisible}
				onBackdropPress={() => setIsSettingVisible(false)}
			/>

			<SafeAreaView style={styles.screen}>
				{/* 드래그 중인 아이템 렌더링 */}
				<View style={styles.draggingTodoContainer}>{draggingTodo && <DraggingTodoItem />}</View>

				{/* 투두 리스트 */}
				<View style={styles.container}>
					{/* 완료 항목 삭제 */}
					<DeleteCompletedButton />
					{!isInputVisible && (
						<View style={styles.topButtonsContainer}>
							<SortButton style={styles.topButton} />
							{activeSections.size === 0 && (
								<SettingButton style={styles.topButton} onPress={() => setIsSettingVisible(true)} />
							)}
						</View>
					)}

					{/* 섹션 */}
					{collapsibleConfigs.map((config) => (
						<CollapsibleView
							key={config.type}
							{...config}
							isCollapsed={!activeSections.has(config.type)}
							currentSection={currentSection}
							onToggle={() => {
								resetInput();
								toggleSection(config.type);
							}}
							onPressBackground={handleBackgroundPress}
							onEditButtonPress={handleEditSubmit}
							editingId={id}
						/>
					))}
				</View>

				{/* 인풋 */}
				{isInputVisible && (
					<Input
						inputValue={inputValue}
						setInputValue={setInputValue}
						resetInput={resetInput}
						onSubmit={handleSubmit}
					/>
				)}
			</SafeAreaView>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	topButtonsContainer: {
		height: SORT_BUTTON_HEIGHT,
		width: '100%',
		position: 'absolute',
		top: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	topButton: {
		padding: 16,
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
