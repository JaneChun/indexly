import { StyleSheet, Text, View } from 'react-native';
import { Fonts } from '@/constants/font';

import CheckBox from '@/components/Todo/CheckBox';
import { useDragDropContext } from '@/store/DragDropContext';
import { useTheme } from '@/store/ThemeContext';
import Animated from 'react-native-reanimated';

const DraggingTodoItem = ({ containerWidth }) => {
	const { draggingTodo, currentPosition, dragStartPosition } = useDragDropContext();
	const { colors: Colors } = useTheme();

	if (!draggingTodo || !currentPosition) {
		return null;
	}

	const { x: curPosX = 0, y: curPosY = 0 } = currentPosition;
	const { x: dragPosX = 0, y: dragPosY = 0 } = dragStartPosition;

	return (
		<Animated.View
			style={[
				{
					transform: [{ translateX: curPosX - dragPosX }, { translateY: curPosY - dragPosY - 70 }],
				},
			]}
		>
			<View
				style={[styles.todoContainer, { width: containerWidth, shadowColor: Colors.shadow }]}
			>
				<View style={styles.todo}>
					<View style={styles.checkContainer}>
						<CheckBox
							isCompleted={draggingTodo.isCompleted}
							color={draggingTodo.isCompleted ? Colors.check_done : Colors.daily}
							onPress={() => {}}
						/>
					</View>
					<Text
						style={[
							styles.todoText,
							{ color: Colors.text },
							draggingTodo.isCompleted && {
								color: Colors.text_done,
								textDecorationLine: 'line-through',
								textDecorationColor: Colors.text_done_line,
							},
						]}
					>
						{draggingTodo.text}
					</Text>
				</View>
			</View>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	todoContainer: {
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 6,
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
		borderRadius: 14,
		transform: [{ rotate: '-2deg' }, { scale: 1.04 }],
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 8,
	},
	todo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	checkContainer: {
		marginHorizontal: 8,
	},
	todoText: {
		flex: 1,
		fontSize: 14,
		fontFamily: Fonts.medium,
		letterSpacing: -0.14,
	},
});

export default DraggingTodoItem;
