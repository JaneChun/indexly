import { View, Text, StyleSheet, Pressable } from 'react-native';

import Circle from '../components/Home/Circle';

const Home = () => {
	const onPress = () => {};
	return (
		<View style={styles.container}>
			<Circle type='monthly' onPress={onPress}>
				<Circle type='weekly' onPress={onPress}>
					<Circle type='daily' onPress={onPress}></Circle>
				</Circle>
			</Circle>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: '40%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});

export default Home;
