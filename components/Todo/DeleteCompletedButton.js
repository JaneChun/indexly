import { useLocalization } from '@/store/LocalizationContext';
import { useTodoContext } from '@/store/TodoContext';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

const DeleteCompletedButton = () => {
	const { removeCompletedTodo } = useTodoContext();
	const { t } = useLocalization();

	const handleDeleteCompletedPress = async () => {
		Alert.alert(
			t('message.dialog.deleteCompletedTitle'),
			t('message.dialog.deleteCompletedMessage'),
			[
				{
					text: t('ui.button.cancel'),
					onPress: () => {
						return;
					},
					style: 'cancel',
				},
				{
					text: t('ui.button.ok'),
					onPress: async () => {
						await removeCompletedTodo();
					},
				},
			],
		);
	};
	return (
		<Pressable
			style={({ pressed }) => [styles.container, pressed && styles.pressed]}
			onPress={handleDeleteCompletedPress}
		>
			<Text style={styles.text}>{t('ui.button.deleteCompleted')}</Text>
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
		fontSize: 14,
		color: 'gray',
	},
});

export default DeleteCompletedButton;
