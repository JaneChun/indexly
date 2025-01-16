import { Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useTodoContext } from '@/store/TodoContext';

const DeleteCompletedButton = () => {
	const { removeCompletedTodo } = useTodoContext();

	const handleDeleteCompletedPress = async () => {
		Alert.alert('완료 항목 삭제', '삭제하시겠습니까?', [
			{
				text: 'Cancel',
				onPress: () => {
					return;
				},
				style: 'cancel',
			},
			{
				text: 'OK',
				onPress: async () => {
					await removeCompletedTodo();
				},
			},
		]);
	};
	return (
		<Pressable
			style={({ pressed }) => [styles.container, pressed && styles.pressed]}
			onPress={handleDeleteCompletedPress}
		>
			<Text style={styles.text}>완료 항목 삭제</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8,
	},
	pressed: {
		opacity: 0.7,
	},
	text: {
		fontSize: 12,
		color: 'gray',
	},
});

export default DeleteCompletedButton;
