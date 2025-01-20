import {
	Text,
	View,
	StyleSheet,
	Pressable,
	InteractionManager,
} from 'react-native';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';

import TodoItem from './TodoItem';
import { Colors } from '@/constants/color';
import { useTypedTodos } from '../../store/TodoContext';
import { useDragDropContext } from '@/store/DragDropContext';
import { useInsideZone } from '../../hooks/useInsideZone';

const Content = ({
	type,
	isEllipsed,
	isCollapsed,
	currentSection,
	onPressBackground,
	onEditButtonPress,
}) => {
	const todos = useTypedTodos(type);
	const { memorizeDroppableZones, draggingTodo, setDraggingTodo } =
		useDragDropContext();
	const isInside = type === useInsideZone();
	const [selectedTodoId, setSelectedTodoId] = useState(null);
	const droppableRef = useRef(null);

	// 섹션이 변경될 때 선택된 할 일 ID를 초기화
	useEffect(() => {
		setSelectedTodoId(null);
	}, [currentSection]);

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
		}, [currentSection]);
	});

	// 할 일을 길게 눌렀을 때 드래그 상태로 설정
	const handleTodoLongPress = (todo) => {
		setDraggingTodo(todo);
	};

	// 배경을 눌렀을 때 선택 상태 해제
	const handlePressBackground = () => {
		if (selectedTodoId || draggingTodo) {
			setSelectedTodoId(null);
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
				isCollapsed && { opacity: 0 },
				isInside && {
					...styles.isInside,
					backgroundColor:
						type == 'Daily' ? Colors.daily_medium : Colors.daily_light,
				},
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
								isButtonsVisible={selectedTodoId === item.id}
								onLongPress={handleTodoLongPress}
								onEditButtonPress={onEditButtonPress}
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
		overflow: 'visible',
	},
	hiddenCount: {
		fontSize: 12,
		marginLeft: 16,
		opacity: 0.5,
	},
});

export default Content;
