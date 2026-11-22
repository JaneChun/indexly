import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/constants/font';
import { FlatList } from 'react-native-gesture-handler';

import { DAILY, WEEKLY } from '@/constants/type';
import { useDragDropContext } from '@/store/DragDropContext';
import { useLocalization } from '@/store/LocalizationContext';
import { useTheme } from '@/store/ThemeContext';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useInsideZone } from '../../hooks/useInsideZone';
import { useTodoContext, useTypedTodos } from '../../store/TodoContext';
import AddTodoRow from './AddTodoRow';
import TodoItem from './TodoItem';

const Content = ({
	type,
	isEllipsed,
	isCollapsed,
	currentSection,
	onPressBackground,
	onAddPress,
	onDrop,
	onEditButtonPress,
	editingId,
}) => {
	const todos = useTypedTodos(type);
	const { colors: Colors } = useTheme();
	const { t } = useLocalization();
	const { moveTodo, removeTodo, reorderTodos } = useTodoContext();
	const itemRefs = useRef({});
	const {
		memorizeDroppableZones,
		droppableZones,
		draggingTodo,
		setDraggingTodo,
		currentPosition,
		setCurrentPosition,
		setDragStartPosition,
		draggingHeight,
		setDraggingHeight,
		dropTargetRef,
	} = useDragDropContext();
	const isInside = type === useInsideZone();
	const droppableRef = useRef(null);
	const { showActionSheetWithOptions } = useActionSheet();

	// 현재 드롭 가능한 영역의 위치와 크기를 저장
	useLayoutEffect(() => {
		requestIdleCallback(() => {
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
		});
	});

	// 드래그가 시작되면 펼쳐진 목록은 각 항목의 화면 위치를 한 번 측정해 둔다
	const draggingId = draggingTodo?.id ?? null;
	const isSource = draggingTodo?.type === type;
	const [layouts, setLayouts] = useState(null);

	useEffect(() => {
		if (!draggingId) {
			setLayouts(null);
			return;
		}
		if (isSource) {
			itemRefs.current[draggingId]?.measureInWindow((x, y, width, height) =>
				setDraggingHeight(height),
			);
		}
		if (isEllipsed || isCollapsed) return;
		Promise.all(
			todos.map(
				(todo) =>
					new Promise((resolve) => {
						const ref = itemRefs.current[todo.id];
						if (!ref) return resolve([todo.id, null]);
						ref.measureInWindow((x, y, width, height) => resolve([todo.id, { y, height }]));
					}),
			),
		).then((entries) => setLayouts(Object.fromEntries(entries)));
	}, [draggingId]);

	// 손가락이 이 목록 위에 있으면 드래그 항목이 들어갈 자리(다른 항목 기준 인덱스)를 구한다
	const dragIndex = isSource ? todos.findIndex((todo) => todo.id === draggingId) : -1;
	const contentZone = droppableZones[type]?.content;
	const isOverList =
		isInside &&
		currentPosition &&
		contentZone &&
		currentPosition.y >= contentZone.startY &&
		currentPosition.y <= contentZone.endY;
	let targetIndex = null;
	if (layouts && isOverList) {
		targetIndex = todos.filter((todo) => {
			const layout = layouts[todo.id];
			return todo.id !== draggingId && layout && layout.y + layout.height / 2 < currentPosition.y;
		}).length;
	}
	if (targetIndex !== null) {
		dropTargetRef.current = { type, index: targetIndex };
	} else if (dropTargetRef.current?.type === type) {
		dropTargetRef.current = null;
	}

	// 각 항목이 비켜날 거리: 드래그 항목이 빠지고 targetIndex에 들어간다고 보고 계산
	const getShiftY = (index) => {
		if (!layouts || index === dragIndex) return 0;
		// 다른 목록에서 끌고 온 경우: 들어갈 자리부터 아래 항목이 내려간다
		if (dragIndex === -1) return targetIndex !== null && index >= targetIndex ? draggingHeight : 0;
		// 이 목록 밖으로 끌고 나간 경우: 빈 칸을 닫는다
		if (targetIndex === null) return index > dragIndex ? -draggingHeight : 0;
		const indexWithoutDragged = index < dragIndex ? index : index - 1;
		const newIndex = indexWithoutDragged < targetIndex ? indexWithoutDragged : indexWithoutDragged + 1;
		return (newIndex - index) * draggingHeight;
	};

	// 이 목록의 항목 드래그가 끝났을 때: 드래그 상태 초기화와 이동·순서 변경을 한 번에 렌더링해 항목이 튀지 않게 한다
	const handleDragEnd = (id, destination) => {
		const dropTarget = dropTargetRef.current;
		dropTargetRef.current = null;
		setDraggingTodo(null);
		setCurrentPosition(null);
		setDragStartPosition(null);

		if (!destination) return;
		const index = dropTarget?.type === destination ? dropTarget.index : null;

		if (destination === type) {
			if (index === null) return;
			const ids = todos.filter((todo) => todo.id !== id).map((todo) => todo.id);
			ids.splice(index, 0, id);
			if (ids.every((todoId, i) => todoId === todos[i].id)) return;
			reorderTodos({ type, ids });
		} else {
			moveTodo({ id, destination, index });
			onDrop(destination);
		}
	};

	// 할 일을 길게 눌렀을 때 드래그 상태로 설정
	const handleTodoLongPress = (todo) => {
		setDraggingTodo(todo);
	};

	const handleTodoDoubleTap = ({ id, text }) => {
		const options = [t('ui.button.edit'), t('ui.button.delete'), t('ui.button.cancel')];
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
					Alert.alert(t('message.dialog.deleteTitle'), t('message.dialog.deleteMessage'), [
						{
							text: t('ui.button.cancel'),
							onPress: () => {
								return;
							},
							style: 'cancel',
						},
						{
							text: t('ui.button.ok'),
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
						? { backgroundColor: Colors.daily_opaque }
						: type === WEEKLY
						? { backgroundColor: Colors.weekly_opaque }
						: { backgroundColor: Colors.monthly_opaque },
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
							onDragEnd={handleDragEnd}
							itemRef={(ref) => {
								itemRefs.current[item.id] = ref;
							}}
							isEllipsed={true}
						/>
					))}
					{todos.length > 1 && (
						<Text style={styles.hiddenCount}>
							{t('message.todo.remainingItems', { count: todos.length - 1 })}
						</Text>
					)}
					{todos.length === 0 && <AddTodoRow onPress={() => onAddPress(type)} />}
				</>
			) : (
				<Pressable onPress={handlePressBackground} style={styles.content}>
					{/* 할 일 리스트 */}
					<FlatList
						data={todos}
						extraData={`${draggingId}-${targetIndex}-${draggingHeight}-${!!layouts}`}
						keyExtractor={({ id }) => id}
						style={styles.flatList}
						renderItem={({ item, index }) => (
							<TodoItem
								shiftY={getShiftY(index)}
								{...item}
								type={type}
								onLongPress={handleTodoLongPress}
								onDragEnd={handleDragEnd}
								itemRef={(ref) => {
									itemRefs.current[item.id] = ref;
								}}
								onDoubleTap={handleTodoDoubleTap}
								isEditing={editingId === item.id}
							/>
						)}
						ListFooterComponent={
							type === currentSection && <AddTodoRow onPress={() => onAddPress(type)} />
						}
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
		fontFamily: Fonts.regular,
		marginLeft: 32,
		opacity: 0.5,
	},
	isCollapsed: { opacity: 0 },
});

export default Content;
