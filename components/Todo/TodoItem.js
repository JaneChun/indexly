import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/color';
import IconButton from './IconButton';

const TodoItem = ({
	id,
	text,
	isCompleted,
	isButtonsVisible,
	onPress,
	onLongPress,
	onEditButtonPress,
	onDeleteButtonPress,
}) => {
	return (
		<TouchableHighlight
			style={styles.touchableHighlight}
			onLongPress={() => onLongPress(id)}
			underlayColor={Colors.daily_light}
		>
			<View style={styles.container}>
				<View style={styles.todo}>
					<View style={styles.iconContainer}>
						<IconButton
							type='FontAwesome'
							icon={isCompleted ? 'check-circle' : 'circle-thin'}
							color={Colors.daily}
							size={18}
							onPress={() => {}}
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
							onPress={() => onDeleteButtonPress({ id })}
						/>
					</View>
				)}
			</View>
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
