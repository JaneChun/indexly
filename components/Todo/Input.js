import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

const Input = ({ inputValue, setInputValue, onSubmitInputValue }) => {
	const handleInputSubmit = async () => {
		await onSubmitInputValue({ inputValue });
		setInputValue('');
	};

	return (
		<TextInput
			style={styles.input}
			value={inputValue}
			onChangeText={setInputValue}
			onSubmitEditing={handleInputSubmit}
			autoFocus={true}
		/>
	);
};

const styles = StyleSheet.create({
	container: {},
	input: {
		alignSelf: 'center',
		width: '100%',
		height: 50,
		borderRadius: 5,
		paddingHorizontal: 16,
		backgroundColor: 'white',
	},
});

export default Input;
