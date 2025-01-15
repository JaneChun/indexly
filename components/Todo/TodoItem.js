import { View, Text, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../../constants/color';

const TodoItem = ({ text, isCompleted, onPress }) => {
	return (
		<View style={styles.container}>
			<Pressable style={styles.iconContainer}>
				<FontAwesome
					name={isCompleted ? 'check-circle' : 'circle-thin'}
					size={18}
					color={Colors.daily}
					onPress={onPress}
				/>
			</Pressable>
			<Text style={styles.text}>{text}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		marginVertical: 6,
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
