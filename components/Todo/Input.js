import { useTheme } from '@/store/ThemeContext';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

const Input = ({ inputValue, setInputValue, resetInput, onSubmit }) => {
	const { colors: Colors } = useTheme();

	return (
		<View style={[styles.container, { borderColor: Colors.done }]}>
			<Entypo name='plus' size={24} color={Colors.done} />
			<TextInput
				style={styles.input}
				value={inputValue}
				onChangeText={setInputValue}
				onSubmitEditing={() => onSubmit({ inputValue })}
				onBlur={resetInput}
				returnKeyType='done'
				autoFocus={true}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		borderTopWidth: 1,
	},
	input: {
		width: '100%',
		height: 50,
		borderRadius: 5,
		paddingHorizontal: 16,
		backgroundColor: 'white',
	},
});

export default Input;
