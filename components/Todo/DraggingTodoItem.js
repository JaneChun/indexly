import { View, Text, StyleSheet } from 'react-native';

import IconButton from '@/components/Todo/IconButton';
import Animated from 'react-native-reanimated';
import { Colors } from '@/constants/color';
import { useDragDropContext } from '@/store/DragDropContext';

const DraggingTodoItem = () => {
	const { draggingTodo, currentPosition, dragStartPosition } =
		useDragDropContext();

	if (!draggingTodo || !currentPosition) {
		return null;
	}

	const { x: curPosX = 0, y: curPosY = 0 } = currentPosition;
	const { x: dragPosX = 0, y: dragPosY = 0 } = dragStartPosition;

	return (
		<Animated.View
			style={[
				{
					transform: [
						{ translateX: curPosX - dragPosX },
						{ translateY: curPosY - dragPosY - 70 },
					],
				},
			]}
		>
			<View style={styles.todoContainer}>
				<View style={styles.todo}>
					<IconButton
						type='MaterialIcons'
						icon='drag-indicator'
						color={Colors.daily}
						size={18}
						onPress={() => {}}
					/>
					<View style={styles.checkContainer}>
						<IconButton
							type='FontAwesome'
							icon={draggingTodo.isCompleted ? 'check-circle' : 'circle-thin'}
							color={Colors.daily}
							size={18}
							onPress={() => {}}
						/>
					</View>
					<Text
						style={[
							styles.todoText,
							draggingTodo.isCompleted && { color: 'gray' },
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
	todoText: {
		flex: 1,
		fontSize: 12,
	},
});

export default DraggingTodoItem;
