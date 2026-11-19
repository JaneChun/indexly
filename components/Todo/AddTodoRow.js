import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useLocalization } from '@/store/LocalizationContext';
import { useTheme } from '@/store/ThemeContext';

// 목록 맨 끝의 할 일 추가 줄. 아이콘과 글자를 할 일 항목의 체크 아이콘·글자 위치에 맞춘다.
const AddTodoRow = ({ onPress }) => {
	const { colors: Colors } = useTheme();
	const { t } = useLocalization();

	return (
		<Pressable
			style={({ pressed }) => [styles.container, pressed && styles.pressed]}
			onPress={onPress}
		>
			<View style={styles.iconContainer}>
				<MaterialCommunityIcons name='pencil' size={15} color={Colors.weekly} />
			</View>
			<Text style={[styles.text, { color: Colors.text_done }]}>{t('ui.button.addTodo')}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 7,
	},
	iconContainer: {
		width: 16, // TodoItem 체크 아이콘(circle-thin, 18)과 같은 너비
		marginHorizontal: 8,
		alignItems: 'center',
	},
	text: {
		flex: 1,
		fontSize: 14,
		fontWeight: '500',
		letterSpacing: -0.14,
	},
	pressed: {
		opacity: 0.6,
	},
});

export default AddTodoRow;
