import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import IconButton from './IconButton';
import { Colors } from '../../constants/color';
import { useTodoContext } from '../../store/TodoContext';
import { useDragDropContext } from '@/store/DragDropContext';

const TodoItem = ({
	id,
	text,
	isCompleted,
	isButtonsVisible,
	onLongPress,
	onEditButtonPress,
	offset,
}) => {
	const { toggleTodo, removeTodo } = useTodoContext();
	const { draggingTodoId } = useDragDropContext();

	const isDragging = draggingTodoId === id;

	const handleCheckButtonPress = async ({ id, isCompleted }) => {
		await toggleTodo({ id, isCompleted });
	};

	const handleDeleteButtonPress = async ({ id }) => {
		await removeTodo({ id });
	};

	// 애니메이션 스타일: 드래그 위치에 따라 뷰의 위치를 변경
	const animatedStyles = useAnimatedStyle(() => {
		const styles = {
			transform: [
				{ translateX: offset.x.value },
				{ translateY: offset.y.value },
			],
		};

		const dragStyles = isDragging
			? {
					borderWidth: 1,
					borderRadius: 8,
					borderColor: Colors.daily,
			  }
			: {};

		return {
			...styles,
			...dragStyles,
		};
	});

	return (
		<TouchableHighlight
			style={styles.touchableHighlight}
			onLongPress={() => onLongPress(id)}
			underlayColor={Colors.daily_light}
		>
			<Animated.View style={animatedStyles}>
				<View style={styles.container}>
					<View style={styles.todo}>
						<View style={styles.iconContainer}>
							<IconButton
								type='FontAwesome'
								icon={isCompleted ? 'check-circle' : 'circle-thin'}
								color={Colors.daily}
								size={18}
								onPress={() => handleCheckButtonPress({ id, isCompleted })}
							/>
						</View>
						<Text style={styles.text}>{text}</Text>
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
	);
};

const styles = StyleSheet.create({
	touchableHighlight: {
		borderRadius: 4,
		paddingHorizontal: 12,
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
	iconContainer: {
		marginRight: 8,
	},
	text: {
		fontSize: 12,
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 5,
	},
});

export default TodoItem;
