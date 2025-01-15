import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/color';

const Loading = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Loading...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 16,
		color: Colors.daily,
	},
});

export default Loading;
