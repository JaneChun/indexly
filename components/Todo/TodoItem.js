import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import {
	Gesture,
	GestureDetector,
	TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import { useInsideZone } from '@/hooks/useInsideZone';
import { useDragDropContext } from '@/store/DragDropContext';
import { Colors } from '../../constants/color';
import { useTodoContext } from '../../store/TodoContext';
import IconButton from './IconButton';

const TodoItem = ({
	id,
	text,
	isCompleted,
	type,
	onLongPress,
	onDoubleTap,
	isEllipsed,
}) => {
	// 드래그 위치를 저장하는 shared values
	const { toggleTodo, moveTodo } = useTodoContext();
	const {
		draggingTodo,
		setDraggingTodo,
		setCurrentPosition,
		setDragStartPosition,
	} = useDragDropContext();
	const dragDestination = useInsideZone();
	const offset = { x: useSharedValue(0), y: useSharedValue(0) };

	const isDragging = draggingTodo?.id === id;

	const handleCheckButtonPress = async ({ id, isCompleted }) => {
		Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Light);
		await toggleTodo({ id, isCompleted });
	};

	// 애니메이션 스타일: 드래그 위치에 따라 뷰의 위치를 변경
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: offset.x.value },
				{ translateY: offset.y.value },
			],
		};
	});

	// Pan 제스처 정의 (드래그 동작)
	const pan = Gesture.Pan()
		.activateAfterLongPress(500)
		.onStart((event) => {
			runOnJS(Haptics.selectionAsync)(Haptics.ImpactFeedbackStyle.Light);
			const todo = { id, text, isCompleted, type };

			runOnJS(setDraggingTodo)(todo);
			runOnJS(onLongPress)(todo);
			runOnJS(setDragStartPosition)({ x: event.x, y: event.y });
		})
		.onUpdate((event) => {
			// 드래그 중인 동안 x, y 좌표를 업데이트
			offset.x.value = event.translationX;
			offset.y.value = event.translationY;
			runOnJS(setCurrentPosition)({ x: event.absoluteX, y: event.absoluteY });
		})
		.onEnd(() => {
			if (dragDestination && type !== dragDestination) {
				runOnJS(moveTodo)({ id, destination: dragDestination });
				offset.x.value = withSpring(0);
			}

			offset.x.value = withSpring(0);
			offset.y.value = withSpring(0);

			runOnJS(setDraggingTodo)(null);
			runOnJS(setCurrentPosition)(null);
			runOnJS(setDragStartPosition)(null);
		});

	const handleDoubleTapActivated = () => {
		if (isEllipsed) return;
		onDoubleTap({ id });
	};
	return (
		<GestureDetector gesture={pan}>
			<TapGestureHandler
				numberOfTaps={2}
				onActivated={handleDoubleTapActivated}
			>
				<TouchableHighlight
					style={[styles.touchableHighlight, isDragging && styles.isDragging]}
					underlayColor={Colors.daily_light}
				>
					<Animated.View style={animatedStyles}>
						<View style={styles.container}>
							{/* 할 일 텍스트와 체크 아이콘 */}
							<View style={styles.todo}>
								<View style={styles.checkContainer}>
									<IconButton
										type='FontAwesome'
										icon={isCompleted ? 'check-circle' : 'circle-thin'}
										color={Colors.daily}
										size={18}
										onPress={() => handleCheckButtonPress({ id, isCompleted })}
									/>
								</View>
								<Text
									style={[styles.text, isCompleted && { color: 'gray' }]}
									numberOfLines={isEllipsed ? 1 : undefined}
									ellipsizeMode={isEllipsed ? 'tail' : undefined}
								>
									{text}
								</Text>
							</View>
						</View>
					</Animated.View>
				</TouchableHighlight>
			</TapGestureHandler>
		</GestureDetector>
	);
};

const styles = StyleSheet.create({
	touchableHighlight: {
		borderRadius: 4,
	},
	isDragging: { opacity: 0 },
	container: {
		flexDirection: 'row',
		paddingVertical: 6,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	todo: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkContainer: {
		marginHorizontal: 8,
	},
	text: {
		flex: 1,
		fontSize: 12,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 5,
	},
});

export default TodoItem;
