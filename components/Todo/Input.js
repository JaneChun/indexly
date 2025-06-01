import { Colors } from '@/constants/color';
import { Entypo } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

const Input = ({ inputValue, setInputValue, onSubmit }) => {
	const handleInputSubmit = async () => {
		await onSubmit({ inputValue });
	};

	return (
		<View style={styles.container}>
			<Entypo name='plus' size={24} color={Colors.done} />
			<TextInput
				style={styles.input}
				value={inputValue}
				onChangeText={setInputValue}
				onSubmitEditing={handleInputSubmit}
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
		borderColor: Colors.done,
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
