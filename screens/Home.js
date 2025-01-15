import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Circle from '../components/Home/Circle';

const Home = () => {
	const navigation = useNavigation();
	const onPress = ({ type }) => {
		console.log(type);
		navigation.navigate('Todo');
	};
	return (
		<View style={styles.container}>
			<Circle type='Monthly' onPress={onPress}>
				<Circle type='Weekly' onPress={onPress}>
					<Circle type='Daily' onPress={onPress}></Circle>
				</Circle>
			</Circle>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: '60%',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});

export default Home;
