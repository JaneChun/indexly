import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { DAILY, MONTHLY, WEEKLY } from '@/constants/type';
import Circle from '../components/Home/Circle';

const Home = () => {
	const navigation = useNavigation();
	const onPress = ({ type }) => {
		navigation.navigate('Todo', { type });
	};
	return (
		<View style={styles.container}>
			<Circle type={MONTHLY} onPress={onPress}>
				<Circle type={WEEKLY} onPress={onPress}>
					<Circle type={DAILY} onPress={onPress}></Circle>
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
