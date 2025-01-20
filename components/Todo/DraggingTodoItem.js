import { View, Text, StyleSheet } from 'react-native';

import IconButton from '@/components/Todo/IconButton';
import Animated from 'react-native-reanimated';
import { Colors } from '@/constants/color';
import { useDragDropContext } from '@/store/DragDropContext';

const DraggingTodoItem = () => {
	const {
		draggingTodo,
		currentPosition = { x: 0, y: 0 },
		dragStartPosition = { x: 0, y: 0 },
	} = useDragDropContext();

	return (
		<Animated.View
			style={[
				{
					transform: [
						{ translateX: currentPosition.x - dragStartPosition.x },
						{ translateY: currentPosition.y - dragStartPosition.y - 70 },
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
