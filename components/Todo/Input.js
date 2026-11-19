import { useTheme } from '@/store/ThemeContext';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { Fonts } from '@/constants/font';

const Input = ({ inputValue, setInputValue, resetInput, onSubmit }) => {
	const { colors: Colors } = useTheme();

	return (
		<View style={[styles.container, { borderColor: Colors.done }]}>
			<View style={styles.iconBox}>
				<Entypo name='plus' size={24} color={Colors.done} />
			</View>
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
		paddingRight: 13,
		borderTopWidth: 1,
	},
	iconBox: {
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		flex: 1,
		fontFamily: Fonts.regular,
		height: 50,
		borderRadius: 5,
		paddingHorizontal: 16,
		backgroundColor: 'white',
	},
});

export default Input;
