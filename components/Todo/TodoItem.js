import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/color';

const TodoItem = ({ id, text, isCompleted, onPress, onLongPress }) => {
	return (
		<TouchableHighlight onLongPress={() => onLongPress({ id, text })}>
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<FontAwesome
						name={isCompleted ? 'check-circle' : 'circle-thin'}
						size={18}
						color={Colors.daily}
					/>
				</View>
				<Text style={styles.text}>{text}</Text>
			</View>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingVertical: 6,
		alignItems: 'center',
	},
	iconContainer: {
		marginRight: 8,
	},
	text: {
		fontSize: 12,
	},
});

export default TodoItem;
