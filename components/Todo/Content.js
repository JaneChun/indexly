import { useLayoutEffect, useRef } from 'react';
import {
	Alert,
	InteractionManager,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Colors } from '@/constants/color';
import { DAILY } from '@/constants/type';
import { useDragDropContext } from '@/store/DragDropContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useInsideZone } from '../../hooks/useInsideZone';
import { useTodoContext, useTypedTodos } from '../../store/TodoContext';
import TodoItem from './TodoItem';

const Content = ({
	type,
	isEllipsed,
	isCollapsed,
	currentSection,
	onPressBackground,
	onEditButtonPress,
}) => {
	const todos = useTypedTodos(type);
	const { removeTodo } = useTodoContext();
	const { memorizeDroppableZones, draggingTodo, setDraggingTodo } =
		useDragDropContext();
	const isInside = type === useInsideZone();
	const droppableRef = useRef(null);
	const { showActionSheetWithOptions } = useActionSheet();

	// 현재 드롭 가능한 영역의 위치와 크기를 저장
	useLayoutEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			droppableRef?.current?.measureInWindow((x, y, width, height) => {
				memorizeDroppableZones({
					type,
					content: {
						startX: x,
						startY: y,
						endX: x + width,
						endY: y + height,
					},
				});
			});
		}, [currentSection, memorizeDroppableZones]);
	});

	// 할 일을 길게 눌렀을 때 드래그 상태로 설정
	const handleTodoLongPress = (todo) => {
		setDraggingTodo(todo);
	};

	const handleTodoDoubleTap = ({ id, text }) => {
		const options = ['수정', '삭제', '취소'];
		const cancelButtonIndex = 2;

		showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (selectedIndex) => {
				if (selectedIndex === 0) {
					onEditButtonPress({ id, text });
				} else if (selectedIndex === 1) {
					Alert.alert('항목 삭제', '삭제하시겠습니까?', [
						{
							text: 'Cancel',
							onPress: () => {
								return;
							},
							style: 'cancel',
						},
						{
							text: 'OK',
							onPress: async () => {
								await removeTodo({ id });
							},
						},
					]);
				}
			},
		);
	};

	// 배경을 눌렀을 때 선택 상태 해제
	const handlePressBackground = () => {
		if (draggingTodo) {
			setDraggingTodo(null);
		} else {
			onPressBackground();
		}
	};

	return (
		<View
			ref={droppableRef}
			style={[
				styles.droppableRef,
				isCollapsed && styles.isCollapsed,
				isInside && [
					styles.isInside,
					type === DAILY
						? styles.dailyMediumBackground
						: styles.dailyLightBackground,
				],
			]}
		>
			{isEllipsed ? (
				<>
					{todos.slice(0, 1).map((item) => (
						<TodoItem
							key={item.id}
							{...item}
							type={type}
							onLongPress={handleTodoLongPress}
							isEllipsed={true}
						/>
					))}
					{todos.length > 1 && (
						<Text style={styles.hiddenCount}>
							+ {todos.length - 1}개의 할 일
						</Text>
					)}
				</>
			) : (
				<Pressable onPress={handlePressBackground} style={styles.content}>
					{/* 할 일 리스트 */}
					<FlatList
						data={todos}
						keyExtractor={({ id }) => id}
						style={styles.flatList}
						renderItem={({ item }) => (
							<TodoItem
								{...item}
								type={type}
								onLongPress={handleTodoLongPress}
								onDoubleTap={handleTodoDoubleTap}
							/>
						)}
					/>
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {},
	content: {
		height: '100%',
	},
	droppableRef: {
		minHeight: 60,
	},
	isInside: {
		borderRadius: 8,
		padding: 2,
	},
	flatList: {
		overflow: 'hidden',
	},
	hiddenCount: {
		fontSize: 12,
		marginLeft: 16,
		opacity: 0.5,
	},
	isCollapsed: { opacity: 0 },
	dailyMediumBackground: { backgroundColor: Colors.daily_medium },
	dailyLightBackground: { backgroundColor: Colors.daily_light },
});

export default Content;
