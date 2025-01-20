import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import IconButton from './IconButton';
import { Colors } from '../../constants/color';
import { useTodoContext } from '../../store/TodoContext';
import { useDragDropContext } from '@/store/DragDropContext';
import { useInsideZone } from '@/hooks/useInsideZone';

const TodoItem = ({
	id,
	text,
	isCompleted,
	type,
	isButtonsVisible,
	onLongPress,
	onEditButtonPress,
}) => {
	// 드래그 위치를 저장하는 shared values
	const { toggleTodo, removeTodo, moveTodo } = useTodoContext();
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

	const handleDeleteButtonPress = async ({ id }) => {
		await removeTodo({ id });
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
			if (dragDestination) {
				if (type === dragDestination) {
					offset.x.value = withSpring(0);
					offset.y.value = withSpring(0);
				} else {
					runOnJS(moveTodo)({ id, destination: dragDestination });
				}
			}

			runOnJS(setDraggingTodo)(null);
			runOnJS(setCurrentPosition)(null);
			runOnJS(setDragStartPosition)(null);
		});

	return (
		<GestureDetector gesture={pan}>
			<TouchableHighlight
				style={[styles.touchableHighlight, isDragging && { opacity: 0 }]}
				underlayColor={Colors.daily_light}
			>
				<Animated.View style={animatedStyles}>
					<View style={styles.container}>
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
							<Text style={[styles.text, isCompleted && { color: 'gray' }]}>
								{text}
							</Text>
						</View>
						{isButtonsVisible && (
							<View style={styles.buttonsContainer}>
								<IconButton
									type='MaterialIcons'
									icon='edit'
									color={Colors.weekly}
									size={16}
									onPress={() => onEditButtonPress({ id, text })}
								/>
								<IconButton
									type='MaterialIcons'
									icon='remove-circle'
									color={Colors.weekly}
									size={16}
									onPress={() => handleDeleteButtonPress({ id })}
								/>
							</View>
						)}
					</View>
				</Animated.View>
			</TouchableHighlight>
		</GestureDetector>
	);
};

const styles = StyleSheet.create({
	touchableHighlight: {
		zIndex: 100,
		borderRadius: 4,
	},
	container: {
		flexDirection: 'row',
		paddingVertical: 6,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	todo: {
		flexDirection: 'row',
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
