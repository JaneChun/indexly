import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Fonts } from '@/constants/font';
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
	withTiming,
} from 'react-native-reanimated';

import { useInsideZone } from '@/hooks/useInsideZone';
import { useDragDropContext } from '@/store/DragDropContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/store/ThemeContext';
import { useTodoContext } from '../../store/TodoContext';
import CheckBox from './CheckBox';

const TodoItem = ({
	id,
	text,
	isCompleted,
	type,
	onLongPress,
	onDragEnd,
	itemRef,
	shiftY = 0,
	onDoubleTap,
	isEllipsed,
	isEditing,
}) => {
	// 드래그 위치를 저장하는 shared values
	const { toggleTodo } = useTodoContext();
	const { colors: Colors } = useTheme();
	const {
		draggingTodo,
		setDraggingTodo,
		setCurrentPosition,
		setDragStartPosition,
	} = useDragDropContext();
	const dragDestination = useInsideZone();
	const offset = { x: useSharedValue(0), y: useSharedValue(0) };
	// 다른 항목을 드래그할 때 자리를 비켜주는 이동량
	const shift = useSharedValue(0);

	const isDragging = draggingTodo?.id === id;

	// 드래그 중에는 부드럽게 비켜나고, 드래그가 끝나면 바뀐 순서 위치에 바로 맞춘다
	useEffect(() => {
		shift.value = draggingTodo ? withTiming(shiftY, { duration: 180 }) : 0;
	}, [shiftY, draggingTodo]);

	const handleCheckButtonPress = async ({ id, isCompleted }) => {
		Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Light);
		await toggleTodo({ id, isCompleted });
	};

	// 애니메이션 스타일: 드래그 위치에 따라 뷰의 위치를 변경
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: offset.x.value },
				{ translateY: offset.y.value + shift.value },
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
			offset.x.value = withSpring(0);
			offset.y.value = withSpring(0);

			// 드래그 상태 초기화와 이동·순서 변경은 한 번에 처리한다 (Content의 handleDragEnd)
			runOnJS(onDragEnd)(id, dragDestination);
		});

	const handleDoubleTapActivated = () => {
		if (isEllipsed) return;
		onDoubleTap({ id, text });
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
						<View ref={itemRef} style={styles.container}>
							{/* 할 일 텍스트와 체크 아이콘 */}
							<View style={styles.todo}>
								<View style={styles.checkContainer}>
									<CheckBox
										isCompleted={isCompleted}
										color={isCompleted ? Colors.check_done : Colors.daily}
										onPress={() => handleCheckButtonPress({ id, isCompleted })}
									/>
								</View>
								<Text
									style={[
										styles.text,
										{ color: Colors.text },
										isCompleted && {
											color: Colors.text_done,
											textDecorationLine: 'line-through',
											textDecorationColor: Colors.text_done_line,
										},
									]}
									numberOfLines={isEllipsed ? 1 : undefined}
									ellipsizeMode={isEllipsed ? 'tail' : undefined}
								>
									{text}
								</Text>
							</View>

							{/* 버튼 */}
							{isEditing && (
								<MaterialIcons name='edit' color={Colors.weekly} size={16} />
							)}
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
		paddingVertical: 7,
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
		fontSize: 14,
		fontFamily: Fonts.regular,
		letterSpacing: -0.14,
	},
});

export default TodoItem;
