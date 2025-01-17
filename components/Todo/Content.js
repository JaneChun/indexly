import { Text, View, StyleSheet, Pressable } from 'react-native';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {
	Gesture,
	GestureDetector,
	FlatList,
} from 'react-native-gesture-handler';
import { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';

import TodoItem from './TodoItem';
import { Colors } from '@/constants/color';
import { useTypedTodos } from '../../store/TodoContext';
import { useDragDropContext } from '@/store/DragDropContext';
import { useInsideZone } from '../../hooks/useInsideZone';

const Content = ({
	type,
	isEllipsed,
	currentSection,
	onPressBackground,
	onEditButtonPress,
}) => {
	const todos = useTypedTodos(type);
	const {
		memorizeDroppableZones,
		setCurrentPosition,
		draggingTodoId,
		setDraggingTodoId,
	} = useDragDropContext();
	const isInside = useInsideZone(type);
	const [selectedTodoId, setSelectedTodoId] = useState(null);
	const droppableRef = useRef(null);

	// 드래그 위치를 저장하는 shared values
	const offset = { x: useSharedValue(0), y: useSharedValue(0) };

	// 섹션이 변경될 때 선택된 할 일 ID를 초기화
	useEffect(() => {
		setSelectedTodoId(null);
	}, [currentSection]);

	// 현재 드롭 가능한 영역의 위치와 크기를 저장
	useLayoutEffect(() => {
		setTimeout(() => {
			droppableRef?.current?.measureInWindow((x, y, width, height) => {
				memorizeDroppableZones({
					type,
					zone: {
						startX: x,
						startY: y,
						endX: x + width,
						endY: y + height,
					},
				});
			});
		}, 100);
	}, [currentSection]);

	// 할 일을 길게 눌렀을 때 드래그 상태로 설정
	const handleTodoLongPress = (id) => {
		console.log('long press!');
		setDraggingTodoId(id);
	};

	// 배경을 눌렀을 때 선택 상태 해제
	const handlePressBackground = () => {
		console.log('press!');
		if (selectedTodoId || draggingTodoId) {
			setSelectedTodoId(null);
			setDraggingTodoId(null);
		} else {
			onPressBackground();
		}
	};

	// Pan 제스처 정의 (드래그 동작)
	const pan = Gesture.Pan()
		.onStart(() => {})
		.onUpdate((event) => {
			// 드래그 중인 동안 x, y 좌표를 업데이트
			offset.x.value = event.translationX;
			offset.y.value = event.translationY;
			runOnJS(setCurrentPosition)({ x: event.absoluteX, y: event.absoluteY });
		})
		.onEnd(() => {
			// 드래그 종료 시 좌표 초기화 (원래 위치로 복귀)
			offset.x.value = withSpring(0);
			offset.y.value = withSpring(0);
			runOnJS(setDraggingTodoId)(null);
		});

	if (isEllipsed) {
		const previews = todos.slice(0, 1);
		return (
			<View
				ref={droppableRef}
				style={
					isInside && {
						...styles.isInside,
						backgroundColor: Colors.daily_light,
					}
				}
			>
				{previews.map((item) => (
					<TodoItem
						key={item.id}
						{...item}
						type={type}
						onLongPress={handleTodoLongPress}
						offset={offset}
					/>
				))}
				{todos.length > 1 && (
					<Text style={styles.hiddenCount}>+ {todos.length - 1}개의 할 일</Text>
				)}
			</View>
		);
	}

	return (
		<Pressable onPress={handlePressBackground} style={styles.content}>
			{/* 할 일 리스트 */}
			<FlatList
				data={todos}
				keyExtractor={({ id }) => id}
				style={styles.flatList}
				renderItem={({ item }) => (
					<GestureDetector gesture={pan}>
						<TodoItem
							{...item}
							type={type}
							isButtonsVisible={selectedTodoId === item.id}
							onLongPress={handleTodoLongPress}
							onEditButtonPress={onEditButtonPress}
							offset={offset}
						/>
					</GestureDetector>
				)}
			/>
			{/* 드래그 중인 오버레이 */}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {},
	content: {
		flex: 1,
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
