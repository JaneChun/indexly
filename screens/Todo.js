import { useLocalSearchParams } from 'expo-router';
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
const MIN_TOP_MARGIN = 20;
const INPUT_HEIGHT = 51; // Input 높이 50 + borderTop 1
const INDEX_HEIGHT = 41; // 인덱스 탭 paddingTop 14 + paddingBottom 12 + 텍스트
const CONTAINER_PADDING = 16;

const Todo = () => {
	const [id, setId] = useState(null);
	const [inputValue, setInputValue] = useState('');
	const [isInputVisible, setIsInputVisible] = useState(false);
	const [isSettingVisible, setIsSettingVisible] = useState(false);
	const { t } = useLocalization();

	const { isKeyboardVisible, keyboardHeight, keyboardOffset } =
		useKeyboardVisibility(setIsInputVisible);
	const { currentSection, activeSections, toggleSection, openSection } = useActiveSections(DAILY);
	const { addTodo, editTodo } = useTodoContext();
	const { draggingTodo } = useDragDropContext();

	const { type } = useLocalSearchParams();

	const insets = useSafeAreaInsets();
	const safeAreaHeight = Dimensions.get('window').height - insets.top - insets.bottom;
	const topMargin = Math.max(insets.top * 0.4, MIN_TOP_MARGIN);
	const CONTENT_HEIGHT = safeAreaHeight - SORT_BUTTON_HEIGHT - topMargin;

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

	// 할 일 추가 줄을 누른 섹션에 넣을 새 할 일 입력창을 연다
	const handleAddPress = (sectionType) => {
		openSection(sectionType);
		setId(null);
		setInputValue('');
		setIsInputVisible(true);
	};

	const handleEditSubmit = async ({ id, text }) => {
		setId(id);
		setInputValue(text);
		setIsInputVisible(true);
	};

	const handleBackgroundPress = () => {
		if (isInputVisible) {
			resetInput(); // 열려있으면 닫기
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

	const getWidthForType = (type) => {
		const typeIndex = [MONTHLY, WEEKLY, DAILY].indexOf(type);
		return `${100 - typeIndex * 5}%`;
	};

	const collapsibleConfigs = [MONTHLY, WEEKLY, DAILY].map((type, idx) => {
		const height = CONTENT_HEIGHT - 100 * idx;
		const foldedHeight =
			safeAreaHeight -
			keyboardOffset -
			INPUT_HEIGHT -
			CONTAINER_PADDING * 2 -
			INDEX_HEIGHT -
			topMargin;

		return {
			type,
			width: getWidthForType(type),
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
				<View style={styles.draggingTodoContainer}>
					{draggingTodo && (
						<DraggingTodoItem containerWidth={getWidthForType(draggingTodo.type)} />
					)}
				</View>

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
							onAddPress={handleAddPress}
							onDrop={openSection}
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
		padding: CONTAINER_PADDING,
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
		left: 16,
		right: 16,
		height: '100%',
		zIndex: 999,
		pointerEvents: 'box-none',
		paddingHorizontal: 16,
		alignItems: 'center',
	},
});

export default Todo;
